import os
import base64
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
당신은 음료 인식 비전 모델입니다.
이미지를 보고 브랜드, 제품명, 용량, 카페인(mg)을 추출하고,
반드시 '커피/음료 종류(drink_type)'를 하나 추론해서 포함해야 합니다.

항상 아래 JSON 형식만 출력하십시오.

{
  "brand": "string|null",
  "product_name": "string|null",
  "drink_type": "string",      // 예: "Iced Americano", "Caffe Latte", "Cold Brew", "Ade"
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

def encode_image_to_data_url(image_path: str) -> str:
    """로컬 이미지를 base64 data URL 문자열로 변환"""
    with open(image_path, "rb") as f:
        image_bytes = f.read()
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    # jpg라고 가정 (png면 image/png로 바꿔도 됨)
    return f"data:image/jpeg;base64,{b64}"

def analyze_image(image_path: str):
    data_url = encode_image_to_data_url(image_path)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "이 이미지 속 음료 정보를 추출해줘."},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": data_url
                        },
                    },
                ],
            },
        ],
    )

    print(response.choices[0].message.content)


if __name__ == "__main__":
    analyze_image("/Users/eunjung/Desktop/OSSProj/AI_model/Unknown.jpeg")