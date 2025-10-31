# AI_model/caffeine_cal/advisor.py
from __future__ import annotations

from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import math

from .models import Intake
from .half_life_curve import predict_caffeine_at


SAFE_THRESHOLD_MG: float = 30.0  # 취침 시 잔여 카페인 목표 값 (정확한 의학값은 아님 – 추측입니다.)


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
) -> Dict[str, Any]:
    """
    오늘 기준으로, dose_mg 짜리 한 잔을 추가로 마실 때
    취침 시 잔여 카페인이 SAFE_THRESHOLD_MG 이하가 되도록 허용되는
    '마지막 가능 시각'을 찾습니다.
    """
    now = datetime.now()
    start = now
    end = target_sleep_at

    if end <= start:
        # 이미 취침 시간 지났거나 이상한 입력일 경우
        return {
            "possible": False,
            "reason": "target_sleep_at_is_past",
            "latestAllowedTime": None,
        }

    # 기준: 현재까지 마신 것만으로 취침 시 잔여 카페인
    base_at_sleep = predict_caffeine_at(target_sleep_at, intakes, half_life_h)

    # 만약 base_at_sleep 자체가 이미 임계값을 넘으면, 더 못 마신다고 판단
    if base_at_sleep >= SAFE_THRESHOLD_MG:
        return {
            "possible": False,
            "reason": "already_over_threshold",
            "latestAllowedTime": None,
            "caffeineAtSleep": round(base_at_sleep, 1),
        }

    latest_safe: Optional[datetime] = None
    latest_c_at_sleep: float = base_at_sleep

    # 뒤에서 앞으로 (취침 직전→현재 시간) 거꾸로 검사해도 되고,
    # 여기서는 현재→취침 직전 순으로 보면서 계속 업데이트합니다.
    t = start
    while t <= end:
        extra = _residual_from_single_drink(t, dose_mg, half_life_h, target_sleep_at)
        total = base_at_sleep + extra

        if total <= SAFE_THRESHOLD_MG:
            latest_safe = t
            latest_c_at_sleep = total

        t += timedelta(minutes=step_minutes)

    if latest_safe is None:
        return {
            "possible": False,
            "reason": "no_safe_slot",
            "latestAllowedTime": None,
            "caffeineAtSleep": round(base_at_sleep, 1),
        }

    return {
        "possible": True,
        "latestAllowedTime": latest_safe.isoformat(sep="T", timespec="minutes"),
        "caffeineAtSleepIfDrink": round(latest_c_at_sleep, 1),
        "baseCaffeineAtSleep": round(base_at_sleep, 1),
        "doseMg": dose_mg,
        "safeThreshold": SAFE_THRESHOLD_MG,
    }
