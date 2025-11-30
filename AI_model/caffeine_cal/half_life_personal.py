from __future__ import annotations
import math
from datetime import datetime, timedelta
from typing import List, Tuple, Dict, Any

from .models import Intake, SleepLog


def residual_caffeine_at(
    t: datetime,
    intakes: List[Intake],
    half_life_h: float,
) -> float:
    """시각 t에서 전체 잔여 카페인 (mg)"""
    lam = math.log(2) / half_life_h
    total = 0.0

    for intake in intakes:
        if intake.consumed_at > t:
            continue
        dt_h = (t - intake.consumed_at).total_seconds() / 3600
        total += intake.caffeine_mg * math.exp(-lam * dt_h)

    return total


def build_pairs(
    intakes: List[Intake],
    sleeps: List[SleepLog],
    target_minutes: int = 7 * 60,
    window_hours: int = 18,
):
    """
    수면 로그마다:
    - 수면 직전 잔여 카페인 C_T를 계산하기 위한 (intakes 기간, sleep_at, sleep_debt) 생성
    """
    pairs = []
    for log in sleeps:
        start = log.sleep_at - timedelta(hours=window_hours)
        relevant = [i for i in intakes if start <= i.consumed_at <= log.sleep_at]
        sleep_debt = max(0, target_minutes - log.duration_minutes)
        pairs.append((relevant, log.sleep_at, sleep_debt))
    return pairs


def fit_sensitivity(xs: List[float], ys: List[float]) -> float:
    """S = Σ(x*y) / Σ(x^2)  (closed-form)"""
    num = sum(x * y for x, y in zip(xs, ys))
    den = sum(x * x for x in xs)
    if den == 0:
        return 0.0
    return num / den


def estimate_two_param(
    intakes: List[Intake],
    sleeps: List[SleepLog],
) -> Tuple[float, float, Dict[str, Any]]:
    """
    T_half(3~8h), S(민감도) 동시에 추정.
    반환: (best_T, best_S, debug)
    """

    # 데이터가 적으면 기본값
    if len(sleeps) < 3:
        return 5.0, 0.0, {"reason": "few_sleep_logs"}

    pairs = build_pairs(intakes, sleeps)
    if not pairs:
        return 5.0, 0.0, {"reason": "no_pairs"}

    candidate_T = [x / 10 for x in range(30, 81, 5)]  # 3.0~8.0
    best = {
        "mse": float("inf"),
        "T": 5.0,
        "S": 0.0,
    }

    all_scores = {}

    for T in candidate_T:
        xs = []
        ys = []
        for relevant, sleep_at, debt in pairs:
            c = residual_caffeine_at(sleep_at, relevant, T)
            xs.append(c)
            ys.append(debt)

        if len(xs) < 2:
            continue

        S = fit_sensitivity(xs, ys)
        preds = [S * x for x in xs]
        mse = sum((y - p) ** 2 for y, p in zip(ys, preds)) / len(ys)

        all_scores[f"{T:.1f}"] = {"S": S, "mse": mse}

        if mse < best["mse"]:
            best = {"mse": mse, "T": T, "S": S}

    # 민감도 S가 지나치게 작으면 반감기는 개인화하지 않음
    # (식별 불능 영역 방지)
    if abs(best["S"]) < 0.05:
        return 5.0, best["S"], {"reason": "low_sensitivity", "scores": all_scores}

    return best["T"], best["S"], {"scores": all_scores}


def build_daily_curve(
    intakes: List[Intake],
    half_life_h: float,
    day: datetime,
    step_minutes: int = 30,
) -> List[Dict[str, Any]]:
    """하루(00:00~24:00) 카페인 농도 곡선 생성"""
    start = datetime(day.year, day.month, day.day, 0, 0, 0)
    end = start + timedelta(days=1)

    t = start
    out = []
    while t <= end:
        val = residual_caffeine_at(t, intakes, half_life_h)
        out.append(
            {
                "time": t.isoformat(sep="T", timespec="minutes"),
                "caffeineMg": round(val, 2),
            }
        )
        t += timedelta(minutes=step_minutes)

    return out
