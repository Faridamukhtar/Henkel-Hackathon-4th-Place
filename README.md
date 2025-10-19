**4th Place Winner - Henkel Hackathon**

An intelligent hair care recommendation system combining AI-powered image analysis, interactive quizzes, and celebrity hair try-on features. Built for Schwarzkopf Gliss to provide personalized product recommendations.

## 🏆 Achievement

**4th Place - Henkel Hackathon**

This project secured 4th place among all competing teams, recognized for its innovative approach to personalized hair care through:
- Advanced AI integration (Gemini Vision + Groq LLM)
- Seamless user experience with real-time face detection
- Intelligent product matching using RAG technology
- Creative celebrity try-on feature
- Professional, brand-aligned design

## UI Showcase

### Landing Page
<img width="1117" height="678" alt="Screenshot 2025-10-19 at 3 29 00 PM" src="https://github.com/user-attachments/assets/07b35f1e-7e03-4036-8a9e-e78f9254f377" />

*Professional brand introduction with animated elements and clear call-to-action*

### Hair Capture & Analysis
<img width="686" height="466" alt="Screenshot 2025-10-19 at 3 13 33 PM" src="https://github.com/user-attachments/assets/2e06bf60-3078-43ea-85f8-a5470ce03999" />

*Real-time face detection with guided positioning feedback*

### Interactive Quiz
<img width="687" height="425" alt="Screenshot 2025-10-19 at 3 14 47 PM" src="https://github.com/user-attachments/assets/4c5d4f03-e980-4f26-b7c1-6779dd9894f5" />

*Adaptive 7-question assessment with visual answer options*

### Product Recommendations
<img width="683" height="427" alt="Screenshot 2025-10-19 at 3 14 59 PM" src="https://github.com/user-attachments/assets/93d2f09c-d8ac-4a68-9be9-e14dd4eda766" />

*Personalized Gliss product recommendations with detailed explanations*

### Celebrity Try-On
<img width="684" height="428" alt="Screenshot 2025-10-19 at 3 15 23 PM" src="https://github.com/user-attachments/assets/3ab29fe1-bb8a-4afa-9e30-6f934d0bfc83" />
<img width="691" height="467" alt="Screenshot 2025-10-19 at 3 15 36 PM" src="https://github.com/user-attachments/assets/4b43db92-ce7e-402e-83c4-bd93a716a8d7" />

*AI-powered hair swap with celebrity ambassador styles*

## Overview

This project creates a comprehensive digital hair care advisor that:
- Analyzes user hair conditions through image capture
- Conducts interactive hair care assessments
- Recommends personalized Gliss product lines
- Offers celebrity hairstyle try-on using AI hair swap technology
- Provides detailed product routines and care instructions

## Architecture

### Frontend (React + TypeScript + Vite)
- **Landing Page**: Professional brand introduction with animated elements
- **Face/Hair Capture**: Real-time camera integration with TensorFlow.js face detection
- **Interactive Quiz**: 7-question adaptive assessment covering hair length, texture, damage, and styling habits
- **Results Display**: Dynamic product recommendations with celebrity inspiration matching
- **Celebrity Try-On**: AI-powered hair swap feature using celebrity ambassadors

