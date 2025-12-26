import chromadb
from sentence_transformers import SentenceTransformer
from openai import OpenAI
import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHROMA_PATH = os.path.join(BASE_DIR, "chroma_db")

class VectorRAGAgent:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=CHROMA_PATH)
        self.collection = self.client.get_or_create_collection("drinks")
        self.embed_model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")
        self.llm = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        print("Chroma drinks collection document count:", self.collection.count())

    def _brand_pref_search(self, query_text: str, brand: str | None):
        # 벡터 검색은 top-k 여러 개 가져오기
        k = min(5, self.collection.count())
        embedding = self.embed_model.encode([query_text]).tolist()[0]

        result = self.collection.query(
            query_embeddings=[embedding],
            n_results=k
        )

        docs = result["documents"][0]  # 리스트 형태

        # 1순위: 브랜드 문자열이 들어간 문장
        if brand:
            brand = brand.strip()
            for doc in docs:
                if brand in doc:
                    return doc

        # 2순위: 그냥 가장 유사한 첫 번째 문장
        return docs[0]

    def extract_caffeine_from_text(self, text: str):
        m = re.search(r"(\d+(\.\d+)?)\s*mg", text)
        if m:
            return float(m.group(1))
        return None

    def query(self, vision_json: dict):
        brand = vision_json.get("brand", "") or ""
        drink_type = vision_json.get("drink_type", "") or ""

        # 기존처럼 brand + drink_type을 쿼리로 사용
        query_text = f"{brand} {drink_type}"

        best_match = self._brand_pref_search(query_text, brand)

        caffeine = self.extract_caffeine_from_text(best_match)

        return {
            "query_text": query_text,
            "matched_text": best_match,
            "caffeine_mg": caffeine,
        }
    def map(self, vision_json: dict):
        """
        Supervisor / 옛 코드에서 쓰던 인터페이스를 맞춰주기 위한 래퍼.

        입력: VisionAgent가 준 JSON (brand, drink_type 포함)
        출력: Advisor / Supervisor에서 쓰기 좋은 형태
        """
        base = self.query(vision_json)

        brand = vision_json.get("brand") or ""
        drink_type = vision_json.get("drink_type") or ""

        return {
            "brand": brand,
            "drink_type": drink_type,
            "caffeine_mg": base["caffeine_mg"],
            # 디버깅용으로 원본 텍스트도 같이 넘겨줌
            "matched_text": base["matched_text"],
            "query_text": base["query_text"],
        }