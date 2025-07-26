import os
from typing import Dict, List, Optional, TypedDict, Annotated
import statistics
import requests
from datetime import datetime

from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph.message import add_messages
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.tools import tool
import json

from llm.gemini_client import get_gemini_model
from utils.market_utils import MarketDataFetcher, PriceAnalyzer, VoiceProcessor

class MarketAgentState(TypedDict):
    messages: Annotated[List, add_messages]
    commodity: Optional[str]
    state: Optional[str] 
    market: Optional[str]
    market_data: Optional[Dict]
    analysis: Optional[str]
    prediction: Optional[str]
    session_id: str

class MarketPredictionAgent:
    def __init__(self):
        self.model = get_gemini_model()
        self.data_fetcher = MarketDataFetcher()
        self.analyzer = PriceAnalyzer()
        self.voice_processor = VoiceProcessor()
        
    async def extract_intent(self, state: MarketAgentState) -> MarketAgentState:
        """Extract user intent and commodity information."""
        last_message = state["messages"][-1]
        
        system_prompt = """You are an AI assistant for farmers. Analyze the user's message and extract:
        1. The commodity they're asking about
        2. The state/region they're interested in  
        3. The specific market/city
        4. Their intent (price check, prediction, analysis, general question)
        
        Common commodities: Potato, Onion, Tomato, Rice, Wheat, Cotton, Sugarcane, Maize, Barley, etc.
        Common states: Karnataka, Maharashtra, Punjab, Uttar Pradesh, Tamil Nadu, Gujarat, Rajasthan, etc.
        Common cities: Bangalore, Mumbai, Delhi, Chennai, Pune, Hyderabad, Kolkata, etc.
        
        Be flexible with variations:
        - "potato" = "Potato"
        - "bangalore" = "Bangalore" 
        - "karnataka" = "Karnataka"
        
        Examples:
        - "What is potato price in Bangalore Karnataka?" → commodity: "Potato", state: "Karnataka", market: "Bangalore"
        - "potato rates bangalore" → commodity: "Potato", state: "Karnataka", market: "Bangalore"
        - "onion price mumbai" → commodity: "Onion", state: "Maharashtra", market: "Mumbai"
        
        Only set needs_clarification to true if you cannot identify at least the commodity.
        
        Respond ONLY in valid JSON format: {"commodity": "Potato", "state": "Karnataka", "market": "Bangalore", "intent": "price_check", "needs_clarification": false}
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=last_message.content)
        ]
        
        response = await self.model.ainvoke(messages)
        
        try:
            # Clean the response content to extract JSON
            content = response.content.strip()
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            elif content.startswith("```"):
                content = content.replace("```", "").strip()
            
            extracted_info = json.loads(content)
            state["commodity"] = extracted_info.get("commodity")
            state["state"] = extracted_info.get("state") 
            state["market"] = extracted_info.get("market")
            
            # Debug print (remove in production)
            print(f"Extracted: {extracted_info}")
            
            if extracted_info.get("needs_clarification", False):
                clarification_msg = AIMessage(content="I'd be happy to help you with market information! Please provide the commodity name, state, and city you're interested in. For example: 'What's the potato price in Bangalore, Karnataka?'")
                state["messages"].append(clarification_msg)
            
        except (json.JSONDecodeError, TypeError) as e:
            print(f"JSON parsing error: {e}")
            print(f"Response content: {response.content}")
            
            # Fallback: try to extract using simple string matching
            message_lower = last_message.content.lower()
            
            # Simple extraction fallback
            commodity = None
            state_name = None
            market = None
            
            commodities = ["potato", "onion", "tomato", "rice", "wheat", "cotton", "sugarcane", "maize"]
            states = ["karnataka", "maharashtra", "punjab", "tamil nadu", "gujarat", "rajasthan"]
            cities = ["bangalore", "mumbai", "delhi", "chennai", "pune", "hyderabad", "kolkata"]
            
            for c in commodities:
                if c in message_lower:
                    commodity = c.title()
                    break
            
            for s in states:
                if s in message_lower:
                    state_name = s.title()
                    break
            
            for city in cities:
                if city in message_lower:
                    market = city.title()
                    break
            
            if commodity:
                state["commodity"] = commodity
                state["state"] = state_name
                state["market"] = market
                print(f"Fallback extraction: {commodity}, {state_name}, {market}")
            else:
                clarification_msg = AIMessage(content="I'd be happy to help you with market predictions! Please tell me which commodity, state, and city you're interested in.")
                state["messages"].append(clarification_msg)
        
        return state

    async def fetch_market_data(self, state: MarketAgentState) -> MarketAgentState:
        """Fetch market data if commodity info is available."""
        if state["commodity"] and state["state"] and state["market"]:
            data_result = await self.data_fetcher.get_market_data(
                state["commodity"], state["state"], state["market"]
            )
            state["market_data"] = data_result
            
            if data_result["status"] == "error":
                error_msg = AIMessage(content=f"Sorry, I couldn't fetch market data for {state['commodity']} in {state['market']}, {state['state']}. Please check if the commodity and location names are correct.")
                state["messages"].append(error_msg)
        
        return state

    async def analyze_data(self, state: MarketAgentState) -> MarketAgentState:
        """Analyze the fetched market data."""
        if state["market_data"] and state["market_data"]["status"] == "success":
            analysis_result = self.analyzer.analyze_price_trends(state["market_data"]["data"])
            prediction_result = self.analyzer.generate_prediction(analysis_result, state["commodity"])
            
            state["analysis"] = analysis_result
            state["prediction"] = prediction_result
        
        return state

    async def generate_response(self, state: MarketAgentState) -> MarketAgentState:
        """Generate final response with analysis and predictions."""
        if not state.get("analysis") or not state.get("prediction"):
            return state
        
        analysis = state["analysis"]
        prediction = state["prediction"]
        commodity = state["commodity"]
        market = state["market"]
        state_name = state["state"]
        
        if analysis["status"] == "success" and prediction["status"] == "success":
            response_content = f"""📊 **Market Analysis for {commodity} in {market}, {state_name}**

