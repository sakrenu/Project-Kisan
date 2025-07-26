# backend/utils/location_helper.py

import requests
import os

def find_agri_stores(lat, lon):
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")

    url = (
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        f"?location={lat},{lon}&radius=5000&type=store&keyword=agriculture"
        f"&key={api_key}"
    )

    response = requests.get(url)
    data = response.json()

    return [{
        "name": place.get("name"),
        "location": place.get("vicinity")
    } for place in data.get("results", [])]
