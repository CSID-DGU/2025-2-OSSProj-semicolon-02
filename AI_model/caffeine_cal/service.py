# AI_model/caffeine_cal/service.py
from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict, Any

from flask import Blueprint, request, jsonify

from .data_access import load_intakes_for_user
from .models import Intake
from .half_life_personal import build_daily_curve
from .advisor import find_latest_safe_drink_time

bp = Blueprint("caffeine_cal", __name__, url_prefix="/caffeine-cal")


def _parse_user_id() -> int:
    try:
        return int(request.args["userId"])
    except Exception:
        raise ValueError("userId 쿼리 파라미터가 필요합니다.")


@bp.route("/curve", methods=["GET"])
def curve() -> Any:
    user_id = _parse_user_id()

    # 최근 30일 기준 섭취 내역
    intakes: list[Intake] = load_intakes_for_user(user_id=user_id, days=30)

    # 일단 반감기 5시간 고정 (나중에 개인 반감기 추정 로직으로 교체)
    half_life_h = 5.0

    # 오늘 0시 기준 ~ 24시간 그래프
    now = datetime.now()
    start = datetime(now.year, now.month, now.day, 0, 0, 0)
    end = start + timedelta(hours=24)

    curve_points = build_curve(
        intakes=intakes,
        half_life_h=half_life_h,
        start=start,
        end=end,
        step_minutes=30,
    )

    # 그래프용으로 간단한 { "HH:mm": mg } 형태로 반환
    scores: Dict[str, float] = {}
    for t, mg in curve_points:
        hm = t.strftime("%H:%M")
        scores[hm] = round(mg, 1)

    return jsonify(
        {
            "half_life_hours": half_life_h,
            "scores": scores,
        }
    )


@bp.route("/advice", methods=["GET"])
def advice() -> Any:
    user_id = _parse_user_id()

    # 쿼리 파라미터로 targetSleepAt 받기 (예: 2025-11-27T23:30)
    target_sleep_at_str = request.args.get("targetSleepAt")
    if not target_sleep_at_str:
        return jsonify({"error": "targetSleepAt 쿼리 파라미터가 필요합니다."}), 400

    target_sleep_at = datetime.fromisoformat(target_sleep_at_str)

    intakes: list[Intake] = load_intakes_for_user(user_id=user_id, days=1)
    half_life_h = 5.0

    plan = find_latest_safe_drink_time(
        intakes=intakes,
        half_life_h=half_life_h,
        target_sleep_at=target_sleep_at,
        dose_mg=80.0,
    )

    return jsonify(
        {
            "half_life_hours": half_life_h,
            "plan": plan,
        }
    )
