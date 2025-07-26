# backend/graph/plant_graph.py

from langgraph.graph import StateGraph
from typing import TypedDict
from llm.gemini_agent import query_gemini_multimodal
from utils.location_helper import find_agri_stores

# ✅ Define state schema
class PlantScanState(TypedDict):
    image_path: str
    prompt_text: str
    lang: str
    lat: float
    lon: float
    gemini_result: str
    stores: list

def build_plant_disease_graph():
    builder = StateGraph(state_schema=PlantScanState)  # ✅ FIXED LINE

    def analyze_image(state: PlantScanState) -> PlantScanState:
        result = query_gemini_multimodal(
            image_path=state["image_path"],
            prompt_text=state["prompt_text"],
            lang=state["lang"]
        )
        state["gemini_result"] = result
        return state

    def find_stores(state: PlantScanState) -> PlantScanState:
        state["stores"] = find_agri_stores(
            lat=state["lat"],
            lon=state["lon"]
        )
        return state

    builder.add_node("analyze_image", analyze_image)
    builder.add_node("find_stores", find_stores)

    builder.set_entry_point("analyze_image")
    builder.add_edge("analyze_image", "find_stores")
    builder.set_finish_point("find_stores")

    return builder.compile()
