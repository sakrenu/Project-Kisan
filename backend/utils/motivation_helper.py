
def get_motivation(context, lang='en'):
    if 'drought' in context or 'low water' in context:
        return "ನೀರು ಕಡಿಮೆ ಇದ್ದರೂ ಸಹ, ನೀವು ಸರಿಯಾದ ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿದರೆ ಉತ್ತಮ ಆದಾಯ ಸಾಧ್ಯ. ಧೈರ್ಯವಿಟ್ಟು ಮುಂದುವರೆಯಿರಿ 🙏" if lang == 'kn' else "Even with low water, the right crop can give you income. Stay strong 💪"
    if 'flood' in context:
        return "ಇಡೀ ಪರಿಸ್ಥಿತಿಯನ್ನು ಮಣ್ಣಿನ ಶಕ್ತಿಯಂತೆ ಸ್ವೀಕರಿಸಿ. ನಿಮ್ಮ ಶ್ರಮ ಫಲ ನೀಡುತ್ತದೆ 🌱" if lang == 'kn' else "Accept the challenge like soil soaks the rain. Your effort will yield fruit."
    return "ಯತ್ನಿಸುವ ರೈತನಿಗೆ ಅಸಾಧ್ಯವೆಂಬ ಪದವಿಲ್ಲ. ನೀವು ದೇಶದ ನಿಜವಾದ ಹೀರೋ 🤝" if lang == 'kn' else "There is no such thing as impossible for a farmer who tries. You are the real hero 🙏"
