import requests
import statistics
from typing import Dict, List, Optional
import io
from fastapi import UploadFile

# Optional imports for voice functionality
try:
    import speech_recognition as sr
    from pydub import AudioSegment
    VOICE_ENABLED = True
    print("[INFO] Voice functionality enabled (speech_recognition and pydub imported)")
except ImportError:
    VOICE_ENABLED = False
    sr = None
    AudioSegment = None
    print("[WARNING] Voice functionality not available (missing speech_recognition or pydub)")

class MarketDataFetcher:
    def __init__(self,
                 api_key: str = "579b464db66ec23bdd0000011e371f3cdccd48dc5d6930b4bc94ccca",
                 base_url: str = "https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24"):
        self.api_key = api_key
        self.base_url = base_url
        print(f"[INIT] MarketDataFetcher initialized with base_url={self.base_url}")

    async def get_market_data(self, commodity: str, state: str, market: str) -> Dict:
        print(f"[CALL] get_market_data called with commodity={commodity}, state={state}, market={market}")
        params = {
            "api-key": self.api_key,
            "format": "json",
            "filters[Commodity]": commodity,
            "filters[State]": state,
            "filters[District]": market,  # Corrected field name
            "limit": 100
        }
        try:
            response = requests.get(self.base_url, params=params, timeout=30)
            print(f"[DEBUG] Full request: {response.request.method} {response.request.url}")
            response.raise_for_status()
            data = response.json().get("records", [])
            print(f"[SUCCESS] Received market data with {len(data)} records")
            return {
                "status": "success",
                "data": data,
                "commodity": commodity,
                "state": state,
                "market": market
            }
        except Exception as e:
            print(f"[ERROR] Error fetching market data: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "commodity": commodity,
                "state": state,
                "market": market
            }

