from gemini_client import analyze_hair_image
from quiz import run_quiz
from recommender import generate_final_prediction
from chatbot import chat_with_user
import json
import os
def main():
    print("🪞 Welcome to the AI Haircare Advisor with RAG 🧴")
    image_path = input("Enter your image path (e.g., hair.jpg): ")

    print("\n📸 Analyzing your hair image...")
    image_analysis = analyze_hair_image(image_path)
    print("\nImage analysis result:\n", image_analysis)

    print("\n🧠 Let's continue with a few short quiz questions.")
    quiz_data = run_quiz()

    print("\n🔍 Generating your personalized recommendation using RAG knowledge base...")
    final_output = generate_final_prediction(image_analysis, quiz_data)

    # 4️⃣ Save user data for memory/chatbot
    user_profile = {
        "quiz": quiz_data,
        "image_analysis": image_analysis,
        "recommendation": final_output
    }

    os.makedirs("user_data", exist_ok=True)

    with open("user_data/user_profile.json", "w") as f:
        json.dump(user_profile, f, indent=2)

    # 5️⃣ Start chatbot follow-up
    print("\n💬 GlissBot is ready! Ask me anything about your hair or Gliss products.")
    print("Type 'exit' anytime to end the chat.\n")

    while True:
        user_message = input("You: ")
        if user_message.lower() in ["exit", "quit"]:
            print("👋 GlissBot: Take care and keep shining ✨")
            break
        bot_response = chat_with_user(user_message, user_profile)
        print("💬 GlissBot:", bot_response, "\n")


if __name__ == "__main__":
    main()
