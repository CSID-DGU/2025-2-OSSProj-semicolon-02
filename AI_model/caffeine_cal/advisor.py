# AI_model/caffeine_cal/advisor.py
from __future__ import annotations

from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import math

from .models import Intake
from .half_life_curve import predict_caffeine_at

# 취침 시 잔여 카페인 목표값.
# 지금은 정책값으로 30mg 고정.
SAFE_THRESHOLD_MG: float = 30.0


def get_safe_threshold_for_user(user_id: Optional[int] = None) -> float:
    """
    향후 사용자별 튜닝을 위해 뺀 함수
    현재는 user_id와 무관하게 30mg 고정으로 반환
    """
    return SAFE_THRESHOLD_MG


def _residual_from_single_drink(
    drink_time: datetime,
    dose_mg: float,
    half_life_h: float,
    at_time: datetime,
) -> float:
    if drink_time > at_time:
        return 0.0
    dt_h = (at_time - drink_time).total_seconds() / 3600.0
    lam = math.log(2.0) / half_life_h
    return dose_mg * math.exp(-lam * dt_h)


def find_latest_safe_drink_time(
    intakes: List[Intake],
    half_life_h: float,
    target_sleep_at: datetime,
    dose_mg: float = 80.0,
    step_minutes: int = 10,
    safe_threshold_mg: Optional[float] = None,
    user_id: Optional[int] = None,
) -> Dict[str, Any]:
    """
    오늘 기준으로 dose_mg 한 잔을 추가로 마실 때
    취침 시 잔여 카페인이 safe_threshold_mg 이하가 되도록 허용되는 마지막 가능 시각 찾음음
    """
    now = datetime.now()
    start = now
    end = target_sleep_at

    if safe_threshold_mg is None:
        safe_threshold_mg = get_safe_threshold_for_user(user_id)

    if end <= start:
        # 이미 취침 시간이 지났거나 이상한 입력
        return {
            "possible": False,
            "reason": "target_sleep_at_is_past",
            "latestAllowedTime": None,
            "safeThreshold": safe_threshold_mg,
        }

    # 기준: 현재까지 마신 것만으로 취침 시 잔여 카페인
    base_at_sleep = predict_caffeine_at(target_sleep_at, intakes, half_life_h)

    # 이미 임계값을 넘으면 더 못 마심
    if base_at_sleep >= safe_threshold_mg:
        return {
            "possible": False,
            "reason": "already_over_threshold",
            "latestAllowedTime": None,
            "caffeineAtSleep": round(base_at_sleep, 1),
            "safeThreshold": safe_threshold_mg,
        }

    latest_safe: Optional[datetime] = None
    latest_c_at_sleep: float = base_at_sleep

    t = start
    while t <= end:
        extra = _residual_from_single_drink(t, dose_mg, half_life_h, target_sleep_at)
        total = base_at_sleep + extra

        if total <= safe_threshold_mg:
            latest_safe = t
            latest_c_at_sleep = total

        t += timedelta(minutes=step_minutes)

    if latest_safe is None:
        return {
            "possible": False,
            "reason": "no_safe_slot",
            "latestAllowedTime": None,
            "caffeineAtSleep": round(base_at_sleep, 1),
            "safeThreshold": safe_threshold_mg,
        }

    return {
        "possible": True,
        "latestAllowedTime": latest_safe.isoformat(sep="T", timespec="minutes"),
        "caffeineAtSleepIfDrink": round(latest_c_at_sleep, 1),
        "baseCaffeineAtSleep": round(base_at_sleep, 1),
        "doseMg": dose_mg,
        "safeThreshold": safe_threshold_mg,
    }
