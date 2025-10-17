from groq import Groq
import re

# Initialize Groq client
client = Groq(api_key="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")

GLISS_SYSTEM_PROMPT = """
You are a professional hair-care expert who specializes in Schwarzkopf Gliss products.
Your task is to recommend the most suitable Gliss shampoo line (and its matching conditioner and mask, if applicable) for a user based on their hair condition.

Available Gliss lines:

1. Aqua Revive — provides MOISTURE.
   • For normal to slightly dry hair needing light hydration.
   • Ideal for low-dryness, healthy hair that just needs moisture refresh.

2. Supreme Length — provides PROTECTION.
   • For long hair with possibly greasy roots and generally healthy lengths.
   • Also suitable for long hair that is somewhat damaged.
   • If hair is very damaged but long, recommend Supreme Length plus the Ultimate Repair Mask.
   • It doesn't have a mask product.

3. Ultimate Repair — provides STRENGTH.
   • For severely damaged, bleached, colored, or heat-treated hair.
   • Strongest repairing formula.

4. Total Repair — provides REGENERATION.
   • For moderately damaged or stressed hair that needs restoration but not heavy repair.
   • Second strongest after Ultimate Repair.

5. Oil Nutritive — provides NOURISHMENT.
   • For brittle, dull hair with visible split ends.
   • Adds shine and smoothness.

Each line has three products (Shampoo, Conditioner, Mask) except Supreme Length, which has no mask.

Instructions:
Given the user's hair profile, select the most suitable Gliss line.
Focus on the case where user has long damaged hair to mix the shampoo and mask lines.
Always provide a suggested routine with shampoo, conditioner, and mask (if available). Never leave it empty.
Do not use any formatting such as **, *, _, or markdown. Output plain text only.

Output in this structure:

Recommended line: <name>
Reason: <short explanation>
Product routine: <Shampoo + Conditioner + Mask (if available)>
Alternative: <optional second line + reason>
"""

def generate_final_prediction(hair_info, image_analysis):
    """
    Generate a structured Gliss recommendation using Groq LLM directly,
    considering both hair quiz info and image analysis.
    """
    # 1️⃣ Create the chat completion
    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": GLISS_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"My hair information is: {hair_info}.\n"
                    f"My hair image analysis is: {image_analysis}.\n"
                    "Based on both, which Gliss line should I use?"
                )
            }
        ],
        temperature=0.8,
        max_completion_tokens=512,
        top_p=1,
        stream=False,  # set True if you want streaming output
    )

    # 2️⃣ Extract the text response
    text = completion.choices[0].message.content.strip()

    # 3️⃣ Parse structured fields using regex
    line_match = re.search(r"Recommended line:\s*(.*)", text, re.IGNORECASE)
    reason_match = re.search(r"Reason:\s*(.*)", text, re.IGNORECASE)
    routine_match = re.search(r"Product routine:\s*(.*)", text, re.IGNORECASE)
    alternative_match = re.search(r"Alternative:\s*(.*)", text, re.IGNORECASE)

    recommendation = {
    "recommended_line": line_match.group(1).replace("**", "").strip() if line_match else None,
    "reason": reason_match.group(1).replace("**", "").strip() if reason_match else None,
    "product_routine": routine_match.group(1).replace("**", "").strip() if routine_match else None,
    "alternative": alternative_match.group(1).replace("**", "").strip() if alternative_match else None
}


    return recommendation
