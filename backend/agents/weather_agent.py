from fastapi import APIRouter, Request
from graph.weather_graph import weather_agent_graph

router = APIRouter()

@router.post("/agent/weather")
async def run_weather_agent(request: Request):
    body = await request.json()
    result = weather_agent_graph.invoke(body)
    return result.get("plan")