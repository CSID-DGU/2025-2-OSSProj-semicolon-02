# AI_model/langgraph_supervisor.py
from langgraph.graph import StateGraph, END
from langgraph.constants import START

def create_supervisor(agents, model, prompt):
    drink_agent, caffeine_agent, advisor_agent = agents

    graph = StateGraph(dict)

    # 노드 등록
    graph.add_node("drink_agent", drink_agent)
    graph.add_node("caffeine_agent", caffeine_agent)
    graph.add_node("advisor_agent", advisor_agent)

    # 엣지 연결: drink → caffeine → advisor → END
    graph.add_edge(START, "drink_agent")
    graph.add_edge("drink_agent", "caffeine_agent")
    graph.add_edge("caffeine_agent", "advisor_agent")
    graph.add_edge("advisor_agent", END)

    # 🔥 여기서 컴파일
    app = graph.compile()

    # 그리고 "실행 가능한 앱" 리턴
    return app