**Current Market Status:**
• Current Price: ₹{analysis['current_price']}/quintal
• Average Price: ₹{analysis['average_price']}/quintal  
• Price Trend: {analysis['trend'].title()}
• Market Volatility: ₹{analysis['price_volatility']}

**Price Predictions:**
🔮 **7-day forecast:** ₹{prediction['predictions']['7_days']['price']}/quintal 
   (Change: {'+' if prediction['predictions']['7_days']['change'] >= 0 else ''}₹{prediction['predictions']['7_days']['change']})
   Confidence: {prediction['predictions']['7_days']['confidence'].title()}

🔮 **30-day forecast:** ₹{prediction['predictions']['30_days']['price']}/quintal
   (Change: {'+' if prediction['predictions']['30_days']['change'] >= 0 else ''}₹{prediction['predictions']['30_days']['change']})
   Confidence: {prediction['predictions']['30_days']['confidence'].title()}

**💡 Recommendation:**
{prediction['recommendation']}

**📈 Market Insights:**
• Price Range: ₹{analysis['price_range']['min']} - ₹{analysis['price_range']['max']}
• Data Points Analyzed: {analysis['data_points']} recent entries
• Market Stability: {'High' if analysis['price_volatility'] < 100 else 'Medium' if analysis['price_volatility'] < 200 else 'Low'}

*Note: Predictions are based on historical trends and market analysis. Actual prices may vary due to weather, demand, and other market factors.*"""
        
        else:
            response_content = f"I encountered an issue analyzing the market data for {commodity}. Please try again or check if the commodity and location details are correct."
        
        ai_message = AIMessage(content=response_content)
        state["messages"].append(ai_message)
        
        return state

    async def process_voice_input(self, audio_file, session_id: str = "default"):
        """Process voice input and return transcribed text."""
        return await self.voice_processor.transcribe_audio(audio_file)

    async def chat_with_agent(self, message: str, session_id: str = "default"):
        """Main chat interface for the agent."""
        # This will be implemented in the graph workflow
        pass