### Backend (FastAPI + Python)
- **Image Analysis**: Gemini AI vision model for hair condition assessment
- **Recommendation Engine**: Groq LLM-powered product matching using RAG (Retrieval Augmented Generation)
- **Knowledge Base**: Semantic search using sentence transformers for product information
- **Chatbot**: Context-aware conversational AI for hair care advice (ready for integration)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- API Keys:
  - Google Gemini API key
  - Groq API key
  - (Optional) Hair swap API access

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend/code
```

2. Install Python dependencies:
```bash
pip install -r ../requirements.txt
```

3. Configure API keys in the respective files:
   - `gemini_client.py` - Add your Gemini API key
   - `recommender.py` - Add your Groq API key

4. Start the FastAPI server:
```bash
uvicorn app:app --reload --port 8000
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── FaceCapture.tsx       # Camera & face detection component
│   │   ├── HairQuestionCard.tsx  # Quiz interface
│   │   ├── LandingPage.tsx       # Entry page
│   │   ├── ProgressBar.tsx       # Quiz progress tracker
│   │   └── ResultsDisplay.tsx    # Recommendations & celebrity try-on
│   ├── App.tsx                    # Main application orchestration
│   ├── App.css                    # Core styling
│   └── main.tsx                   # Application entry point
│
├── backend/
│   ├── code/
│   │   ├── app.py                # FastAPI main server
│   │   ├── gemini_client.py      # Gemini vision API integration
│   │   ├── recommender.py        # LLM-based product recommendation
│   │   ├── chatbot.py            # Conversational AI (future integration)
│   │   ├── retriever.py          # RAG knowledge base search
│   │   └── quiz.py               # Quiz logic (CLI version)
│   └── data/
│       ├── gliss_knowledge.txt          # Product recommendation knowledge
│       └── gliss_knowledge_chatbot.txt  # Detailed product information
│
└── assets/                        # Product images, videos, celebrity photos
```

## Features

### 1. Professional Landing Experience
- Clean, minimal design following Schwarzkopf brand guidelines
- Animated digital overlay effects
- Clear call-to-action for quiz initiation

### 2. AI-Powered Hair Analysis
- Real-time face detection using TensorFlow.js MediaPipe
- Guided face positioning with visual feedback
- Gemini AI vision analysis for hair condition assessment
- Evaluates: dryness, shine, frizz, split ends, visible damage

### 3. Adaptive Hair Quiz
- 7 contextual questions with conditional logic
- Visual answer options with icons
- Smart progress tracking with clickable navigation
- Questions cover:
  - Hair length
  - Scalp oiliness
  - Split ends presence
  - Hair texture & moisture
  - Shine levels
  - Chemical treatments
  - Heat styling frequency

### 4. Intelligent Recommendations
- RAG-powered product matching using semantic search
- Personalized Gliss product line selection:
  - **Aqua Revive** - Moisture for healthy hair
  - **Supreme Length** - Protection for long hair
  - **Oil Nutritive** - Nourishment for brittle, dull hair
  - **Total Repair** - Regeneration for moderate damage
  - **Ultimate Repair** - Strength for severe damage
- Complete routine suggestions (shampoo + conditioner + mask)
- Alternative product recommendations

### 5. Celebrity Hair Try-On
- Celebrity ambassador matching based on product line
- Real-time image upload and processing
- AI hair swap technology integration
- Featured celebrities:
  - Sofía Vergara (Total Repair)
  - Nadine Nassib Njeim (Ultimate Repair)
  - Ana Ivanović (Oil Nutritive)
  - Sophie Passmann (Aqua Revive)
  - Phoebe Coombes (Supreme Length)

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Framer Motion** for smooth animations
- **TensorFlow.js** + **Face Landmarks Detection** for camera features
- **React Icons** for UI elements
- **Modern CSS** with gradient designs and responsive layouts

### Backend
- **FastAPI** for high-performance API
- **Google Gemini AI** (gemini-2.5-flash) for vision analysis
- **Groq** (openai/gpt-oss-120b) for recommendation generation
- **Sentence Transformers** (all-MiniLM-L6-v2) for semantic search
- **PyTorch** for ML model operations
- **Pillow** for image processing

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `uvicorn app:app --reload` - Start development server
- `python -m pytest` - Run tests (if configured)

## API Endpoints

### POST `/analyze_and_recommend`
Analyzes hair and provides product recommendations.

**Request:**
- `file`: Image file (optional)
- `quiz_data_json`: JSON string with quiz answers

**Response:**
```json
{
  "user_id": "string",
  "image_analysis": "string",
  "quiz_data": {...},
  "recommendation": {
    "recommended_line": "string",
    "reason": "string",
    "product_routine": "string",
    "alternative": "string"
  }
}
```

## Design Philosophy

- **Brand Consistency**: Follows Schwarzkopf Gliss color schemes and typography
- **Accessibility**: High contrast, clear navigation, responsive design
- **User Experience**: Minimal friction, guided workflows, instant feedback
- **Performance**: Optimized images, lazy loading, efficient state management
- **Modern Aesthetics**: Gradient backgrounds, smooth animations, professional layouts

## Future Enhancements

- [ ] Chatbot integration for follow-up questions
- [ ] Product purchase integration
- [ ] Social sharing capabilities
- [ ] Multi-language support
- [ ] Hair routine tracking over time
- [ ] Push notifications for hair care reminders
- [ ] Integration with e-commerce platforms


## Acknowledgments

- **Henkel Hackathon** for the opportunity and 4th place recognition
- Schwarzkopf Gliss for product information and brand assets
- Google Gemini AI for vision capabilities
- Groq for LLM inference
- Celebrity ambassadors for inspiration features

---

**Built with ❤️ for Henkel Hackathon 2025**
