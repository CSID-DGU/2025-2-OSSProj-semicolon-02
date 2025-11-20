"""
(2) 카페인 계산 에이전트: CaffeineCalcAgent
	•	입력:
	•	지금까지 마신 음료 리스트
	•	새로 인식된 음료 정보
	•	(옵션) 사용자 체중, 반감기
	•	내부 동작:
	•	순수 파이썬 함수로 누적량, half-life 곡선 계산
	•	출력:
	•	현재 시점 카페인 mg
	•	오늘 총 섭취량, 권장 대비 퍼센트 등
	•	특징: LLM이 아니라 규칙/수식 기반 계산 에이전트라고 봐도 됨
 """
 # agents/caffeine_calc_agent.py

from datetime import datetime, timedelta
import math

class CaffeineCalculator:
    """
    개인별 카페인 반감기/민감도를 기반으로
    남아있는 카페인량과 하루 총 카페인 등을 계산해주는 에이전트.
    """

    def __init__(self, half_life: float = 5.0, sensitivity_threshold: float = 120.0):
        """
        half_life: 개인 반감기 (기본 5시간)
        sensitivity_threshold: 잠에 영향 줄 가능성이 있는 카페인 mg (기본 120mg)
        """
        self.half_life = half_life
        self.threshold = sensitivity_threshold

    # ---------------------------------------------------------
    # 1) 단일 음료 잔여 카페인 계산
    # ---------------------------------------------------------
    @staticmethod
    def remaining_caffeine(initial_mg: float, hours_passed: float, half_life: float) -> float:
        if initial_mg <= 0:
            return 0.0
        return initial_mg * (0.5 ** (hours_passed / half_life))

    # ---------------------------------------------------------
    # 2) 여러 음료 → 현재 시점 잔여량
    # ---------------------------------------------------------
    def total_remaining(self, events, now: datetime = None) -> float:
        """
        events: [{ "mg": float, "time": datetime }]
        """
        if now is None:
            now = datetime.now()

        total = 0.0
        for e in events:
            mg = e["mg"]
            t = e["time"]
            hours = (now - t).total_seconds() / 3600
            if hours >= 0:
                total += self.remaining_caffeine(mg, hours, self.half_life)
        return total

    # ---------------------------------------------------------
    # 3) 1일 총 섭취량 계산
    # ---------------------------------------------------------
    @staticmethod
    def total_daily_intake(events, day: datetime) -> float:
        """
        day: 특정 날짜 (연/월/일만)
        events: [{ "mg": float, "time": datetime }]
        """
        total = 0.0
        for e in events:
            if e["time"].date() == day.date():
                total += e["mg"]
        return total

    # ---------------------------------------------------------
    # 4) 시간대별 카페인 농도 곡선 생성
    # ---------------------------------------------------------
    def caffeine_curve(self, events, start_time, end_time, interval_minutes=30):
        """
        returns: [{ "time": datetime, "mg": float }]
        """
        points = []
        t = start_time

        while t <= end_time:
            mg = self.total_remaining(events, t)
            points.append({"time": t, "mg": mg})
            t += timedelta(minutes=interval_minutes)

        return points

    # ---------------------------------------------------------
    # 5) 개인화: 하루 피드백 기반 반감기 업데이트
    # ---------------------------------------------------------
    def update_half_life(self, events_today, sleep_time: datetime, slept_bad: bool, 
                          lr: float = 0.05, max_half_life: float = 9.0, min_half_life: float = 2.5):
        """
        slept_bad: True = 잠 설침, False = 잘 잠
        """

        # 잠잘 때 남아있던 카페인량
        caf = self.total_remaining(events_today, sleep_time)

        # 기준값: threshold (개인 민감도 임계 mg)
        target = self.threshold

        direction = 0.0
        # 잠 설쳤는데 카페인이 낮았다 → 실제 반감기가 더 길 가능성
        if slept_bad and caf < target:
            direction = +1.0
        # 잘 잤는데 카페인이 높았다 → 실제 반감기가 더 짧을 가능성
        elif (not slept_bad) and caf > target:
            direction = -1.0

        # 업데이트
        new_h = self.half_life * (1 + lr * direction)

        # 안전 범위 제한
        new_h = max(min_half_life, min(max_half_life, new_h))

        self.half_life = new_h
        return new_h

    # ---------------------------------------------------------
    # 6) 앞으로 일정 시점에 카페인이 얼마 남아있을지 예측
    # ---------------------------------------------------------
    def predict_level_at(self, events, future_time: datetime) -> float:
        return self.total_remaining(events, future_time)

    # ---------------------------------------------------------
    # 7) 특정 시간까지 카페인을 N mg 이하로 유지하려면
    #    지금 더 마셔도 되는지 판단하는 기능
    # ---------------------------------------------------------
    def can_drink_now(self, events, added_mg: float, target_time: datetime, limit_mg: float):
        """
        added_mg: 지금 마실 커피의 카페인 mg
        limit_mg: target_time까지 남아있길 원하는 최대 카페인 mg
        """
        now = datetime.now()

        # 새로운 음료 추가한 상황 가정
        simulated_events = events + [{"mg": added_mg, "time": now}]

        future_level = self.total_remaining(simulated_events, target_time)

        return future_level <= limit_mg, future_level