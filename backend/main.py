from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
from langchain_core.messages import HumanMessage, AIMessage
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from agents.plant_disease_agent import run_plant_agent
import uvicorn

# Import the market prediction components
from graph.market_graph import MarketPredictionGraph
from agents.market_agent import MarketAgentState
from utils.market_utils import VoiceProcessor

from utils.market_utils import MarketDataFetcher, PriceAnalyzer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize market prediction components
market_graph = MarketPredictionGraph()
voice_processor = VoiceProcessor()

# Session storage (use Redis or database in production)
market_sessions = {}

# Pydantic models for market prediction
class MarketChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"

class MarketChatResponse(BaseModel):
    response: str
    session_id: str
    market_data: Optional[Dict] = None

class MarketTrendsRequest(BaseModel):
    crop: str
    market: str
    state: str

# Market Prediction Endpoints
@app.post("/market/chat", response_model=MarketChatResponse)
async def market_chat(request: MarketChatRequest):
    """Handle market prediction chat requests."""
    try:
        # Initialize or get session state
        if request.session_id not in market_sessions:
            market_sessions[request.session_id] = {
                "messages": [],
                "commodity": None,
                "state": None,
                "market": None,
                "market_data": None,
                "analysis": None,
                "prediction": None,
                "session_id": request.session_id
            }
        
        session_state = market_sessions[request.session_id]
        
        # Add user message
        user_message = HumanMessage(content=request.message)
        session_state["messages"].append(user_message)
        
        # Run the graph
        result = await market_graph.run(session_state)
        
        # Update session
        market_sessions[request.session_id] = result
        
        # Get the last AI message
        ai_messages = [msg for msg in result["messages"] if isinstance(msg, AIMessage)]
        response_text = ai_messages[-1].content if ai_messages else "I'm sorry, I couldn't process your request."
        
        return MarketChatResponse(
            response=response_text,
            session_id=request.session_id,
            market_data=result.get("market_data")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/market/voice")
async def market_voice(file: UploadFile = File(...), session_id: str = "default"):
    """Handle voice-based market prediction requests."""
    try:
        # Check if voice functionality is available
        from utils.market_utils import VOICE_ENABLED
        if not VOICE_ENABLED:
            raise HTTPException(
                status_code=501, 
                detail="Voice functionality not available. Please install: pip install speechrecognition pydub"
            )
        
        # Transcribe audio
        transcription_result = await voice_processor.transcribe_audio(file)
        
        if transcription_result["status"] == "error":
            raise HTTPException(status_code=400, detail=transcription_result["error"])
        
        # Process the transcribed text through chat
        chat_request = MarketChatRequest(message=transcription_result["text"], session_id=session_id)
        chat_response = await market_chat(chat_request)
        
        return {
            "transcribed_text": transcription_result["text"],
            "response": chat_response.response,
            "session_id": session_id,
            "market_data": chat_response.market_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/market/health")
async def market_health():
    """Health check for market prediction service."""
    return {"status": "healthy", "service": "Market Prediction Agent"}

@app.delete("/market/session/{session_id}")
async def clear_market_session(session_id: str):
    """Clear a specific market prediction session."""
    if session_id in market_sessions:
        del market_sessions[session_id]
        return {"message": f"Market session {session_id} cleared"}
    return {"message": "Session not found"}


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

@app.post("/market/trends")
async def get_quick_results(request: MarketTrendsRequest): 
    """Quick market trends and analysis for selected crop and location."""
    # Parse crop and location
    crop = request.crop
    market = request.market
    state = request.state
    print(f"Received request for crop: {crop}, market: {market}, state: {state}")
    # Fetch market data
    fetcher = MarketDataFetcher()

    data_result = await fetcher.get_market_data(crop, state, market)
    print(f"Fetched data: {data_result}")
    analyzer = PriceAnalyzer()

    analysis = analyzer.analyze_price_trends(data_result.get("data", []))
    prediction = analyzer.generate_prediction(analysis, crop)
    print(f"Analysis result: {analysis}")
    # Compose response
    return {
        "crop": crop,
        "location": market,
        "market_analysis": analysis if analysis.get("status") == "success" else analysis.get("error"),
        "recommendations": [prediction.get("recommendation")] if prediction.get("status") == "success" else [],
        "raw_data": data_result.get("data", [])}


@app.get("/market/crops")
async def get_popular_crops():
    """Get list of popular crops for quick selection."""
    popular_crops = [
    {
        "name": "Rice",
        "local_name": "ಅಕ್ಕಿ",
        "category": "cereal",
        "season": "Kharif/Rabi",
        "image_url": "https://cdn.morningchores.com/wp-content/uploads/2020/04/Growing-Rice-Planting-Guide-Care-Problems-and-Harvest-FB.jpg"
    },
    {
        "name": "Wheat",
        "local_name": "ಗೋಧಿ",
        "category": "cereal",
        "season": "Rabi",
        "image_url": "https://5.imimg.com/data5/SELLER/Default/2024/2/389292204/CR/MJ/TT/191214086/fresh-wheat-crop.webp"
    },
    {
        "name": "Sugarcane",
        "local_name": "ಕಬ್ಬು",
        "category": "cash_crop",
        "season": "Year-round",
        "image_url": "https://www.mahagro.com/cdn/shop/articles/iStock_000063947343"
    },
    {
        "name": "Cotton",
        "local_name": "ಹತ್ತಿ",
        "category": "cash_crop",
        "season": "Kharif",
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDhnhqJIj85bgubo4cJR9FeewK6k5WEGyVJg&s"
    },
    {
        "name": "Tomato",
        "local_name": "ಟೊಮಾಟೊ",
        "category": "vegetable",
        "season": "Year-round",
        "image_url": "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb-732x549.jpg"
    },
    {
        "name": "Onion",
        "local_name": "ಈರುಳ್ಳಿ",
        "category": "vegetable",
        "season": "Rabi/Summer",
        "image_url": "https://www.mosaiccoindia.com/wp-content/uploads/2024/09/Integrated-Nutrient-Management-in-Onion-Crop.jpg"
    },
    {
        "name": "Potato",
        "local_name": "ಆಲೂಗಡ್ಡೆ",
        "category": "vegetable",
        "season": "Rabi",
        "image_url": "https://blog.agribegri.com/public/blog_images/potato-growing-tips-ideas-secrets-and-techniques-600x400.png"
    },
    {
        "name": "Maize",
        "local_name": "ಜೋಳ",
        "category": "cereal",
        "season": "Kharif/Rabi",
        "image_url": "https://cdn.britannica.com/36/167236-050-BF90337E/Ears-corn.jpg"
    }
]
    
    return {"crops": popular_crops}

@app.get("/market/locations")
async def get_popular_locations():
    """Get list of popular market locations."""
    locations = [
        {
            "name": "Bangalore",
            "state": "Karnataka",
            "lat": 12.9716,
            "lon": 77.5946,
            "market_type": "Metropolitan"
        },
        {
            "name": "Mysore",
            "state": "Karnataka", 
            "lat": 12.2958,
            "lon": 76.6394,
            "market_type": "Regional"
        },
        {
            "name": "Hubli",
            "state": "Karnataka",
            "lat": 15.3647,
            "lon": 75.1240,
            "market_type": "Regional"
        },
        {
            "name": "Mandya",
            "state": "Karnataka",
            "lat": 12.5218,
            "lon": 76.8951,
            "market_type": "District"
        }
    ]
    
    return {"locations": locations}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
