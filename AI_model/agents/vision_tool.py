import json
from langchain_core.tools import tool
from ..drink_image import VisionAgent
from ..mapping_db import VectorRAGAgent


vision = VisionAgent()
rag = VectorRAGAgent()


@tool
def analyze_drink(image_path: str) -> dict:
    """
    카메라로 찍은 음료 이미지를 분석해서
    - 브랜드 / 음료명은 VisionAgent로 추출하고
    - 카페인 mg는 벡터 DB(VectorRAGAgent)에서 가져온다.
    """

    # 1) 이미지 → VisionAgent로 브랜드 / 제품명 추출
    info = vision.analyze(image_path)
    if isinstance(info, str):
        info = json.loads(info)

    brand = info.get("brand", "")
    drink_type = info.get("drink_type", "")

    # 2) 벡터 DB에서 가장 유사한 음료 검색
    rag_result = rag.query(
        {
            "brand": brand,
            "drink_type": drink_type,
        }
    )

    caffeine_mg = rag_result.get("caffeine_mg")

    # 디버깅용으로 찍어보고 싶으면:
    print("[DEBUG] Vision 결과:", info)
    print("[DEBUG] RAG 결과:", rag_result)

    return {
        "brand": brand,
        "drink_type": drink_type,
        "caffeine_mg": caffeine_mg,          
        "matched_text": rag_result.get("matched_text"),
    }