# AI_model/env_loader.py
from pathlib import Path
from dotenv import load_dotenv

def load_env() -> None:
    env_path = Path(__file__).resolve().parent / '.env'
    load_dotenv(dotenv_path=env_path)
