# AI_model/caffeine_cal/ml_estimator.py
from __future__ import annotations

from typing import Tuple, Dict, List

from .models import Intake, SleepLog
from .half_life_curve import estimate_half_life_curve


def estimate_half_life_ml(
    intakes: List[Intake],
    sleeps: List[SleepLog],
) -> Tuple[float, Dict[str, float]]:
    """
    데이터가 충분할 때 사용할 ML 회귀용 인터페이스.

    현재는 아직 ML 모델이 없으므로,
    Curve fitting 결과를 그대로 반환하는 stub 입니다.
    나중에 scikit-learn / PyTorch 모델을 학습한 뒤
    이 함수 내부 구현만 교체하면 됩니다.
    """
    half_life, scores = estimate_half_life_curve(intakes, sleeps)

    # scores 키를 문자열로 변환 (JSON 직렬화 편의용)
    return half_life, {f"{k:.1f}": v for k, v in scores.items()}
