# backend/agents/plant_disease_agent.py

import tempfile
from graph.plant_graph import build_plant_disease_graph

async def run_plant_agent(image_file, prompt, lang, lat, lon):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        content = await image_file.read()
        temp.write(content)
        image_path = temp.name

    graph = build_plant_disease_graph()
    result = graph.invoke({
        "image_path": image_path,
        "prompt_text": prompt,
        "lang": lang,
        "lat": lat,
        "lon": lon
    })

    return {
        "analysis": result["gemini_result"],
        "stores": result["stores"]
    }
