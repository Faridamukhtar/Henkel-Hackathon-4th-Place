import google.generativeai as genai
from PIL import Image

genai.configure(api_key="AIzaSyAdQomLWtUhRt_AMmIDObnZdrF_lP7T0kM")
model = genai.GenerativeModel("gemini-2.5-flash")

def analyze_hair_image(image_path):
    image = Image.open(image_path)
    response = model.generate_content([
        "Analyze this photo and describe the hair condition (dryness, shine, frizz, split ends, and visible damage).",
        image
    ])
    return response.text
