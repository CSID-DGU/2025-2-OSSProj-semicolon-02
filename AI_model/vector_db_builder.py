import csv
import os
import chromadb
from sentence_transformers import SentenceTransformer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "drink.csv")
CHROMA_PATH = os.path.join(BASE_DIR, "chroma_db")   # 디스크 저장 폴더

def load_texts():
    texts = []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            texts.append(row["text"])
    return texts

def build_vector_db():
    model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")
    texts = load_texts()
    embeddings = model.encode(texts).tolist()

    # 🔥 여기만 바뀜: PersistentClient 로 변경
    client = chromadb.PersistentClient(path=CHROMA_PATH)

    collection = client.get_or_create_collection("drinks")

    # 기존 데이터 지워주기 (중복 방지)
    try:
        client.delete_collection("drinks")
    except Exception:
        pass

    collection = client.create_collection("drinks")

    for i, (text, embedding) in enumerate(zip(texts, embeddings)):
        collection.add(
            ids=[str(i)],
            embeddings=[embedding],
            documents=[text],
        )

    print("✅ 벡터 DB 구축 완료! (디스크에 저장됨)")
    print("총 문장 수:", collection.count())

if __name__ == "__main__":
    build_vector_db()