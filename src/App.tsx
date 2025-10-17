import React, { useState, useEffect, useRef } from 'react'
import { FaVolumeOff, FaVolumeUp } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import ProgressBar from './components/ProgressBar'
import HairQuestionCard from './components/HairQuestionCard'
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
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const TOTAL_QUESTIONS = 7

  const questions = [
    "How long is your hair?",
    "How often do you wash your hair?",
    "Do you color your hair?",
    "What is your main hair concern?",
  ]

  const answers = [
    ["Short", "Medium ", "Long"],
    ["Daily", "2-3 times a week", "Weekly", "Less often"],
    ["Yes, regularly", "Yes, occasionally", "No"],
    ["Dryness", "Frizz", "Damage", "Oiliness"],
  ]

  const handleQuestionClick = (index: number) => {
    setCurrentQuestion(index)
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
            currentQuestion={currentQuestion + 1}
            totalQuestions={questions.length}
            onNext={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1)
              }
            }}
            onQuestionClick={handleQuestionClick}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default App
