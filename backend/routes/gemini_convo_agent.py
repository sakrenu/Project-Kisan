from fastapi import APIRouter, Request
from pydantic import BaseModel
import google.generativeai as genai
import os

router = APIRouter()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class PromptBody(BaseModel):
    prompt: str

@router.post("/gemini-convo-agent")
async def gemini_convo_agent(body: PromptBody):
    prompt = f"""
You are a Krishi assistant helping a farmer.

User said: "{body.prompt}"

Known information is provided above. Based on it, determine what question you should ask next to help build a seasonal crop plan.

Respond in strict JSON format like:
{{ "next_question": "What month are you planning for?", "field_to_fill": "month" }}

If the user input is not related to farming, return:
{{ "next_question": "🙏 I couldn’t understand that. Please share your region or farming goal.", "field_to_fill": "context" }}
    """.strip()

    model = genai.GenerativeModel("gemini-2.5-pro")
    response = model.generate_content(prompt)

    try:
        json_data = eval(response.text.strip())
        return json_data
    except Exception as e:
        print("Gemini parse error:", e)
        return {
            "next_question": "🙏 I couldn’t understand that. Please share your region or farming goal.",
            "field_to_fill": "context"
        }
