# AI_model/caffeine_cal/ml_estimator.py
from __future__ import annotations

from typing import Tuple, Dict, List
from datetime import timedelta

from .models import Intake, SleepLog
from .half_life_curve import (
    estimate_half_life_curve,
    residual_caffeine_at,
)


def _build_pairs_for_ml(
    intakes: List[Intake],
    sleeps: List[SleepLog],
    target_minutes: int = 7 * 60,
    window_hours: int = 18,
):
    """
    ML 회귀에 사용할 (해당 수면과 관련된 intakes, 수면 시각, 수면부족) 튜플 리스트를 만듭니다.
    - window_hours 시간 동안의 섭취만 사용 (너무 예전 섭취는 영향 거의 없음)
    - sleep_debt = max(0, target_minutes - duration_minutes)
    """
    pairs = []
    for log in sleeps:
        start = log.sleep_at - timedelta(hours=window_hours)
        relevant = [i for i in intakes if start <= i.consumed_at <= log.sleep_at]

        # relevant 가 빈 리스트여도 괜찮음 → 잔여 카페인 0 으로 들어감
        sleep_debt = max(0, target_minutes - log.duration_minutes)
        pairs.append((relevant, log.sleep_at, float(sleep_debt)))

    return pairs


def _fit_simple_regression(xs: List[float], ys: List[float]) -> Tuple[float, float]:
    """
    y ≈ slope * x + intercept 를 최소제곱법으로 추정.
    외부 라이브러리(NumPy, scikit-learn) 없이 순수 파이썬으로 처리.
    """
    n = len(xs)
    if n == 0:
        return 0.0, 0.0
    if n == 1:
        # 점이 하나뿐이면 기울기는 0, 절편은 그 점의 y 값으로 둠
        return 0.0, ys[0]

    mean_x = sum(xs) / n
    mean_y = sum(ys) / n

    denom = sum((x - mean_x) ** 2 for x in xs)
    if denom == 0.0:
        # x 가 모두 동일한 경우 → 기울기 0, 절편은 평균 y
        return 0.0, mean_y

    slope = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys)) / denom
    intercept = mean_y - slope * mean_x
    return slope, intercept


def estimate_half_life_ml(
    intakes: List[Intake],
    sleeps: List[SleepLog],
) -> Tuple[float, Dict[str, float]]:
    """
    데이터가 충분할 때 사용할 ML 회귀 기반 half-life 추정.

    아이디어:
    - 여러 half-life 후보 T (3.0h ~ 8.0h, 0.5h 간격)에 대해
        1) 각 수면 로그마다 "수면 직전 잔여 카페인 C_T" 를 계산
        2) C_T → sleep_debt 관계를 선형회귀로 맞춘 뒤
        3) 예측값과 실제 sleep_debt 의 MSE 를 계산
    - MSE 가 가장 작은 T 를 최종 half-life 로 선정.
    - scores 딕셔너리에는 각 T 에 대한 "음수 MSE" 를 넣어 두어
      값이 클수록(=오차가 작을수록) 좋은 T 라는 의미가 되게 함.

    수면 로그가 너무 적으면(4개 미만) 기존 curve 방식으로 바로 fallback 합니다.
    """
    # 수면 데이터가 너무 적으면 ML 기반으로 추정할 의미가 없으므로 기존 방식 사용
    if len(sleeps) < 4:
        half_life, curve_scores = estimate_half_life_curve(intakes, sleeps)
        return half_life, {f"{k:.1f}": v for k, v in curve_scores.items()}

    pairs = _build_pairs_for_ml(intakes, sleeps)
    if not pairs:
        half_life, curve_scores = estimate_half_life_curve(intakes, sleeps)
        return half_life, {f"{k:.1f}": v for k, v in curve_scores.items()}

    candidate_T = [x / 10.0 for x in range(30, 81, 5)]  # 3.0, 3.5, ..., 8.0
    scores: Dict[str, float] = {}

    best_T = 5.0
    best_mse = float("inf")

    for T in candidate_T:
        xs: List[float] = []
        ys: List[float] = []

        # 각 수면 로그마다 "수면 직전 잔여 카페인" 을 feature 로 사용
        for relevant, sleep_at, sleep_debt in pairs:
            c_at_sleep = residual_caffeine_at(sleep_at, relevant, T)
            xs.append(c_at_sleep)
            ys.append(sleep_debt)

        if len(xs) < 2:
            # 점이 너무 적으면 이 T 에 대해서는 스킵
            continue

        slope, intercept = _fit_simple_regression(xs, ys)
        preds = [slope * x + intercept for x in xs]
        mse = sum((y - p) ** 2 for y, p in zip(ys, preds)) / len(ys)

        # 점수가 클수록 좋은 방향으로 만들기 위해 -MSE 사용
        scores[f"{T:.1f}"] = -mse

        if mse < best_mse:
            best_mse = mse
            best_T = T

    # 모든 후보 T 에 대해 유효한 점수를 얻지 못했다면 curve 방식으로 fallback
    if not scores:
        half_life, curve_scores = estimate_half_life_curve(intakes, sleeps)
        return half_life, {f"{k:.1f}": v for k, v in curve_scores.items()}

    return best_T, scores
