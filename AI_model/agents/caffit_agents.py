# AI_model/agents/caffit_agents.py
## supervisor 느낌
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langgraph_supervisor import create_supervisor

from .vision_tool import analyze_drink
from .caffeine_tool import calc_caffeine_state
from .advisor_tool import make_advice
##from .rag_tool import rag_query

llm = ChatOpenAI(model="gpt-4o-mini")  # 또는 "gpt-4.1-mini"


# 워커 에이전트 1: 음료 분석 담당 (Vision + RAG까지 한 번에)
drink_agent = create_react_agent(
    model=llm,
    tools=[analyze_drink],   # Vision + RAG를 내부에서 호출하는 tool
    name="drink_agent",
    prompt=(
        "너는 음료 이미지 분석 전문가다.\n"
        "- 사용자가 사진을 올리면 analyze_drink 도구를 사용해서 "
        "브랜드, 종류, 카페인 양을 찾아라.\n"
        "- 결과는 JSON 그대로 반환하라."
    ),
)

# 워커 에이전트 2: 카페인 상태 계산 담당
caffeine_agent = create_react_agent(
    model=llm,
    tools=[calc_caffeine_state],
    name="caffeine_agent",
    prompt=(
        "너는 카페인 섭취 이력 분석 전문가다.\n"
        "- meta 정보에서 user_id를 읽고, calc_caffeine_state 도구를 호출해라.\n"
        "- 현재 남아 있는 카페인과 오늘 총 섭취량을 요약해서 알려줘라."
    ),
)

# 워커 에이전트 3: 조언 담당
advisor_agent = create_react_agent(
    model=llm,
    tools=[make_advice],
    name="advisor_agent",
    prompt=(
        "너는 카페인 섭취 조언 전문가다.\n"
        "- 앞 단계에서 얻은 이벤트/음료 정보를 바탕으로 make_advice 도구를 사용해서 "
        "자연어 조언을 만들어라.\n"
        "- 사용자가 이해하기 쉽게 3~5 문장으로 설명해라."
    ),
)

# ---- Supervisor 생성 ----
supervisor_workflow = create_supervisor(
    agents=[drink_agent, caffeine_agent, advisor_agent],
    model=llm,
    prompt=(
        "너는 카페인 관리 앱 Caffit의 감독자다.\n"
        "- 입력으로 messages, user_id, image_path 정보를 받는다.\n"
        "- 사용자는 텍스트 질문을 따로 입력하지 않고, 음료 사진만 업로드한다고 가정한다.\n"
        "- image_path가 있으면 drink_agent에게 작업을 맡겨 음료 정보를 얻어라.\n"
        "- user_id가 있으면 caffeine_agent를 호출해서 현재 상태를 확인해라.\n"
        "- 마지막으로 advisor_agent를 사용해서 사용자에게 조언을 전달해라.\n"
        "- 직접 계산하거나 조언하지 말고, 항상 worker 에이전트/툴을 사용해라."
    ),
).compile()  # LangGraph 앱으로 컴파일


def run_caffit_supervisor(
    user_id: int,
    image_path: str | None = None,
):
    """
    앱/백엔드에서 호출할 entrypoint.

    - user_id: DB에 저장된 현재 로그인 사용자 id
    - image_path: 서버/로컬에 저장된 음료 이미지 경로
    """

    # 실제 사용자는 질문을 안 하지만,
    # LLM에게는 "무슨 일을 해야 하는지"를 알려주는 내부 메시지가 필요함
    analysis_request = (
        "사용자가 카페인 관리 앱에서 음료 사진을 업로드했습니다. "
        "사진에서 음료 정보를 추정하고, 사용자의 현재 카페인 상태와 조언을 생성하세요."
    )

    meta_text = f"user_id={user_id}, image_path={image_path}"

    inputs = {
        "messages": [
            {"role": "user", "content": analysis_request},
            {"role": "user", "content": meta_text},
        ]
    }

    result = supervisor_workflow.invoke(inputs)
    # 1) 전체 메시지 리스트
    messages = result["messages"]

    # 2) 마지막 메시지 = 최종 supervisor 답변
    final_msg = messages[-1]
    final_text = final_msg.content  # <- 이게 우리가 앱에 보여줄 텍스트

    # 필요하면 이렇게 JSON으로 정리해서 돌려줘도 됨
    return {
        "advice": final_text,
        # "debug": result,  # 디버깅용으로 필요하면 남겨두고, 실제 서비스에선 빼도 됨
    }

if __name__ == "__main__":
    # 테스트용 입력
    user_id = 1
    image_path = "/Users/eunjung/Desktop/OSSProj/2025-2-OSSProj-semicolon-02/AI_model/Unknown.jpeg"

    result = run_caffit_supervisor(
        user_id=user_id,
        image_path=image_path,
    )

    print("\n=== Supervisor Result ===")
    print(result)