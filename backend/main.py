from fastapi import FastAPI
from agents.weather_agent import router as weather_router

app = FastAPI()
app.include_router(weather_router)