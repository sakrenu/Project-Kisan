# import requests

# API_KEY = "892fbb7e69457575c5de90c4b446c719"

# def fetch_weather_summary(location):
#     lat, lon = location.get("lat"), location.get("lon")
#     if not lat or not lon:
#         raise ValueError("Missing location coordinates")

#     url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
#     resp = requests.get(url).json()
#     desc = resp["weather"][0]["description"]
#     temp = resp["main"]["temp"]
#     return f"{desc}, temperature around {temp}°C"
import requests
import os


def get_weather_forecast(lat, lon):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={api_key}"

    res = requests.get(url)
    data = res.json()

    desc = data['weather'][0]['description']
    temp = data['main']['temp']
    humidity = data['main']['humidity']
    wind = data['wind']['speed']

    return f"{desc.capitalize()}, temperature: {temp}°C, humidity: {humidity}%, wind: {wind} m/s"
