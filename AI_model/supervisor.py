from datetime import datetime
from typing import Optional, List, Dict

from vision_agent import VisionAgent
from mapping_agent import MappingAgent
from caffeine_calc_agent import CaffeineCalculator
from advisor_agent import AdvisorAgent

class SupervisorAgent:
    """
    VisionAgent, MappingAgent, CaffeineCalculator, AdvisorAgent
    전체를 관리하는 상위 에이전트.

    입력 형태에 따라 자동으로 플로우를 결정한다:
    - 이미지만 들어왔을 때
    - 텍스트 질문만 들어왔을 때
    - 이미지 + 질문 같이 들어왔을 때
    """

    def __init__(self):
        self.vision = VisionAgent()
        self.mapping = MappingAgent()
        self.calc = CaffeineCalculator()
        self.advisor = AdvisorAgent(self.calc)

    def handle(
        self,
        events: List[Dict],          # 지금까지 마신 음료 기록
        image_path: Optional[str],   # 분석할 음료 이미지 (없으면 None)
        question: Optional[str],     # 사용자 질문 (없으면 None)
        now: Optional[datetime] = None,
        target_sleep_time: Optional[datetime] = None
    ) -> str:
        """
        사용자의 입력 상황에 맞게 전체 파이프라인을 실행한 후,
        AdvisorAgent의 자연어 응답을 돌려준다.
        """

        if now is None:
            now = datetime.now()

        drink_info = None
        added_mg = None

        # -------------------------
        # 1) 이미지가 들어온 경우 → Vision + Mapping
        # -------------------------
        if image_path is not None:
            drink_info = self.vision.analyze(image_path)
            mapped = self.mapping.map(drink_info)

            added_mg = mapped["caffeine_mg"]

            # 마신 시간 now로 event 추가
            events.append({
                "mg": added_mg,
                "time": now
            })

        # -------------------------
        # 2) 텍스트 질문 처리
        # -------------------------
        if question is not None:
            answer = self.advisor.advise(
                events=events,
                question=question,
                added_mg=added_mg,              # 이미지 기반 mg 있다면 포함
                target_sleep_time=target_sleep_time,
                now=now
            )
            return answer

        # -------------------------
        # 3) 질문 없이 이미지만 들어온 경우
        # -------------------------
        if image_path and not question:
            return (
                f"음료가 기록되었습니다. "
                f"추정 카페인: {added_mg} mg\n"
                f"현재 총량: {self.calc.total_remaining(events)} mg"
            )

        # -------------------------
        # 4) 아무 입력도 없을 때
        # -------------------------
        return "입력(이미지 또는 질문)이 필요합니다."

