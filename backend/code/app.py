from fastapi import FastAPI, UploadFile, Form, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import json

from gemini_client import analyze_hair_image
from recommender import generate_final_prediction
from chatbot import chat_with_user

os.makedirs("user_data", exist_ok=True)

user_profiles = {}



from gemini_client import analyze_hair_image
from recommender import generate_final_prediction

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_methods=["*"],
    allow_headers=["*"],
)
os.makedirs("user_data", exist_ok=True)

# In-memory storage
user_profiles = {}

@app.post("/analyze_and_recommend")
async def analyze_and_recommend(
    file: UploadFile | None = File(None),
    quiz_data_json: str = Form(...)
):
    """
    Receives:
    - file: optional uploaded hair image
    - quiz_data_json: JSON string with user attributes from frontend
    Returns:
    - JSON with recommendation and analysis
    """
    image_analysis = "No image provided"

    # 1️⃣ Save and analyze uploaded image if present
    if file:
        image_path = f"user_data/{file.filename}"
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        image_analysis = analyze_hair_image(image_path)

    # 2️⃣ Parse quiz data
    try:
        quiz_data = json.loads(quiz_data_json)
    except json.JSONDecodeError:
        return JSONResponse({"error": "Invalid JSON for quiz data"}, status_code=400)

    # 3️⃣ Generate recommendation
    final_output = generate_final_prediction(image_analysis, quiz_data)

    # 4️⃣ Save user profile
    user_id = file.filename if file else f"user_{len(user_profiles)+1}"
    user_profile = {
        "quiz": quiz_data,
        "image_analysis": image_analysis,
        "recommendation": final_output
    }
    user_profiles[user_id] = user_profile

    # Save to disk
    with open(f"user_data/{user_id}_profile.json", "w") as f:
        json.dump(user_profile, f, indent=2)

    # 5️⃣ Return response
    response = {
        "user_id": user_id,
        "image_analysis": image_analysis,
        "quiz_data": quiz_data,
        "recommendation": final_output
    }
    return JSONResponse(response)

# @app.post("/chat")
# async def chat(user_id: str = Form(...), message: str = Form(...)):
#     """
#     Receives:
#     - user_id: to fetch the profile
#     - message: user's chat message
#     Returns:
#     - chatbot response
#     """
#     if user_id not in user_profiles:
#         return JSONResponse({"error": "User profile not found"}, status_code=404)

#     user_profile = user_profiles[user_id]

#     bot_response = chat_with_user(message, user_profile)
#     return JSONResponse({"response": bot_response})
