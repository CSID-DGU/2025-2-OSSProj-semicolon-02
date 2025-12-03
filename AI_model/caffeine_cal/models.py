# AI_model/caffeine_cal/models.py
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass
class Intake:
    user_id: int
    consumed_at: datetime
    caffeine_mg: float


@dataclass
class SleepLog:
    user_id: int
    sleep_at: datetime
    wake_at: datetime
    duration_minutes: int
