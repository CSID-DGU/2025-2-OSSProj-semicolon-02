# AI_model/caffeine_cal/half_life_curve.py
from __future__ import annotations

import math
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple

from .models import Intake, SleepLog


def _residual_caffeine_at(
    t: datetime,
    intakes: List[Intake],
    half_life_h: float,
) -> float:
    """
    시각 t에서의 남은 카페인 총량 (mg).
    C(t) = sum( dose * exp(-lambda * dt) ), lambda = ln(2) / T_half
    """
    lam = math.log(2.0) / half_life_h
    total = 0.0

    for intake in intakes:
        if intake.consumed_at > t:
            continue

        dt_h = (t - intake.consumed_at).total_seconds() / 3600.0
        total += intake.caffeine_mg * math.exp(-lam * dt_h)

    return total


def _build_pairs_for_fitting(
    intakes: List[Intake],
    sleeps: List[SleepLog],
    target_minutes: int = 7 * 60,
    window_hours: int = 18,
):
    """
    (잔여 카페인, 수면부족 정도) 쌍을 만들기 위한 준비
    잔여 카페인 0에서의 수면 시간'도 함께 학습에 사용
    """
    pairs = []
    for log in sleeps:
        start = log.sleep_at - timedelta(hours=window_hours)
        relevant = [i for i in intakes if start <= i.consumed_at <= log.sleep_at]

        # 여기서 더 이상 continue 하지 않음.
        # relevant가 빈 리스트면, 나중에 _residual_caffeine_at 호출 시 0이 나옴.
        sleep_debt = max(0, target_minutes - log.duration_minutes)
        pairs.append((relevant, log.sleep_at, float(sleep_debt)))

    return pairs


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


def estimate_half_life_curve(
    intakes: List[Intake],
    sleeps: List[SleepLog],
) -> Tuple[float, Dict[float, float]]:
    """
    데이터가 적을 때 사용할 Curve fitting 기반 반감기 추정
    3.0h ~ 8.0h 범위에서 가장 상관계수가 큰 T를 선택
    """
    pairs = _build_pairs_for_fitting(intakes, sleeps)
    if not pairs:
        # 수면로그 자체가 너무 적을 때는 5.0h 고정
        return 5.0, {}

    candidate_T = [x / 10.0 for x in range(30, 81, 5)]  # 3.0, 3.5, ..., 8.0
    scores: Dict[float, float] = {}
    best_T = 5.0
    best_score = -1e9

    for T in candidate_T:
        xs: List[float] = []
        ys: List[float] = []

        for relevant, sleep_at, sleep_debt in pairs:
            xs.append(_residual_caffeine_at(sleep_at, relevant, T))
            ys.append(sleep_debt)

        r = _pearson(xs, ys)
        scores[T] = r

        if r > best_score:
            best_score = r
            best_T = T

    return best_T, scores


def build_daily_curve(
    intakes: List[Intake],
    half_life_h: float,
    day: datetime,
    step_minutes: int = 30,
) -> List[Dict[str, Any]]:
    """
    해당 날짜(day) 00:00~24:00 카페인 곡선
    RN 그래프 데이터로 사용
    """
    start = datetime(day.year, day.month, day.day, 0, 0, 0)
    end = start + timedelta(days=1)

    points: List[Dict[str, Any]] = []
    t = start
    while t <= end:
        level = _residual_caffeine_at(t, intakes, half_life_h)
        points.append(
            {
                "time": t.isoformat(sep="T", timespec="minutes"),
                "caffeineMg": round(level, 2),
            }
        )
        t += timedelta(minutes=step_minutes)

    return points


def predict_caffeine_at(
    t: datetime,
    intakes: List[Intake],
    half_life_h: float,
) -> float:
    """
    외부에서 임의 시점의 카페인 잔여량이 필요할 때 사용하는 함수.
    """
    return _residual_caffeine_at(t, intakes, half_life_h)


def residual_caffeine_at(
    t: datetime,
    intakes: List[Intake],
    half_life_h: float,
) -> float:
    """
    ML 쪽에서 재사용하기 위한 public 래퍼.
    """
    return _residual_caffeine_at(t, intakes, half_life_h)
