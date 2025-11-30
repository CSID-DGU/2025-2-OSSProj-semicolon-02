# AI_model/caffeine_cal/api.py
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict

from flask import Blueprint, request, jsonify

from .data_access import (
    load_intakes_for_user,
    load_sleep_logs_for_user,
)
from .half_life_curve import (
    estimate_half_life_curve,
    build_daily_curve,
)
from .ml_estimator import estimate_half_life_ml
from .advisor import find_latest_safe_drink_time

bp = Blueprint("caffeine_cal", __name__)


@bp.route("/caffeine-cal/summary", methods=["GET"])
def caffeine_summary() -> Any:
    """
    쿼리 파라미터:
      userId: 필수
      date:   선택 (YYYY-MM-DD, 없으면 오늘)
      doseMg: 선택 (아메리카노 한 잔 mg, 기본 80)

    응답:
      {
        "userId": 1,
        "date": "2025-11-30",
        "halfLifeHours": 5.2,
        "halfLifeMethod": "fixed_default" | "curve" | "ml",
        "curve": [...],  # [{ time, caffeineMg }, ...]
        "latestDrinkPlan": { ... },
        "debug": {
          "numIntakes": ...,
          "numSleepLogs": ...,
          "sleepDays": ...,
          "scores": { "3.0": r, ... }
        }
      }
    """
    user_id = request.args.get("userId", type=int)
    if not user_id:
        return jsonify({"error": "userId is required"}), 400

    date_str = request.args.get("date")
    dose_mg = request.args.get("doseMg", default=80, type=float)

    if date_str:
        try:
            day = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "date must be YYYY-MM-DD"}), 400
    else:
        day = datetime.now()

    # 1) DB에서 최근 60일 데이터 로딩
    intakes = load_intakes_for_user(user_id, days=60)
    sleeps = load_sleep_logs_for_user(user_id, days=60)

    sleep_days = len(sleeps)

    # 2) 반감기 추정 전략 선택
    if sleep_days < 3:
        # 데이터가 너무 적을 때는 5.0h 기본값 고정
        half_life_h = 5.0
        scores: Dict[str, float] = {}
        method = "fixed_default"
    elif sleep_days < 7:
        # 3~6일 정도 데이터면 curve fitting으로 대략 개인화
        half_life_h, curve_scores = estimate_half_life_curve(intakes, sleeps)
        scores = {f"{k:.1f}": v for k, v in curve_scores.items()}
        method = "curve"
    else:
        # 7일 이상이면 ML 인터페이스 사용 (현재는 curve stub)
        half_life_h, scores = estimate_half_life_ml(intakes, sleeps)
        method = "ml"

    # 3) 해당 날짜 곡선 생성
    curve = build_daily_curve(intakes, half_life_h, day)

    # 4) 목표 취침 시간 추정 (가장 최근 수면 로그 기준)
    if sleeps:
        latest_sleep = sleeps[-1]
        target_sleep_at = latest_sleep.sleep_at.replace(
            year=day.year, month=day.month, day=day.day
        )
    else:
        # 수면 로그 없으면, 오늘 23:00을 임의 취침 시간으로 사용 (정책값)
        target_sleep_at = day.replace(hour=23, minute=0, second=0, microsecond=0)

    # 5) 언제까지 dose_mg 한 잔을 마실 수 있는지 계산
    drink_plan = find_latest_safe_drink_time(
        intakes=intakes,
        half_life_h=half_life_h,
        target_sleep_at=target_sleep_at,
        dose_mg=dose_mg,
        user_id=user_id,
    )

    res: Dict[str, Any] = {
        "userId": user_id,
        "date": day.strftime("%Y-%m-%d"),
        "halfLifeHours": round(half_life_h, 2),
        "halfLifeMethod": method,
        "curve": curve,
        "latestDrinkPlan": drink_plan,
        "debug": {
            "numIntakes": len(intakes),
            "numSleepLogs": len(sleeps),
            "sleepDays": sleep_days,
            "scores": scores,
        },
    }

    return jsonify(res)
