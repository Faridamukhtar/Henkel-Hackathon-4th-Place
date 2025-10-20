import google.generativeai as genai
from PIL import Image

genai.configure(api_key="API_KEY")
model = genai.GenerativeModel("gemini-2.5-flash")

def analyze_hair_image(image_path, max_chars=100):
    image = Image.open(image_path)
    prompt = f"Analyze this photo and describe the hair condition (dryness, shine, frizz, split ends, visible damage). Be concise and summarize in no more than {max_chars} characters."
    
    response = model.generate_content([
        prompt,
        image
    ])
    
    # Ensure strict character limit
    text = response.text
    if len(text) > max_chars:
        text = text[:max_chars]
    
    return text
