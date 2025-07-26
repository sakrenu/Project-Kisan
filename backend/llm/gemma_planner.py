from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

tokenizer = AutoTokenizer.from_pretrained("google/gemma-2b-it")  # Replace with Gemma-3n local path
model = AutoModelForCausalLM.from_pretrained("google/gemma-2b-it", device_map="auto")

def generate_crop_plan(location: str, month: str, weather_summary: str, lang: str = "en"):
    prompt = f"""
You are a multilingual agricultural assistant helping Indian farmers choose the best crops based on region, month, and weather.

Region: {location}
Month: {month}
Weather Summary: {weather_summary}
Language: {lang}

Give a short, farmer-friendly answer recommending 1–2 crops to sow or harvest, and why. Add advice on water or pesticide usage if relevant.
Respond in {lang}.
Return JSON like:
{{
  "recommendations": [
    {{"crop": "Tomato", "type": "Sow", "reason": "Hot and dry weather is favorable"}},
    {{"crop": "Onion", "type": "Harvest", "reason": "Soil moisture is low, ideal for lifting"}}
  ],
  "advice": "Avoid watering for next 3 days due to expected rain"
}}
"""
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=512)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)