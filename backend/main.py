# from fastapi import FastAPI
# from agents.weather_agent import router as weather_router

# app = FastAPI()
# app.include_router(weather_router)
# backend/main.py

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from agents.plant_disease_agent import run_plant_agent
import uvicorn

app = FastAPI()

# CORS (adjust frontend URL as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-plant/")
async def analyze_plant(
    image: UploadFile = File(...),
    prompt: str = Form(""),
    lang: str = Form("en"),
    lat: float = Form(...),
    lon: float = Form(...)
):
    result = await run_plant_agent(image, prompt, lang, lat, lon)
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
