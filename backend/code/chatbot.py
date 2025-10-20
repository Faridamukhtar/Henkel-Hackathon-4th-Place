from retreiver import retrieve_relevant_docs_chatbot, load_knowledge_base_chatbot
from recommender import generate_final_prediction
import google.generativeai as genai

# Configure API key globally
genai.configure(api_key="API_KEY")
model = genai.GenerativeModel("gemini-2.5-flash")

docs, embeddings = load_knowledge_base_chatbot()

def chat_with_user(user_message, user_profile):
    """
    Respond to user messages using knowledge base + personalization.
    """
    # Personal context
    user_context = f"""
User Hair Profile:
{user_profile}

Previous recommendation: {user_profile.get('recommendation', 'None')}
"""

    # Retrieve RAG context
    relevant_docs = retrieve_relevant_docs_chatbot(user_message, docs, embeddings, top_k=2)

    # Build the prompt
    prompt = f"""
You are GlissBot, a friendly AI haircare expert.
Use the following info to respond helpfully and naturally.

🧍 User info:
{user_context}

📘 Knowledge base:
{' '.join(relevant_docs)}

🗣️ User question:
{user_message}

Give a helpful, concise, personalized answer.
"""

    # Generate response
    response = model.generate_content(
        contents=[{
            "parts": [
                {"text": prompt}
            ]
        }]
    )

    # Extract text safely
    bot_reply = response.text
    return bot_reply

