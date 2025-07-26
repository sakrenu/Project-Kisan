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
# --------------------------------------------------------------------------------------------------------
# def query_crop_planner(region, month, acres, water, weather, lang):
#     lang_instr = "Respond in Kannada with emojis and warmth." if lang == "kn" else "Respond in English with empathy and emojis."

#     prompt = f"""
# You are a trusted Krishi Assistant. A farmer from {region} needs help for {month}. 
# Details:
# - Land size: {acres}
# - Water condition: {water}
# - Weather: {weather}

# Please provide:
# 1. 🌱 Crops to Sow or Harvest
# 2. 🛠️ Field Prep Steps
# 3. ☁️ Weather-aligned Tips
# 4. 🐛 Seasonal Pest Warning
# 5. ❤️ Realistic Motivation based on situation
# 6. ❓ Follow-up question if info missing
# 7. 🔗 Suggest farmer to explore Market Trends next

# {lang_instr}
# """

#     model = genai.GenerativeModel("gemini-2.5-pro")
#     response = model.generate_content(prompt)
#     return response.text
# -------------------------------
def query_crop_planner(region, month, acres, water, weather, lang, goal="", context=""):
    lang_instr = "Respond in Kannada with clarity and emojis." if lang == "kn" else "Respond in English with empathy and emojis."

    prompt = f"""
You are a smart Krishi assistant.

User's goal: {goal}
Extra info: {context}

Farm Info:
- Region: {region}
- Month: {month}
- Acres: {acres}
- Water availability: {water}
- Weather: {weather}

Please respond with:
🌱 Crops to Sow or Harvest
🛠️ Field Prep Tips
☁️ Weather-Aligned Warnings
🐛 Seasonal Risks
❤️ Motivational Quote
❓ Follow-up Question

{lang_instr}
"""
    model = genai.GenerativeModel("gemini-2.5-pro")
    response = model.generate_content(prompt)
    return response.text
