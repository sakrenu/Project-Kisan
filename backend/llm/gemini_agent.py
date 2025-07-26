# backend/llm/gemini_agent.py

import google.generativeai as genai
import os
from PIL import Image
from dotenv import load_dotenv

load_dotenv() 


genai.configure(api_key=os.getenv("GEMINI_API_KEY"))  # From ai.google.dev

def query_gemini_multimodal(image_path, prompt_text, lang):
    model = genai.GenerativeModel("gemini-2.5-pro")

    lang_part = "in Kannada" if lang == "kn" else "in English"

    prompt = f"""
You are a farming expert. A farmer has uploaded an image of a diseased plant.

Please identify the disease or issue, and respond with:
1. Name of disease/pest
2. Likely cause
3. Affordable and locally available remedies
4. Preventive advice

Please answer clearly in  {lang_part}  bullet points.

Additional farmer input:
{prompt_text}
"""

    image = Image.open(image_path)

    response = model.generate_content(
        contents=[prompt, image],
        generation_config={"temperature": 0.4}
    )

    return response.text
