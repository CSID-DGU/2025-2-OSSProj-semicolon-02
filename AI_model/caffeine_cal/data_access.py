# AI_model/caffeine_cal/data_access.py
from __future__ import annotations

import os
from datetime import datetime, timedelta
from typing import List
import pymysql

from .models import Intake, SleepLog


DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_NAME = os.getenv("DB_NAME", "caffit")
DB_USER = os.getenv("DB_USER", "caffit")
DB_PASSWORD = os.getenv("DB_PASSWORD", "caffit1234")


def get_conn():
    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor,
    )

def load_intakes_for_user(user_id: int, days: int = 60) -> List[Intake]:
    # 최근 days일 섭취 기록 로드
    now = datetime.now()
    start = now - timedelta(days=days)

    sql = """
    SELECT user_id, consumed_at, caffeine_mg
    FROM intakes
    WHERE user_id = %s
      AND consumed_at BETWEEN %s AND %s
    ORDER BY consumed_at ASC
    """

    with get_conn() as conn:
        with conn.cursor() as cur:
            # 순서 중요: user_id, start, now
            cur.execute(sql, (user_id, start, now))
            rows = cur.fetchall()

    intakes: List[Intake] = []
    for r in rows:
        intakes.append(
            Intake(
                user_id=r["user_id"],
                consumed_at=r["consumed_at"],
                caffeine_mg=float(r["caffeine_mg"]),
            )
        )
    return intakes

def load_sleep_logs_for_user(user_id: int, days: int = 60) -> List[SleepLog]:
    now = datetime.now()
    start = now - timedelta(days=days)

    sql = """
    SELECT user_id, sleep_at, wake_at, duration_minutes
    FROM sleep_logs
    WHERE user_id = %s
      AND sleep_at BETWEEN %s AND %s
    ORDER BY sleep_at ASC
    """

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (user_id, start, now))
            rows = cur.fetchall()

    sleeps: List[SleepLog] = []
    for r in rows:
        sleeps.append(
            SleepLog(
                user_id=r["user_id"],
                sleep_at=r["sleep_at"],
                wake_at=r["wake_at"],
                duration_minutes=int(r["duration_minutes"]),
            )
        )
    return sleeps
