from datetime import datetime
from langchain_core.tools import tool
from ..caffeine_cal.data_access import load_intakes_for_user
from ..caffeine_cal.half_life_curve import residual_caffeine_at

@tool
def calc_caffeine_state(user_id: int):
    """DB에서 오늘 섭취한 카페인 기록을 불러와, 현재 잔여량과 총 섭취량을 계산."""
    now = datetime.now()
    intakes = load_intakes_for_user(user_id, 1)

    remaining = residual_caffeine_at(now, intakes, 5.0)
    total = sum(i.caffeine_mg for i in intakes)

    return {
        "remaining_now": remaining,
        "daily_total": total,
        "events": [
            {"mg": i.caffeine_mg, "time": i.consumed_at.isoformat()}
            for i in intakes
        ]
    }