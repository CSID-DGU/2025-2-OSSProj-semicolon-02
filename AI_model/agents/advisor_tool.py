from datetime import datetime
from langchain_core.tools import tool
from ..advisor import AdvisorAgent
from ..caffeine_cal.data_access import load_intakes_for_user

advisor = AdvisorAgent()

@tool
def make_advice(user_id: int, drink: dict):
    """사용자의 최근 섭취 기록 + 감지된 음료 기반 자연어 조언 생성."""
    now = datetime.now()
    intakes = load_intakes_for_user(user_id, 1)

    events = [
        {"user_id": i.user_id, "mg": i.caffeine_mg, "time": i.consumed_at}
        for i in intakes
    ]

    return advisor.advise(events, detected_drink=drink, now=now)