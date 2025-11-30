# AI_model/caffeine_cal/api.py
from __future__ import annotations

from datetime import datetime, date, time
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

    # --- 선택한 날짜 파싱 (기본은 오늘) ---
    if date_str:
        try:
            day_dt = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "date must be YYYY-MM-DD"}), 400
    else:
        day_dt = datetime.now()

    base_day: date = day_dt.date()

    # DB에서 최근 60일 데이터 로딩 (개인 반감기 추정용)
    intakes = load_intakes_for_user(user_id, days=60)
    sleeps = load_sleep_logs_for_user(user_id, days=60)

    sleep_days = len(sleeps)

    # 반감기 추정 전략 선택
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
        # 7일 이상이면 ML 인터페이스 사용
        half_life_h, scores = estimate_half_life_ml(intakes, sleeps)
        method = "ml"

    # 해당 날짜 곡선 생성 (선택한 날짜 기준 00:00~24:00)
    curve = build_daily_curve(intakes, half_life_h, day_dt)

    # 목표 취침 시간 추정
    if sleeps:
        # 가장 최근 수면 로그의 "시간대"를 가져와서, 선택한 날짜(base_day)에 맞춰 재조합
        latest_sleep = sleeps[-1]
        sleep_time = latest_sleep.sleep_at.time()
        target_sleep_at = datetime.combine(base_day, sleep_time)
    else:
        # 수면 로그 없으면, 선택한 날짜의 23:00을 임의 취침 시간으로 사용
        target_sleep_at = datetime.combine(base_day, time(23, 0))

    # 언제까지 dose_mg 한 잔을 마실 수 있는지 계산
    #    → base_day를 넘겨서, "그날 하루 안에서" 안전한 마지막 시각을 찾도록 함
    drink_plan = find_latest_safe_drink_time(
        intakes=intakes,
        half_life_h=half_life_h,
        target_sleep_at=target_sleep_at,
        dose_mg=dose_mg,
        user_id=user_id,
        base_day=base_day,
    )

    res: Dict[str, Any] = {
        "userId": user_id,
        "date": base_day.strftime("%Y-%m-%d"),
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
