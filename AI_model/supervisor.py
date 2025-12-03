#카페인 관리 섭취 총괄
# AI_model/supervisor.py


from datetime import datetime
from typing import Optional, List, Dict
import json

from drink_image import VisionAgent          # 같은 폴더
from mapping_db import VectorRAGAgent        # 같은 폴더
from advisor import AdvisorAgent             # 같은 폴더

from caffeine_cal.data_access import load_intakes_for_user  # 하위 패키지


class SupervisorAgent:
    """
    사진 한 장(or 없음) + user_id만 받아서

    1) DB에서 과거 섭취 기록 불러오고
    2) 이미지가 있으면 Vision + RAG로 음료/카페인 분석하고
    3) AdvisorAgent에게 넘겨서 LLM 기반 조언까지 만들어주는 총괄 에이전트
    """

    def __init__(self, default_user_id: int = 1) -> None:
        self.vision = VisionAgent()
        self.mapping = VectorRAGAgent()
        self.advisor = AdvisorAgent()
        self.default_user_id = default_user_id

    # -------------------------
    # 내부 헬퍼: DB → events 포맷으로 변환
    # -------------------------
    def _load_events_from_db(self, user_id: int, days: int = 30) -> List[Dict]:
        """
        events: [{ "user_id": int, "mg": float, "time": datetime }, ...]
        """
        intakes = load_intakes_for_user(user_id=user_id, days=days)
        events: List[Dict] = [
            {
                "user_id": intake.user_id,
                "mg": float(intake.caffeine_mg),
                "time": intake.consumed_at,
            }
            for intake in intakes
        ]
        return events

    # -------------------------
    # 메인 진입점
    # -------------------------
    def handle(
        self,
        user_id: Optional[int] = None,
        image_path: Optional[str] = None,
        now: Optional[datetime] = None,
    ) -> Dict:
        """
        - user_id: 필수 (없으면 default_user_id 사용)
        - image_path: 새로 마실 음료 사진 (없으면 과거 기록만 가지고 조언)
        - now: 기준 시각 (디폴트는 현재)

        return:
        {
          "detected_drink": {...} or None,
          "advice": str,
        }
        """
        if now is None:
            now = datetime.now()
        if user_id is None:
            user_id = self.default_user_id

        # 1) DB에서 과거 섭취 기록 불러오기
        events = self._load_events_from_db(user_id=user_id, days=30)

        detected_drink: Optional[Dict] = None

        # 2) 이미지가 있으면 → Vision + RAG로 음료/카페인 분석
        if image_path is not None:
            drink_info = self.vision.analyze(image_path)
            if isinstance(drink_info, str):
                drink_info = json.loads(drink_info)

            mapped = self.mapping.map(drink_info)

            detected_drink = {
                "brand": mapped.get("brand"),
                "drink_type": mapped.get("drink_type"),
                "caffeine_mg": float(mapped.get("caffeine_mg", 0.0)),
            }

            # 이번에 마신 음료를 events에 추가
            events.append(
                {
                    "user_id": user_id,
                    "mg": detected_drink["caffeine_mg"],
                    "time": now,
                }
            )

        # 3) AdvisorAgent에게 넘겨서 LLM 조언 생성
        #    (이미지 없으면 detected_drink는 None 대신 기본값 사용)
        if detected_drink is None:
            detected_drink = {
                "brand": None,
                "drink_type": None,
                "caffeine_mg": 0.0,
            }

        advice_text = self.advisor.advise(
            events=events,
            detected_drink=detected_drink,
            now=now,
        )

        return {
            "detected_drink": detected_drink,
            "advice": advice_text,
        }


if __name__ == "__main__":
    sup = SupervisorAgent(default_user_id=1)

    image_path = "/Users/eunjung/Desktop/OSSProj/2025-2-OSSProj-semicolon-02/AI_model/Unknown.jpeg"

    result = sup.handle(
        user_id=1,
        image_path=image_path,
    )

    print("\n=== Supervisor Output ===\n")
    print("감지된 음료:", result["detected_drink"])
    print("\n조언:\n", result["advice"])