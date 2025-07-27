import os
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

# Environment setup
load_dotenv()
# Assumes GOOGLE_API_KEY is set in your .env file

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

# Add these new functions to the existing file
def get_kannada_model():
    """Get Gemini model configured for Kannada responses"""
    return ChatGoogleGenerativeAI(
        model="models/gemini-1.5-pro-latest",
        temperature=0.4,
        generation_config={
            "response_mime_type": "text/plain",
            "response_language": "kn"  # Kannada language code
        }
    )

async def generate_kannada_response(prompt: str, context: str = "") -> str:
    """Generate response in simple Kannada suitable for farmers"""
    model = get_kannada_model()
    system_message = f"""
    You are an agricultural assistant helping farmers in Karnataka. 
    Respond in simple Kannada using easy-to-understand words.
    Context: {context}
    """
    response = await model.ainvoke([
        ("system", system_message),
        ("user", prompt)
    ])
    return response.content