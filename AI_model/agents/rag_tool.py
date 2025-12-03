from langchain_core.tools import tool
from ..mapping_db import VectorRAGAgent

rag = VectorRAGAgent()

@tool
def rag_query(drink_json: dict):
    """
    Vision 결과를 받아 카페인 mg를 RAG로 추정한다.
    """
    return rag.query(drink_json)