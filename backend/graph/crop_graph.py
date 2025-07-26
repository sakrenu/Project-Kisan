from langgraph.graph import StateGraph
from typing import TypedDict
from llm.gemini_agent import query_crop_planner
from utils.weather_helper import get_weather_forecast
from utils.motivation_helper import get_motivation

# class CropState(TypedDict):
#     region: str
#     month: str
#     acres: str
#     water: str
#     lang: str
#     lat: float
#     lon: float
#     weather: str
#     crop_suggestion: str
#     motivation: str

class CropState(TypedDict):
    region: str
    month: str
    acres: str
    water: str
    lang: str
    lat: float
    lon: float
    user_goal: str
    context: str
    weather: str
    crop_suggestion: str
    motivation: str


def build_crop_graph():
    builder = StateGraph(state_schema=CropState)

    def fetch_weather(state):
        state["weather"] = get_weather_forecast(state["lat"], state["lon"])
        return state

    def ask_gemini(state):
        state["crop_suggestion"] = query_crop_planner(
            state["region"], state["month"], state["acres"],
            state["water"], state["weather"], state["lang"]
        )
        return state

    def add_motivation(state):
        context = state["crop_suggestion"] + state["weather"]
        state["motivation"] = get_motivation(context , state["lang"])
        return state
    def run_gemini_agent(state: CropState) -> CropState:
        state["crop_suggestion"] = query_crop_planner(
            region=state["region"],
            month=state["month"],
            acres=state["acres"],
            water=state["water"],
            weather=state["weather"],
            lang=state["lang"],
            goal=state.get("user_goal", ""),
            context=state.get("context", "")
        )
        return state

    builder.add_node("fetch_weather", fetch_weather)
    builder.add_node("ask_gemini", ask_gemini)
    builder.add_node("add_motivation", add_motivation)
    builder.add_node("run_gemini_agent", run_gemini_agent)

    builder.set_entry_point("fetch_weather")
    builder.add_edge("fetch_weather", "ask_gemini")
    builder.add_edge("ask_gemini", "run_gemini_agent")
    builder.add_edge("run_gemini_agent","add_motivation" )
    builder.set_finish_point("add_motivation")
    

    return builder.compile()
