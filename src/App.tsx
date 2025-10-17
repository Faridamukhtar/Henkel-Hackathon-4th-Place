import React, { useState, useEffect, useRef } from 'react'
import { FaVolumeOff, FaVolumeUp } from 'react-icons/fa'
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
  const videoRef = useRef<HTMLVideoElement>(null)

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
    <div className="App">
      <div className="split-container">
        {/* Left Side - Single Video Player */}
        <div className="video-section" onClick={toggleMute}>
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
        <div className="quiz-section">
          <div className="quiz-header">
            <h2>For Every You</h2>
            <p>Every strand has a story — let's find the shampoo that gets yours.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