class PriceAnalyzer:
    def analyze_price_trends(self, market_data: List[Dict]) -> Dict:
        """Analyze price trends from historical market data."""
        if not market_data:
            return {"status": "error", "error": "No data provided"}
        
        try:
            # Extract prices and dates
            prices = []
            dates = []
            for entry in market_data:
                try:
                    # Handle both old and new field names
                    min_price = float(entry.get("Min_Price", entry.get("Min Prize", 0)))
                    max_price = float(entry.get("Max_Price", entry.get("Max Prize", 0)))
                    modal_price = float(entry.get("Modal_Price", entry.get("Model Prize", 0)))
                    
                    # Calculate average price
                    if min_price and max_price:
                        avg_price = (min_price + max_price) / 2
                    elif modal_price:
                        avg_price = modal_price
                    else:
                        continue  # Skip if no valid price data
                    
                    prices.append(avg_price)
                    dates.append(entry.get("Arrival_Date", entry.get("Date", "")))
                except (ValueError, TypeError) as e:
                    print(f"Error processing entry: {entry}, Error: {e}")
                    continue
            
            if not prices:
                return {"status": "error", "error": "No valid price data found"}
            
            # Sort by date (most recent first) - handle date format dd/mm/yyyy
            try:
                from datetime import datetime
                
                def parse_date(date_str):
                    try:
                        return datetime.strptime(date_str, "%d/%m/%Y")
                    except:
                        return datetime.min
                
                # Create price-date pairs and sort by date (newest first)
                price_date_pairs = [(price, date) for price, date in zip(prices, dates)]
                price_date_pairs.sort(key=lambda x: parse_date(x[1]), reverse=True)
                prices = [pair[0] for pair in price_date_pairs]
                dates = [pair[1] for pair in price_date_pairs]
            except:
                pass  # Keep original order if date parsing fails
            
            # Calculate statistics
            current_price = prices[0] if prices else 0
            avg_price = statistics.mean(prices)
            price_volatility = statistics.stdev(prices) if len(prices) > 1 else 0
            
            # Trend analysis (compare recent vs older prices)
            if len(prices) >= 5:
                recent_avg = statistics.mean(prices[:5])  # Last 5 entries
                older_avg = statistics.mean(prices[-5:])  # First 5 entries
                if recent_avg > older_avg * 1.05:
                    recent_trend = "increasing"
                elif recent_avg < older_avg * 0.95:
                    recent_trend = "decreasing"
                else:
                    recent_trend = "stable"
            elif len(prices) >= 2:
                recent_trend = "increasing" if prices[0] > prices[-1] else "decreasing" if prices[0] < prices[-1] else "stable"
            else:
                recent_trend = "insufficient data"
            
            # Price range
            min_observed = min(prices)
            max_observed = max(prices)
            
            print(f"Price analysis: Current={current_price}, Avg={avg_price}, Trend={recent_trend}, Points={len(prices)}")
            
            return {
                "status": "success",
                "current_price": round(current_price, 2),
                "average_price": round(avg_price, 2),
                "price_volatility": round(price_volatility, 2),
                "trend": recent_trend,
                "price_range": {"min": min_observed, "max": max_observed},
                "data_points": len(prices)
            }
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def generate_prediction(self, analysis: Dict, commodity: str) -> Dict:
        """Generate price predictions based on trend analysis."""
        if analysis.get("status") != "success":
            return {"status": "error", "error": "Invalid analysis data"}
        
        try:
            current_price = analysis["current_price"]
            volatility = analysis["price_volatility"]
            trend = analysis["trend"]
            
            # Simple prediction logic (can be enhanced with ML models)
            if trend == "increasing":
                predicted_change = volatility * 0.1  # 10% of volatility
                confidence = "moderate"
            elif trend == "decreasing":
                predicted_change = -volatility * 0.1
                confidence = "moderate"
            else:
                predicted_change = 0
                confidence = "low"
            
            # 7-day prediction
            predicted_price_7d = current_price + predicted_change
            
            # 30-day prediction (more uncertainty)
            predicted_price_30d = current_price + (predicted_change * 2)
            
            return {
                "status": "success",
                "commodity": commodity,
                "current_price": current_price,
                "predictions": {
                    "7_days": {
                        "price": round(predicted_price_7d, 2),
                        "change": round(predicted_change, 2),
                        "confidence": confidence
                    },
                    "30_days": {
                        "price": round(predicted_price_30d, 2),
                        "change": round(predicted_change * 2, 2),
                        "confidence": "low" if confidence == "moderate" else "very low"
                    }
                },
                "recommendation": self._get_trading_recommendation(trend, current_price, analysis["average_price"])
            }
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def _get_trading_recommendation(self, trend: str, current_price: float, avg_price: float) -> str:
        """Generate trading recommendations based on analysis."""
        if current_price > avg_price * 1.1:
            if trend == "increasing":
                return "Consider selling soon - prices are above average and may peak"
            else:
                return "Good time to sell - prices are high and trending down"
        elif current_price < avg_price * 0.9:
            if trend == "decreasing":
                return "Wait to sell - prices are low and may drop further"
            else:
                return "Good time to buy/hold - prices are low and trending up"
        else:
            return f"Prices are near average - monitor {trend} trend for opportunities"

class VoiceProcessor:
    def __init__(self):
        if not VOICE_ENABLED:
            self.recognizer = None
        else:
            self.recognizer = sr.Recognizer()
    
    async def transcribe_audio(self, audio_file: UploadFile) -> Dict:
        """Convert audio file to text."""
        if not VOICE_ENABLED:
            return {
                "status": "error", 
                "error": "Voice functionality not available. Install speech_recognition and pydub packages."
            }
        
        try:
            # Read the uploaded audio file
            audio_data = await audio_file.read()
            
            # Convert audio to wav format if needed
            audio_segment = AudioSegment.from_file(io.BytesIO(audio_data))
            wav_data = io.BytesIO()
            audio_segment.export(wav_data, format="wav")
            wav_data.seek(0)
            
            # Recognize speech
            with sr.AudioFile(wav_data) as source:
                audio = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio)
            
            return {"status": "success", "text": text}
            
        except sr.UnknownValueError:
            return {"status": "error", "error": "Could not understand the audio"}
        except sr.RequestError as e:
            return {"status": "error", "error": f"Speech recognition error: {str(e)}"}
        except Exception as e:
            return {"status": "error", "error": str(e)}

