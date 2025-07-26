import requests

API_KEY = "892fbb7e69457575c5de90c4b446c719"

def fetch_weather_summary(location):
    lat, lon = location.get("lat"), location.get("lon")
    if not lat or not lon:
        raise ValueError("Missing location coordinates")

    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    resp = requests.get(url).json()
    desc = resp["weather"][0]["description"]
    temp = resp["main"]["temp"]
    return f"{desc}, temperature around {temp}°C"