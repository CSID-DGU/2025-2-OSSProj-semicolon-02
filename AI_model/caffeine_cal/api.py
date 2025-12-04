# AI_model/caffeine_cal/api.py
from __future__ import annotations
from datetime import datetime, date, time
from typing import Any, Dict

from flask import Blueprint, request, jsonify

from .data_access import load_intakes_for_user, load_sleep_logs_for_user
from .half_life_personal import (
    estimate_two_param,
    build_daily_curve,
)
from .advisor import find_latest_safe_drink_time, get_safe_threshold_for_user

bp = Blueprint("caffeine_cal", __name__)

from datetime import datetime, time, timedelta, date

@bp.route("/caffeine-cal/summary", methods=["GET"])
def caffeine_summary() -> Any:
    """
    쿼리 파라미터:
      userId: 필수
      date:   선택 (YYYY-MM-DD, 없으면 오늘)
      doseMg: 선택 (아메리카노 한 잔 mg, 기본 150)
      targetSleepTime: 선택 (HH:MM, 예: "23:30")
    """
    user_id = int(request.args.get("userId"))
    date_str = request.args.get("date")
    dose_mg = float(request.args.get("doseMg", 150.0))
    target_sleep_time = request.args.get("targetSleepTime")  # "23:30" 같은 문자열

    # 기준 날짜
    if date_str:
        base_day = datetime.strptime(date_str, "%Y-%m-%d").date()
    else:
        base_day = date.today()

    # 기본 취침 시각 처리
    if target_sleep_time:
        hh, mm = map(int, target_sleep_time.split(":"))
    else:
        # targetSleepTime이 없으면 기본 23:30 (같은 날 밤)
        hh, mm = 23, 30

    # 새벽(예: 00:30, 01:30 등)은 "다음 날 새벽"으로 해석
    if hh < 12:
        target_day = base_day + timedelta(days=1)
    else:
        target_day = base_day

    target_sleep_at = datetime(
        target_day.year, target_day.month, target_day.day, hh, mm, 0
    )

    intakes = load_intakes_for_user(user_id)
    sleeps = load_sleep_logs_for_user(user_id)

    # 개인 반감기 + 민감도 추정
    half_life_h, sensitivity, debug = estimate_two_param(intakes, sleeps)

    # 하루 곡선 (기준 날짜의 00:00~24:00)
    curve = build_daily_curve(
        intakes,
        half_life_h,
        datetime.combine(base_day, time(0, 0))
    )

    # 민감도 기반 수면 상한선 결정
    safe_threshold = get_safe_threshold_for_user(user_id, sensitivity)

    # 추가 섭취 가능 시간 계산 (아이스 아메리카노 1잔 = dose_mg)
    latest_drink_plan = find_latest_safe_drink_time(
        intakes=intakes,
        half_life_h=half_life_h,
        target_sleep_at=target_sleep_at,
        dose_mg=dose_mg,
        user_id=user_id,
        base_day=base_day,
        safe_threshold_mg=safe_threshold,
    )

    return jsonify(
        {
            "userId": user_id,
            "date": base_day.isoformat(),
            "halfLifeHours": half_life_h,
            "halfLifeMethod": debug.get("reason", "two_param_ml"),
            "sensitivity": sensitivity,
            "curve": curve,
            "latestDrinkPlan": latest_drink_plan,
        }
    )
