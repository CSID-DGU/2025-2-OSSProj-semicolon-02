## 카페인 섭취 조언 에이전트 ##

"""
 •	입력:
	•	계산 결과 (총량, 남은 농도, threshold 등)
	•	사용자의 질문 텍스트 (예: “이거 더 마셔도 돼?”)
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

from caffeine_cal import CaffeineCalculator
from drink_image import analyze_drink

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


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

    def __init__(self, calculator: Optional[CaffeineCalculator] = None):
        # 외부에서 Calculator 안 주면 기본값 사용
        self.calc = calculator or CaffeineCalculator()

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

        # 1) Vision+RAG에서 나온 새로운 음료 정보
        brand = detected_drink.get("brand")
        drink_type = detected_drink.get("drink_type")
        added_mg = detected_drink.get("caffeine_mg", 0.0)

        # 2) 현재 사용자 상태 계산
        remaining = self.calc.total_remaining(events, now)          # 지금 몸속 카페인
        daily_total = self.calc.total_daily_intake(events, now)     # 오늘 총 섭취량

        # 3) 새 음료를 마셨을 때 5시간 뒤 예상 카페인
        sim_events = events + [{"mg": added_mg, "time": now}]
        predicted_after_5h = self.calc.total_remaining(sim_events, now + timedelta(hours=5))

        # 4) LLM에 제공할 해석용 데이터
        data = {
            "brand": brand,
            "drink_type": drink_type,
            "added_mg": added_mg,
            "remaining_now": remaining,
            "daily_total": daily_total,
            "predicted_after_5h": predicted_after_5h,
            "half_life": self.calc.half_life,
            "threshold": self.calc.threshold,
        }

        # 5) LLM 호출 → 자연어 설명 생성
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"입력 데이터:\n{data}"},
            ]
        )

        return response.choices[0].message.content
    
    
from datetime import datetime, timedelta
if __name__ == "__main__":
    # 오늘 마신 기록 예시
    events = [
        {"mg": 150, "time": datetime(2025, 11, 27, 9, 30)},
        {"mg": 85,  "time": datetime(2025, 11, 27, 13, 30)},
    ]

    image_path = "/Users/eunjung/Desktop/OSSProj/2025-2-OSSProj-semicolon-02/AI_model/Unknown.jpeg"
    detected_drink = analyze_drink(image_path)

    print("=== 감지된 음료 정보 ===")
    print(detected_drink)

    advisor = AdvisorAgent()
    advice = advisor.advise(events, detected_drink)

    print("\n=== LLM 조언 ===")
    print(advice)