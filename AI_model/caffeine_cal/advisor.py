# AI_model/caffeine_cal/advisor.py
from __future__ import annotations

from datetime import datetime, timedelta, date
from typing import List, Dict, Any, Optional
import math

from .models import Intake
from .half_life_personal import residual_caffeine_at

SAFE_THRESHOLD_MG: float = 50.0

def get_safe_threshold_for_user(
    user_id: Optional[int] = None,
    sensitivity: Optional[float] = None,
) -> float:
    """
    민감도(S)에 따라 수면 시 잔여 카페인 허용 상한선을 조정.

    - |S| < 0.05  : 카페인과 수면의 상관성이 거의 없음 → 300mg까지 허용
    - |S| < 0.10  : 약간 둔감 → 200mg
    - 그 외       : 기본값 SAFE_THRESHOLD_MG (50mg)
    """
    base = SAFE_THRESHOLD_MG

    if sensitivity is None:
        return base

    if abs(sensitivity) < 0.05:
        # 거의 영향 없는 둔감형
        return 300.0
    elif abs(sensitivity) < 0.10:
        # 약간 둔감
        return 200.0
    else:
        # 보통 또는 예민
        return base
    
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
    dose_mg: float = 150.0,
    step_minutes: int = 10,
    safe_threshold_mg: Optional[float] = None,
    user_id: Optional[int] = None,
    base_day: Optional[date] = None,
) -> Dict[str, Any]:
    """
    선택된 날짜(base_day)를 기준으로, 해당 날짜 안에서
    dose_mg 한 잔을 추가로 마실 수 있는 마지막 시각을 찾기.

    - base_day 가 주어지면: base_day 00:00 ~ target_sleep_at 사이 탐색
    - base_day 가 없으면: now ~ target_sleep_at 사이 탐색
    """
    # API에서 safe_threshold_mg를 넘겨주지 않으면 여기서 계산
    if safe_threshold_mg is None:
        safe_threshold_mg = get_safe_threshold_for_user(user_id)

    if base_day is not None:
        start = datetime(base_day.year, base_day.month, base_day.day, 0, 0, 0)
    else:
        start = datetime.now()

    end = target_sleep_at

    if end <= start:
        return {
            "possible": False,
            "reason": "target_sleep_at_is_past",
            "latestAllowedTime": None,
            "safeThreshold": safe_threshold_mg,
        }

    base_at_sleep = residual_caffeine_at(target_sleep_at, intakes, half_life_h)

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
        extra = _residual_from_single_drink(
            t, dose_mg, half_life_h, target_sleep_at
        )
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
        "latestAllowedTime": latest_safe.isoformat(
            sep="T", timespec="minutes"
        ),
        "caffeineAtSleepIfDrink": round(latest_c_at_sleep, 1),
        "baseCaffeineAtSleep": round(base_at_sleep, 1),
        "doseMg": dose_mg,
        "safeThreshold": safe_threshold_mg,
    }
