from gemini_client import model
from retreiver import load_knowledge_base, retrieve_relevant_docs
import re

def generate_final_prediction(image_analysis, quiz_data):
    """
    Generate a structured Gliss recommendation with enforced fields:
    - Recommended line
    - Reason
    - Product routine
    - Alternative (optional)
    """

    # Load knowledge base
    docs, embeddings = load_knowledge_base()

    # 1️⃣ Build initial query
    query = f"""
Hair characteristics: {quiz_data}
Image analysis: {image_analysis}
Find which Gliss line best fits this combination.
"""

    # 2️⃣ Retrieve relevant docs
    relevant_docs = retrieve_relevant_docs(query, docs, embeddings, top_k=2)
    joined_docs = "\n\n".join(relevant_docs)

    # 3️⃣ Construct prompt with strict structure
    prompt = f"""
You are GlissBot, a professional haircare expert.

Use the following knowledge and user information to make a recommendation.

Knowledge base:
{joined_docs}

Hair quiz answers:
{quiz_data}

Image analysis:
{image_analysis}

Provide your response in **this exact format**:

Recommended line: <name of Gliss line>
Reason: <short explanation why this line suits the user>
Product routine: <Shampoo + Conditioner + Mask if applicable>
Alternative: <optional alternative line and reason>

Do not add anything else.
"""

    # 4️⃣ Generate response
    response = model.generate_content(prompt)
    text = response.text.strip()

    # 5️⃣ Parse structured fields using regex
    line_match = re.search(r"Recommended line:\s*(.*)", text, re.IGNORECASE)
    reason_match = re.search(r"Reason:\s*(.*)", text, re.IGNORECASE)
    routine_match = re.search(r"Product routine:\s*(.*)", text, re.IGNORECASE)
    alternative_match = re.search(r"Alternative:\s*(.*)", text, re.IGNORECASE)

    # 6️⃣ Build structured dictionary
    recommendation = {
        "recommended_line": line_match.group(1).strip() if line_match else None,
        "reason": reason_match.group(1).strip() if reason_match else None,
        "product_routine": routine_match.group(1).strip() if routine_match else None,
        "alternative": alternative_match.group(1).strip() if alternative_match else None
    }

    return recommendation
