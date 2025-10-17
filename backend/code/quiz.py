# hair_quiz.py

def ask_question(question, options):
    """Ask a multiple-choice question interactively."""
    print(f"\n{question}")
    for i, opt in enumerate(options, start=1):
        print(f"{i}. {opt.capitalize()}")
    while True:
        try:
            choice = int(input("Enter the number that best describes you: "))
            if 1 <= choice <= len(options):
                return options[choice - 1]
            else:
                print("Please choose a valid option number.")
        except ValueError:
            print("Please enter a valid number.")


def run_quiz():
    """Run the adaptive Gliss hair quiz and return structured hair info."""
    hair_info = {}

    print("🌸 Welcome to your Gliss Hair Quiz! Let's find your perfect haircare match. 🌸")

    # 1️⃣ Hair length
    hair_info["length"] = ask_question(
        "First things first — how long is your hair?",
        ["short", "medium", "long"]
    )

    # 2️⃣ Greasy roots (only for longer hair)
    if hair_info["length"] in ["medium", "long"]:
        hair_info["greasy_roots"] = (
            ask_question(
                "Do you often feel like your roots get oily or greasy between washes?",
                ["yes", "no"]
            ) == "yes"
        )
    else:
        hair_info["greasy_roots"] = False

    # 3️⃣ Split ends
    hair_info["split_ends"] = (
        ask_question(
            "When you look at your hair ends, do you notice dryness or split ends?",
            ["yes", "no"]
        ) == "yes"
    )

    # 4️⃣ Hair dryness
    dryness = ask_question(
        "How would you describe your hair’s overall moisture level?",
        [
            "low – it feels smooth and hydrated most of the time",
            "medium – it can get a bit dry sometimes",
            "high – it feels dry often, especially at the ends",
            "severe – it’s rough, frizzy, or extremely dry"
        ]
    )
    dryness_map = {
        "low – it feels smooth and hydrated most of the time": "low",
        "medium – it can get a bit dry sometimes": "medium",
        "high – it feels dry often, especially at the ends": "high",
        "severe – it’s rough, frizzy, or extremely dry": "severe"
    }
    hair_info["dryness"] = dryness_map[dryness]

    # 5️⃣ Shine
    shine = ask_question(
        "How shiny does your hair usually look under light?",
        [
            "very shiny – it reflects light easily and looks glossy",
            "moderately shiny – it looks healthy but not too glossy",
            "dull – it looks matte and lacks shine",
            "very dull – it looks lifeless or flat even after washing"
        ]
    )
    shine_map = {
        "very shiny – it reflects light easily and looks glossy": "very shiny",
        "moderately shiny – it looks healthy but not too glossy": "moderately shiny",
        "dull – it looks matte and lacks shine": "dull",
        "very dull – it looks lifeless or flat even after washing": "very dull"
    }
    hair_info["shine"] = shine_map[shine]

    # 6️⃣ Damage
    if hair_info["dryness"] in ["high", "severe"]:
        hair_info["damage"] = ask_question(
            "Has your hair been damaged from coloring, bleaching, or heat styling?",
            ["none", "slight", "moderate", "severe"]
        )
    else:
        hair_info["damage"] = ask_question(
            "Would you say your hair is completely healthy or slightly stressed?",
            ["none", "slight", "moderate"]
        )

    # 7️⃣ Chemical or heat styling habits
    hair_info["colored_or_heat"] = (
        ask_question(
            "Do you regularly color, bleach, or use hot tools (like straighteners or curlers)?",
            ["yes", "no"]
        ) == "yes"
    )

    print("\n🧾 Your hair profile has been recorded successfully!")
    return hair_info