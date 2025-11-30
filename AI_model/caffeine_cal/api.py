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
from .advisor import find_latest_safe_drink_time

bp = Blueprint("caffeine_cal", __name__)


@bp.route("/caffeine-cal/summary", methods=["GET"])
def caffeine_summary() -> Any:
    user_id = request.args.get("userId", type=int)
    if not user_id:
        return jsonify({"error": "userId is required"}), 400

    date_str = request.args.get("date")
    dose_mg = request.args.get("doseMg", default=80, type=float)

    if date_str:
        try:
            day_dt = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "date must be YYYY-MM-DD"}), 400
    else:
        day_dt = datetime.now()
    base_day: date = day_dt.date()

    intakes = load_intakes_for_user(user_id, days=60)
    sleeps = load_sleep_logs_for_user(user_id, days=60)

    half_life_h, sensitivity, debug = estimate_two_param(
        intakes=intakes,
        sleeps=sleeps,
    )

    # 그래프
    curve = build_daily_curve(intakes, half_life_h, day_dt)

    # 취침 시간 결정
    if sleeps:
        sleep_time = sleeps[-1].sleep_at.time()
        target_sleep_at = datetime.combine(base_day, sleep_time)
    else:
        target_sleep_at = datetime.combine(base_day, time(23, 0))

    drink_plan = find_latest_safe_drink_time(
        intakes=intakes,
        half_life_h=half_life_h,
        target_sleep_at=target_sleep_at,
        dose_mg=dose_mg,
        user_id=user_id,
        base_day=base_day,
    )

    return jsonify(
        {
            "userId": user_id,
            "date": base_day.strftime("%Y-%m-%d"),
            "halfLifeHours": round(half_life_h, 2),
            # 프론트에서 사용하는 키 이름에 맞춤
            "halfLifeMethod": "two_param_ml",
            # 민감도 S (minutes / mg 스케일, 그대로 노출)
            "sensitivity": round(sensitivity, 3),
            "curve": curve,
            "latestDrinkPlan": drink_plan,
            "debug": debug,
        }
    )
