import { useState, useEffect, useRef } from 'react'
import { FaVolumeOff, FaVolumeUp } from 'react-icons/fa'
import {AnimatePresence, motion} from 'framer-motion'
import HairQuestionCard from './components/HairQuestionCard'
import DetailsGuide from './components/DetailsGuide'
import './App.css'

interface Video {
  src: string
}

const VIDEOS: Video[] = [
  { src: '/assets/influencer1.MP4' },
  { src: '/assets/influencer2.MP4' },
  { src: '/assets/influencer3.MP4' },
  { src: '/assets/influencer4.MP4' }
]

function App() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [length, setLength] = useState<string | null>(null)
  const [greasiness, setGreasiness] = useState<string | null>(null)
  const [splitEnds, setSplitEnds] = useState<string | null>(null)
  const [dryness, setDryness] = useState<string | null>(null)
  const [shine, setShine] = useState<string | null>(null)
  const [colored, setColored] = useState<string | null>(null)
  const [heatStyling, setHeatStyling] = useState<string | null>(null)
  const questions = [
    "How long is your hair?",
    "How soon after washing does your hair or scalp start to feel oily?",
    "When you look at your hair, do you usually notice split ends?",
    "How would you describe your hair's overall moisture?",
    "How would you describe your hair’s shine in sunlight",
    "How often do you bleach/color your hair?",
    "How often do you use heat styling tools (like flat irons, curling wands, blow dryers)?",
  ]

  const answers = [
    ["Short", "Medium", "Long"],
    ["Every day", "Every 2–3 days", "Once a week"],
    ["Yes","No"],
    ["Very dry", "somewhat dry", "Balanced", "Moisturized"],
    ["Super shiny, almost reflective", "A little dull", "dull", "I’m not sure"],
    ["regularly", "occasionally", "rarely", "never"],
    ["regularly", "occasionally", "rarely", "never"],
  ]

  const subtitles = [
    "Choose the length that best describes your hair.",
    "Oily buildup frequency helps us understand your scalp type and sebum balance.",
    "Split ends can indicate dryness and damage.",
    "Moisture levels affect hair's elasticity and shine.",
    "Shine reflects the health and hydration of your hair.",
    "Frequent bleaching/coloring can lead to dryness and breakage.",
    "Excessive heat styling can damage hair cuticles.",
  ]

  const selectedAnswers = [
    length,
    greasiness,
    splitEnds,
    dryness,
    shine,
    colored,
    heatStyling
  ]

  const setters = [
    setLength,
    setGreasiness,
    setSplitEnds,
    setDryness,
    setShine,
    setColored,
    setHeatStyling
  ]

  const handleSubmit = () => {
    const hair_info: {
      length?: string;
      greasy_roots?: boolean;
      split_ends?: boolean;
      dryness?: "low" | "medium" | "high" | "severe";
      shine?: "very shiny" | "moderately shiny" | "dull" | "very dull";
      heat?: string;
      colored?: string;
    } = {};

    // Q1: Hair Length
    if (length != null)
      hair_info.length = length.toLowerCase();

    // Q2: Oiliness frequency → greasy_roots
    hair_info.greasy_roots = greasiness === "Every day" || greasiness === "Every 2–3 days";

    // Q3: Split ends
    hair_info.split_ends = splitEnds === "Yes";

    // Q4: Dryness mapping
    switch (dryness) {
      case "Very dry":
        hair_info.dryness = "severe";
        break;
      case "somewhat dry":
        hair_info.dryness = "high";
        break;
      case "Balanced":
        hair_info.dryness = "medium";
        break;
      case "Moisturized":
        hair_info.dryness = "low";
        break;
    }

    // Q5: Shine mapping
    switch (shine) {
      case "Super shiny, almost reflective":
        hair_info.shine = "very shiny";
        break;
      case "A little dull":
        hair_info.shine = "moderately shiny";
        break;
      case "dull":
        hair_info.shine = "dull";
        break;
      case "I’m not sure":
        hair_info.shine = "moderately shiny";
        break;
    }

    // Q6: Bleach/Color frequency
    if (colored != null)
      hair_info.colored = colored

    // Q7: Heat styling frequency → damage
    if (heatStyling != null)
      hair_info.heat = heatStyling

    return hair_info;
  };



  const handleQuestionClick = (index: number) => {
    setCurrentQuestion(index)
  }

  const handleMoreDetailsClick = () => {
    setIsDetailsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % VIDEOS.length)
    }

    video.addEventListener('ended', handleVideoEnd)
    return () => video.removeEventListener('ended', handleVideoEnd)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.load()
    video.play().catch(console.error)
  }, [currentVideoIndex])

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  return (
    <motion.div 
      className="App"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="split-container">
        {/* Left Side - Single Video Player */}
        <div 
          className="video-section" 
          onClick={toggleMute}
        >
          <div className="video-container">
            <video 
              ref={videoRef}
              autoPlay 
              muted={isMuted}
              playsInline
              className="video-player"
              key={currentVideoIndex}
            >
              <source src={VIDEOS[currentVideoIndex].src} type="video/MP4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-overlay">
              <div className="mute-indicator">
                {isMuted ? <FaVolumeOff /> : <FaVolumeUp />}
              </div>
            </div>
            <div className="video-indicators">
              {VIDEOS.map((_, index) => (
                <div 
                  key={index}
                  className={`indicator ${index === currentVideoIndex ? 'active' : ''}`}
                  onClick={() => setCurrentVideoIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Quiz Area */}
        <motion.div 
          className="quiz-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            className="quiz-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              For Every You
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Every strand has a story — let's find the shampoo that gets yours.
            </motion.p>
          </motion.div>
          
          {/* Hair Question Card */}
          <HairQuestionCard
            question={questions[currentQuestion]}
            answers={answers[currentQuestion]}
            subtitle={subtitles[currentQuestion]}
            currentQuestion={currentQuestion + 1}
            totalQuestions={questions.length}
            onNext={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1)
              }
            }}
            onQuestionClick={handleQuestionClick}
            onMoreDetailsClick={handleMoreDetailsClick}
            selectedAnswer={selectedAnswers[currentQuestion]}
            setSelectedAnswer={setters[currentQuestion]}
          />
          
          {/* Details Modal */}
          <AnimatePresence>
            {isDetailsModalOpen && (
              <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleCloseModal}
              >
                <motion.div
                  className="modal-content"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-header">
                    <h3>Question Details</h3>
                    <button 
                      className="close-button"
                      onClick={handleCloseModal}
                    >
                      ×
                    </button>
                  </div>
                  <DetailsGuide
                    currentQuestion={currentQuestion}
                    question={questions[currentQuestion]}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default App
