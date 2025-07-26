# # from fastapi import FastAPI
# # from agents.weather_agent import router as weather_router

# # app = FastAPI()
# # app.include_router(weather_router)
# # backend/main.py

# from fastapi import FastAPI, UploadFile, File, Form
# from fastapi.middleware.cors import CORSMiddleware
# from agents.plant_disease_agent import run_plant_agent
# import uvicorn
# from graph.crop_graph import build_crop_graph
# from routes import gemini_convo_agent
# app.include_router(gemini_convo_agent.router)



# app = FastAPI()

# # CORS (adjust frontend URL as needed)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Replace "*" with frontend URL in prod
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/analyze-plant/")
# async def analyze_plant(
#     image: UploadFile = File(...),
#     prompt: str = Form(""),
#     lang: str = Form("en"),
#     lat: float = Form(...),
#     lon: float = Form(...)
# ):
#     result = await run_plant_agent(image, prompt, lang, lat, lon)
#     return result


# # @app.post("/seasonal-plan/")
# # async def seasonal_plan(
# #     region: str = Form(...),
# #     month: str = Form(...),
# #     acres: str = Form(...),
# #     water: str = Form(...),
# #     lang: str = Form("en"),
# #     lat: float = Form(...),
# #     lon: float = Form(...)
# # ):
# #     graph = build_crop_graph()
# #     result = graph.invoke({
# #         "region": region,
# #         "month": month,
# #         "acres": acres,
# #         "water": water,
# #         "lat": lat,
# #         "lon": lon,
# #         "lang": lang
# #     })

# #     return {
# #         "plan": result["crop_suggestion"],
# #         "motivation": result["motivation"]
# #     }

# @app.post("/seasonal-plan/")
# async def seasonal_plan(
#     region: str = Form(...),
#     month: str = Form(...),
#     acres: str = Form(...),
#     water: str = Form(...),
#     lang: str = Form("en"),
#     lat: float = Form(...),
#     lon: float = Form(...),
#     user_goal: str = Form(""),
#     context: str = Form("")
# ):
#     graph = build_crop_graph()
#     result = graph.invoke({
#         "region": region,
#         "month": month,
#         "acres": acres,
#         "water": water,
#         "lat": lat,
#         "lon": lon,
#         "lang": lang,
#         "user_goal": user_goal,
#         "context": context
#     })

#     return {
#         "plan": result["crop_suggestion"],
#         "motivation": result["motivation"]
#     }

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)








from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from agents.plant_disease_agent import run_plant_agent
from graph.crop_graph import build_crop_graph
from routes import gemini_convo_agent  # ✅ only after routes folder is added
import uvicorn

app = FastAPI()

# ✅ Register routes
app.include_router(gemini_convo_agent.router)

# ✅ CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.post("/seasonal-plan/")
async def seasonal_plan(
    region: str = Form(...),
    month: str = Form(...),
    acres: str = Form(...),
    water: str = Form(...),
    lang: str = Form("en"),
    lat: float = Form(...),
    lon: float = Form(...),
    user_goal: str = Form(""),
    context: str = Form("")
):
    graph = build_crop_graph()
    result = graph.invoke({
        "region": region,
        "month": month,
        "acres": acres,
        "water": water,
        "lat": lat,
        "lon": lon,
        "lang": lang,
        "user_goal": user_goal,
        "context": context
    })
    return {
        "plan": result["crop_suggestion"],
        "motivation": result["motivation"]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
