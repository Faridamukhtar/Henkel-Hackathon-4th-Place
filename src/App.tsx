import React, { useState, useEffect, useRef } from 'react'
import { FaVolumeOff, FaVolumeUp } from 'react-icons/fa'
import './App.css'

interface Video {
  src: string
}

function App() {
  const [currentQuizStep, setCurrentQuizStep] = useState<number>(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const videos: Video[] = [
    { src: '/assets/influencer1.MP4'  },
    { src: '/assets/influencer2.MP4' },
    { src: '/assets/influencer3.MP4'  },
    { src: '/assets/influencer4.MP4'  }
  ]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
    }

    video.addEventListener('ended', handleVideoEnd)
    
    return () => {
      video.removeEventListener('ended', handleVideoEnd)
    }
  }, [videos.length])

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
    <div className="App">
      <div className="split-container">
        {/* Left Side - Single Video Player */}
        <div className="video-section">
          <div className="video-container">
            <video 
              ref={videoRef}
              autoPlay 
              muted={isMuted}
              playsInline
              className="video-player"
              key={currentVideoIndex}
            >
              <source src={videos[currentVideoIndex].src} type="video/MP4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-overlay">
              <button 
                className="mute-button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? <FaVolumeOff /> : <FaVolumeUp />}
              </button>
            </div>
            <div className="video-indicators">
              {videos.map((_, index) => (
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
        <div className="quiz-section">
          <div className="quiz-container">
            <h2>Hair Type Assessment</h2>
            <p>Discover your perfect hair care routine</p>
            
           </div>
      </div>
    </div>
    </div> 
  )
}

export default App
