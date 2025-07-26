from langgraph.graph import StateGraph, END
from llm.gemma_planner import generate_crop_plan
from utils.weather import fetch_weather_summary

def weather_fetch_node(state):
    location = state["location"]
    weather = fetch_weather_summary(location)
    return {**state, "weather_summary": weather}

def plan_node(state):
    plan = generate_crop_plan(
        location=state["location"],
        month=state["month"],
        weather_summary=state["weather_summary"],
        lang=state["lang"]
    )
    return {**state, "plan": plan}

graph = StateGraph()
graph.add_node("fetch_weather", weather_fetch_node)
graph.add_node("plan", plan_node)
graph.set_entry_point("fetch_weather")
graph.add_edge("fetch_weather", "plan")
graph.set_finish_point("plan")

weather_agent_graph = graph.compile()