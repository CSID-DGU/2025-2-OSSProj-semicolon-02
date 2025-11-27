## 카페인 음료 이미지 분석 에이전트 ##

import os
import base64
from openai import OpenAI
from dotenv import load_dotenv
from mapping_db import VectorRAGAgent
import json

load_dotenv()


SYSTEM_PROMPT = """
당신은 음료 인식 비전 모델입니다.
이미지를 보고 브랜드, 제품명, 용량, 카페인(mg)을 추출하고,
반드시 '커피/음료 종류(drink_type)'를 하나 추론해서 포함해야 합니다.

항상 아래 JSON 형식만 출력하십시오.

{
  "brand": "string|null",
  "product_name": "string|null",
  "drink_type": "string",
  "size": "string|null",
  "caffeine_mg": "number|null",
  "confidence": "number",
  "notes": "string"
}

규칙:
- drink_type 은 커피/음료의 유형을 나타내며, 절대 null을 사용하지 마세요.
  예: "Hot Americano", "Iced Americano", "Caffe Latte", "Vanilla Latte",
      "Cold Brew", "Cappuccino", "Mocha", "Non-coffee (Ade)", "Non-coffee (Smoothie)" 등.
- 라벨에 정확한 메뉴명이 없어도,
  1) 브랜드(예: 메가커피, 스타벅스, 이디야),
  2) 컵 색/디자인,
  3) 얼음 유무, 우유 느낌,
  등을 보고 가장 가능성 높은 drink_type 을 하나 선택하세요.
  확실하지 않으면 가장 기본 메뉴(보통 아메리카노)를 가정하고,
  notes에 '추정'이라고 명시하세요.
- caffeine_mg 은 drink_type 에서 일반적으로 알려진 카페인 범위를 기준으로
  대표값(중간값)을 추정해서 넣고, 추정임을 notes에 적으세요.
- JSON 바깥에 다른 텍스트를 절대 출력하지 마세요.
"""


class VisionAgent:
  
    def __init__(self, model="gpt-4o-mini"):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = model

    def encode_image_to_data_url(self, image_path: str) -> str:
        with open(image_path, "rb") as f:
            image_bytes = f.read()
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        return f"data:image/jpeg;base64,{b64}"

    def analyze(self, image_path: str):
        data_url = self.encode_image_to_data_url(image_path)

        response = self.client.chat.completions.create(
            model=self.model,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "이 이미지 속 음료 정보를 추출해줘."},
                        {
                            "type": "image_url",
                            "image_url": {"url": data_url},
                        },
                    ],
                },
            ],
        )

        return response.choices[0].message.content

"""
if __name__ == "__main__":
    agent = VisionAgent()
    result = agent.analyze("/Users/eunjung/Desktop/OSSProj/2025-2-OSSProj-semicolon-02/AI_model/Unknown.jpeg")
    print(result)
"""    
"""
if __name__ == "__main__":
    agent = VisionAgent()
    json_str = agent.analyze("/Users/eunjung/Desktop/OSSProj/2025-2-OSSProj-semicolon-02/AI_model/Unknown.jpeg")
    print(json_str)

    import json
    vision_json = json.loads(json_str)

    from mapping_db import VectorRAGAgent
    rag = VectorRAGAgent()

    output = rag.query(vision_json)

    print("\n🔍 RAG 검색 쿼리:", output["query_text"])
    print("📌 가장 유사한 문장:", output["matched_text"])
    print("☕ 최종 카페인 mg (벡터 RAG):", output["caffeine_mg"])
    """
    
if __name__ == "__main__":
    image_path = "/Users/eunjung/Desktop/OSSProj/2025-2-OSSProj-semicolon-02/AI_model/Unknown.jpeg"

    # 1) Vision 결과
    vision_agent = VisionAgent()
    result_str = vision_agent.analyze(image_path)

    import json
    vision_json = json.loads(result_str)

    # 2) 벡터 RAG 결과
    from mapping_db import VectorRAGAgent
    rag = VectorRAGAgent()
    rag_out = rag.query(vision_json)

    # 3) Vision 정보 + RAG 카페인 값을 한 번에 합쳐서 최종 결과 출력
    final_out = {
        "brand": vision_json.get("brand"),
        "drink_type": vision_json.get("drink_type"),
        "caffeine_mg": rag_out.get("caffeine_mg"),   # ← RAG 기반 카페인 mg
    }

    print(json.dumps(final_out, ensure_ascii=False, indent=2))
    
    
def analyze_drink(image_path: str) -> dict:
    """
    이미지 한 장을 받아서
    Vision → RAG까지 돌린 최종 음료 정보(dict)를 반환.
    형태: { "brand": ..., "drink_type": ..., "caffeine_mg": ... }
    """
    # 1) Vision 결과
    vision_agent = VisionAgent()
    result_str = vision_agent.analyze(image_path)
    vision_json = json.loads(result_str)

    # 2) 벡터 RAG 결과
    rag = VectorRAGAgent()
    rag_out = rag.query(vision_json)

    # 3) 최종 결과
    final_out = {
        "brand": vision_json.get("brand"),
        "drink_type": vision_json.get("drink_type"),
        "caffeine_mg": rag_out.get("caffeine_mg"),
    }
    return final_out

if __name__ == "__main__":
    final_out = analyze_drink(image_path)
    print(json.dumps(final_out, ensure_ascii=False, indent=2))