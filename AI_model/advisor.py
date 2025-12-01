## 카페인 섭취 조언 에이전트 ##

"""
 •	입력:
	•	계산 결과 (총량, 남은 농도, threshold 등)
	•	내부 동작:
	•	LLM 호출해서 “해석 + 설명 + 조언” 생성
	•	출력:
	•	자연어 피드백: “오늘 300mg이라 한 잔 정도는 괜찮지만, 늦은 오후에는 피하는 게 좋겠다” 등
 """	
 
 # agents/advisor_agent.py

import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional

from dotenv import load_dotenv
from openai import OpenAI


from caffeine_cal.models import Intake
from caffeine_cal.half_life_curve import residual_caffeine_at
from caffeine_cal.data_access import load_intakes_for_user

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 반감기 / threshold를 caffeine_cal 쪽과 맞추고 싶으면 여기서 상수로 정의
DEFAULT_HALF_LIFE_H = 5.0          # service.py에서 쓰는 값이랑 통일
DEFAULT_THRESHOLD_MG = 300.0       # “오늘 카페인 총량 위험선”에 쓸 값 (원하면 조정)


SYSTEM_PROMPT = """
당신은 카페인 섭취 관리 전문 어드바이저입니다.

아래 입력 데이터를 기반으로 다음 기준으로 조언하세요:
- 반드시 자연어 문장만 출력 (JSON 금지)
- 3~6문장으로 짧고 명확하게 설명
- 지금 마신 음료(브랜드, 종류, mg)를 반드시 언급
- 현재 남아있는 카페인 상태(remaining_now) 설명
- 오늘 총 섭취량(daily_total) 위험 여부 판단
- 앞으로 5시간 뒤 남을 카페인(predicted_after_5h) 기반으로 결론 제시
- '마셔도 괜찮다 / 조금 위험하다 / 피하는 게 좋다' 중 하나를 반드시 명시
"""


class AdvisorAgent:
    def __init__(
        self,
        half_life_h: float = DEFAULT_HALF_LIFE_H,
        threshold_mg: float = DEFAULT_THRESHOLD_MG,
    ) -> None:
        self.half_life_h = half_life_h
        self.threshold = threshold_mg

    # events(List[Dict]) → Intake 리스트로 바꿔주는 내부 헬퍼
    def _events_to_intakes(self, events: List[Dict]) -> List[Intake]:
        """
        events: [{ "user_id": int, "mg": float, "time": datetime }]
        """
        return [
            Intake(
                user_id=e["user_id"],
                caffeine_mg=float(e["mg"]),
                consumed_at=e["time"],
            )
            for e in events
        ]

    def advise(
        self,
        events: List[Dict],
        detected_drink: Dict,
        now: Optional[datetime] = None,
    ) -> str:
        """
        events: [{ "mg": float, "time": datetime }]
        detected_drink: {
            "brand": str | None,
            "drink_type": str,
            "caffeine_mg": float
        }
        now: 분석 기준 시각
        """
        if now is None:
            now = datetime.now()

        brand = detected_drink.get("brand")
        drink_type = detected_drink.get("drink_type")
        added_mg = float(detected_drink.get("caffeine_mg", 0.0))

        # 여기서 user_id 포함된 events → Intake 리스트로 변환
        base_intakes = self._events_to_intakes(events)

        # 남은 카페인 / 오늘 총량 계산
        remaining = residual_caffeine_at(
            now,
            base_intakes,
            self.half_life_h,
        )

        today = now.date()
        daily_total = sum(
            e["mg"] for e in events
            if e["time"].date() == today
        )

        # 새 음료 지금 마신다고 가정해서 5시간 뒤
        if events:
            uid = events[0]["user_id"]   # 동일 사용자라고 가정
        else:
            uid = 0                      # 비어있을 때 임시값

        future_intakes = base_intakes + [
            Intake(
                user_id=uid,
                consumed_at=now,
                caffeine_mg=added_mg,
            )
        ]
        predicted_after_5h = residual_caffeine_at(
            now + timedelta(hours=5),
            future_intakes,
            self.half_life_h,
        )

        data = {
            "brand": brand,
            "drink_type": drink_type,
            "added_mg": added_mg,
            "remaining_now": remaining,
            "daily_total": daily_total,
            "predicted_after_5h": predicted_after_5h,
            "half_life": self.half_life_h,
            "threshold": self.threshold,
        }

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"입력 데이터:\n{data}"},
            ],
        )

        return response.choices[0].message.content


from drink_image import analyze_drink

from drink_image import analyze_drink

if __name__ == "__main__":
    # 1번 유저(user1)의 최근 30일 섭취 기록을 DB에서 불러오기
    user_id = 1
    intakes = load_intakes_for_user(user_id=user_id, days=30)

    # Intake 리스트를 AdvisorAgent가 사용하는 events 포맷으로 변환
    events = [
        {
            "user_id": intake.user_id,
            "mg": intake.caffeine_mg,
            "time": intake.consumed_at,
        }
        for intake in intakes
    ]

    image_path = "/Users/eunjung/Desktop/OSSProj/2025-2-OSSProj-semicolon-02/AI_model/Unknown.jpeg"
    detected_drink = analyze_drink(image_path)

    print("=== 감지된 음료 정보 ===")
    print(detected_drink)

    advisor = AdvisorAgent()
    advice = advisor.advise(events, detected_drink)

    print("\n=== LLM 조언 ===")
    print(advice)