from dotenv import load_dotenv
import os
from pathlib import Path

# 1) 이 파일(testapi.py)이 있는 폴더 기준으로 .env 찾기
env_path = Path(__file__).resolve().parent / '.env'
print("env path:", env_path, "exists?", env_path.exists())

# 2) 해당 경로의 .env 로드
load_dotenv(dotenv_path=env_path)

# 3) 키 읽기
openai_api_key = os.getenv('OPENAI_API_KEY')
print("OPENAI_API_KEY:", openai_api_key)