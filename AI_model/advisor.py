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
from openai import OpenAI
from datetime import datetime
from typing import List, Dict

# LLM 클라이언트 준비
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
당신은 카페인 섭취 관리 전문 어드바이저입니다.
아래 입력 데이터를 바탕으로 사용자에게 현재 카페인 상태, 위험성, 권장 행동을
친절하고 쉬운 한국어로 설명하세요.

주의:
- 절대 JSON으로 답하지 말고 자연어 문장으로 설명하세요.
- 설명은 짧게 3~6문장으로 구성합니다.
- '지금 마셔도 괜찮다 / 조금 위험하다 / 피하는 게 좋다' 중 하나를 명확하게 판단하세요.
- 반감기 추정치를 기반으로 개인화된 코멘트를 포함하세요.
- 총량, 남아있는 mg, threshold 비교 결과 등을 반드시 해석하세요.
"""

class AdvisorAgent:
    """
    카페인 계산 결과를 기반으로 LLM을 사용해 자연어 조언을 제공하는 에이전트.
    """

    def __init__(self, calculator):
        self.calc = calculator  # CaffeineCalculator 객체

    def advise(
        self,
        events: List[Dict],
        question: str,
        now: datetime = None,
        added_mg: float = None,
        target_sleep_time: datetime = None
    ) -> str:
        """
        events: [{ "mg": float, "time": datetime }]
        question: 유저 질문 (ex: "지금 마셔도 돼?")
        added_mg: 지금 마시려고 하는 음료의 mg (optional)
        target_sleep_time: 사용자가 잠들 예정인 시간(옵션)
        """

        if now is None:
            now = datetime.now()

        # 현재 남은 카페인
        remaining = self.calc.total_remaining(events, now)
        daily_total = self.calc.total_daily_intake(events, now)

        # 반감기 정보
        half_life = self.calc.half_life
        threshold = self.calc.threshold

        # added_mg가 있으면 시뮬레이션
        drink_simulation = None
        if added_mg is not None:
            sim_events = events + [{"mg": added_mg, "time": now}]
            if target_sleep_time:
                predicted_sleep_level = self.calc.total_remaining(sim_events, target_sleep_time)
            else:
                # 기본적으로 4~6시간 정도 뒤에 떨어지는 양을 본다
                predict_time = now.replace(hour=now.hour+5 if now.hour < 20 else 23)
                predicted_sleep_level = self.calc.total_remaining(sim_events, predict_time)

            drink_simulation = predicted_sleep_level

        # LLM에 들어가는 정보
        user_data = {
            "now": str(now),
            "question": question,
            "daily_total_mg": daily_total,
            "remaining_now_mg": remaining,
            "half_life_hours": half_life,
            "sensitivity_threshold_mg": threshold,
            "added_drink_mg": added_mg,
            "predicted_future_level_mg": drink_simulation,
            "target_sleep_time": str(target_sleep_time) if target_sleep_time else None
        }

        # Chat Completion
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"사용자 데이터:\n{user_data}"}
            ]
        )

        return response.choices[0].message.content