# AI_model/caffeine_cal/sensitivity.py
from __future__ import annotations

from typing import List, Tuple
from datetime import timedelta
import math

from .models import Intake, SleepLog
from .half_life_curve import residual_caffeine_at

def _pearson(xs: List[float], ys: List[float]) -> float:
    n = len(xs)
    if n < 2:
        return 0.0

    mean_x = sum(xs) / n
    mean_y = sum(ys) / n

    num = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))
    den_x = math.sqrt(sum((x - mean_x) ** 2 for x in xs))
    den_y = math.sqrt(sum((y - mean_y) ** 2 for y in ys))
    den = den_x * den_y
    if den == 0:
        return 0.0
    return num / den


def estimate_sensitivity(
    intakes: List[Intake],
    sleeps: List[SleepLog],
    half_life_h: float,
    target_minutes: int = 7 * 60,
    window_hours: int = 18,
) -> Tuple[float, bool]:
    """
    주어진 half_life_h 에 대해
    - xs: 수면 직전 잔여 카페인
    - ys: 수면부족(sleep_debt)
    의 피어슨 상관계수 절댓값을 0~1 사이의 민감도으로 사

    insensitive_tag:
      · |r| < 0.15 이고
      · 평균 sleep_debt < 30분 이면 True
    """
    if len(sleeps) < 3:
        return 0.0, False

    xs: List[float] = []
    ys: List[float] = []

    for log in sleeps:
        start = log.sleep_at - timedelta(hours=window_hours)
        relevant = [i for i in intakes if start <= i.consumed_at <= log.sleep_at]
        c_at_sleep = residual_caffeine_at(log.sleep_at, relevant, half_life_h)

        sleep_debt = max(0, target_minutes - log.duration_minutes)
        xs.append(c_at_sleep)
        ys.append(float(sleep_debt))

    if len(xs) < 3:
        return 0.0, False

    r = _pearson(xs, ys)
    sensitivity_raw = abs(r)            # 0 ~ 1
    sensitivity = round(sensitivity_raw, 2)

    avg_debt = sum(ys) / len(ys) if ys else 0.0
    insensitive = (sensitivity_raw < 0.15) and (avg_debt < 30.0)

    return sensitivity, insensitive
