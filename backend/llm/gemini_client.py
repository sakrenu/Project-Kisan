import os
from langchain_google_genai import ChatGoogleGenerativeAI

# Environment setup
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

def get_gemini_model(temperature: float = 0.3):
    """Get configured Gemini model instance."""
    return ChatGoogleGenerativeAI(
        model="models/gemini-2.0-flash-001", 
        temperature=temperature
    )

def get_gemini_model_creative(temperature: float = 0.7):
    """Get Gemini model for creative tasks."""
    return ChatGoogleGenerativeAI(
        model="models/gemini-2.0-flash-001", 
        temperature=temperature
    )

