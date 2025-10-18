import { useState, useEffect, useRef } from "react";
import { FaVolumeOff, FaVolumeUp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import HairQuestionCard from "./components/HairQuestionCard";
import LandingPage from "./components/LandingPage";
import ResultsDisplay from "./components/ResultsDisplay";
import "./App.css";
interface Video {
  src: string;
}

const VIDEOS: Video[] = [
  { src: "/assets/influencer1.MP4" },
  { src: "/assets/influencer2.MP4" },
  { src: "/assets/influencer3.MP4" },
  { src: "/assets/influencer4.MP4" },
];

function App() {
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0); // Start at 0, face capture is question 0
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedImageFile, setCapturedImageFile] = useState<File | null>(null);
  const [results, setResults] = useState<any>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [length, setLength] = useState<string | null>(null);
  const [greasiness, setGreasiness] = useState<string | null>(null);
  const [splitEnds, setSplitEnds] = useState<string | null>(null);
  const [dryness, setDryness] = useState<string | null>(null);
  const [shine, setShine] = useState<string | null>(null);
  const [colored, setColored] = useState<string | null>(null);
  const [heatStyling, setHeatStyling] = useState<string | null>(null);
  const questions = [
    "How long is your hair?",
    "After washing, how soon does your hair or scalp start to feel oily?",
    "When you look at your hair, do you usually notice split ends?",
    "How does your hair feel when you touch it — dry, soft, or somewhere in between",
    "How would you describe your hair’s shine in sunlight",
    "How often do you bleach/color your hair?",
    "How often do you use heat styling tools (like flat irons, curling wands, blow dryers)?",
  ];

  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
      Array(questions.length).fill(false)
  );

  const answers = [
    ["Short", "Medium", "Long"],
    ["Every day", "Every 2–3 days", "Once a week"],
    ["Yes", "No"],
    ["Very dry and rough", "Somewhat dry or frizzy", "Soft and balanced", "Smooth and moisturized"],
    ["Super shiny", "Slightly dull", "Mostly Dull", "I’m not sure"],
    ["Regularly", "Occasionally", "Rarely", "Never"],
    ["Regularly", "Occasionally", "Rarely", "Never"],
  ];

  const subtitles = [
    "Choose the length that best describes your hair.",
    "Oily buildup frequency helps us understand your scalp type and sebum balance.",
    "Split ends can indicate dryness and damage.",
    "Your hair’s texture tells us how well it retains moisture.",
    "Shine reflects the health and hydration of your hair.",
    "Frequent bleaching/coloring can lead to dryness and breakage.",
    "Excessive heat styling can damage hair cuticles.",
  ];

  const selectedAnswers = [
    length,
    greasiness,
    splitEnds,
    dryness,
    shine,
    colored,
    heatStyling,
  ];

  const setters = [
    setLength,
    setGreasiness,
    setSplitEnds,
    setDryness,
    setShine,
    setColored,
    setHeatStyling,
  ];


  const handleSubmit = async () => {
    setIsLoading(true);
    
    const hair_info: {
      length?: string;
      greasy_roots?: boolean;
      split_ends?: boolean;
      dryness?: "low" | "medium" | "high" | "severe";
      shine?: "very shiny" | "moderately shiny" | "dull" | "very dull";
      heat?: string;
      colored?: string;
    } = {};

    // Populate hair_info from your state
    if (length) hair_info.length = length;
    if (greasiness) hair_info.greasy_roots = greasiness === "Every day" || greasiness === "Every 2–3 days";
    if (splitEnds) hair_info.split_ends = splitEnds === "Yes";
    if (dryness) hair_info.dryness = dryness.toLowerCase() as "low" | "medium" | "high" | "severe";
    if (shine) hair_info.shine = shine.toLowerCase() as "very shiny" | "moderately shiny" | "dull" | "very dull";
    if (colored) hair_info.colored = colored;
    if (heatStyling) hair_info.heat = heatStyling;

    try {
      const formData = new FormData();

      // Append JSON data as a string
      formData.append("quiz_data_json", JSON.stringify(hair_info));

      // Append image only if it exists
      if (capturedImageFile) {
        console.log("I have an image file to send:", capturedImageFile);
        formData.append("file", capturedImageFile, capturedImageFile.name);
      }

      // Call your FastAPI endpoint
      const response = await fetch("http://localhost:8000/analyze_and_recommend", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      console.log("API result:", result);
      
      // Store the results and show the results component
      setResults(result);
      setShowResults(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error submitting hair info:", error);
      setIsLoading(false);
      // You might want to show an error message to the user here
    }
  };


  const handleQuestionClick = (index: number) => {
    const canJump = answeredQuestions.slice(1, index).every((ans) => ans);
    if (canJump) {
      setCurrentQuestion(index);
    }
  };

  const handleMoreDetailsClick = () => {
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
  };

  const handleFaceCapture = (imageData: string) => {
    // Store the captured image only; navigation handled by Next
    setCapturedImage(imageData);
  };

  const handleFaceCaptureFile = (file: File) => {
    setCapturedImageFile(file);
  };

  const handleSkipFaceCapture = () => {
    setCurrentQuestion(1); // Move to first hair question after skipping
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % VIDEOS.length);
    };

    video.addEventListener("ended", handleVideoEnd);
    return () => video.removeEventListener("ended", handleVideoEnd);
  }, []);

  // Handle video loading when video index changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
    video.play().catch(console.error);
  }, [currentVideoIndex]);

  // Handle video pause/play based on current question
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Pause video during face capture to reduce resource competition
    if (currentQuestion === 0) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  }, [currentQuestion]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleStartQuiz = () => {
    setShowLandingPage(false);
  };

  const getProductImage = (productLine: string) => {
    const imageMap: { [key: string]: string } = {
      "Aqua Revive": "/assets/aqua.jpg",
      "Supreme Length": "/assets/supreme length.jpg",
      "Oil Nutritive": "/assets/oil nutritive.jpg",
      "Ultimate Repair": "/assets/ultimate repare.jpg",
      "Total Repair": "/assets/Total Repair.jpg"
    };
    
    // Find matching product line (case insensitive)
    const normalizedLine = productLine.toLowerCase();
    for (const [key, value] of Object.entries(imageMap)) {
      if (normalizedLine.includes(key.toLowerCase())) {
        return value;
      }
    }
    
    // Default fallback
    return "/assets/Gliss Logo 1.png";
  };

  const getProductTheme = (productLine: string) => {
    const themeMap: { [key: string]: { primary: string; secondary: string; text: string } } = {
      "Aqua Revive": { primary: "#00A0C6", secondary: "#D2B273", text: "#FFFFFF" },
      "Oil Nutritive": { primary: "#F2B732", secondary: "#C4902F", text: "#FFFFFF" },
      "Supreme Length": { primary: "#EC2E87", secondary: "#D6B35A", text: "#FFFFFF" },
      "Total Repair": { primary: "#F7F7F7", secondary: "#C28A42", text: "#000000" },
      "Ultimate Repair": { primary: "#1B1B1B", secondary: "#B69254", text: "#FFFFFF" }
    };
    
    const normalizedLine = productLine.toLowerCase();
    for (const [key, value] of Object.entries(themeMap)) {
      if (normalizedLine.includes(key.toLowerCase())) {
        return value;
      }
    }
    
    // Default theme
    return { primary: "#667eea", secondary: "#764ba2", text: "#FFFFFF" };
  };

  const handleRestartQuiz = () => {
    // Reset all quiz state
    setCurrentQuestion(0);
    setCapturedImage(null);
    setCapturedImageFile(null);
    setLength(null);
    setGreasiness(null);
    setSplitEnds(null);
    setDryness(null);
    setShine(null);
    setColored(null);
    setHeatStyling(null);
    setAnsweredQuestions(Array(questions.length).fill(false));
    setResults(null);
    setShowResults(false);
    setIsLoading(false);
  };

  // Show landing page first
  if (showLandingPage) {
    return <LandingPage onStartQuiz={handleStartQuiz} />;
  }

  return (
    <motion.div
      className="App"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="split-container">
        {/* Left Side - Video Player or Product Image */}
        <div className="video-section">
          {showResults && results ? (
            <div 
              className="product-showcase-left"
              style={{
                background: `linear-gradient(135deg, ${getProductTheme(results.recommendation.recommended_line).primary} 0%, ${getProductTheme(results.recommendation.recommended_line).secondary} 100%)`
              }}
            >
              <div className="product-image-container-left">
                <img 
                  src={getProductImage(results.recommendation.recommended_line)} 
                  alt={results.recommendation.recommended_line}
                  className="product-image-left"
                />
              </div>
              <div className="product-info-left">
                <h3 
                  className="product-title-left"
                  style={{ color: getProductTheme(results.recommendation.recommended_line).text }}
                >
                  {results.recommendation.recommended_line}
                </h3>
                <p 
                  className="product-subtitle-left"
                  style={{ color: getProductTheme(results.recommendation.recommended_line).text }}
                >
                  Your Perfect Match
                </p>
              </div>
            </div>
          ) : (
            <div onClick={toggleMute}>
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
                      className={`indicator ${index === currentVideoIndex ? "active" : ""
                        }`}
                      onClick={() => {
                        setCurrentVideoIndex(index);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

          {/* Right Side - Quiz Area, Loading, or Results */}
          <motion.div
              className="quiz-section"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
          >
          {isLoading ? (
            <div className="loading-container">
              <div className="aqua-spinner">
                <img 
                  src="/assets/aqua.png" 
                  alt="Loading Shampoo"
                  className="spinning-bottle"
                />
              </div>
              <h2 className="loading-title">Analyzing Your Hair</h2>
              <p className="loading-subtitle">Finding your perfect match...</p>
            </div>
          ) : showResults && results ? (
            <ResultsDisplay 
              results={results} 
              onRestart={handleRestartQuiz}
              theme={getProductTheme(results.recommendation.recommended_line)}
            />
          ) : (
            <>
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
                    question={
                      currentQuestion === 0
                          ? "Let's start by capturing your hair"
                          : questions[currentQuestion - 1]
                    }
                    answers={currentQuestion === 0 ? [] : answers[currentQuestion - 1]}
                    subtitle={
                      currentQuestion === 0
                          ? "Please take a clear photo of your hair in its natural state — not styled, straightened, or freshly washed. Make sure your hair is visible from root to tip, with good lighting and minimal shadows."
                          : subtitles[currentQuestion - 1]
                    }
                    currentQuestion={currentQuestion} // Keep 0-based for internal logic
                    totalQuestions={questions.length + 1} // 7 questions + 1 face capture = 8 total steps
                    capturedImage={capturedImage}
                    showFaceCapture={true} // Enable face capture step in progress bar
                    onNext={() => {
                      // Mark current question as answered
                      const updated = [...answeredQuestions];
                      if (currentQuestion > 0) {
                        updated[currentQuestion - 1] = true;
                      }
                      setAnsweredQuestions(updated);

                      // Move to next question if it exists
                      if (currentQuestion < questions.length) {
                        setCurrentQuestion(currentQuestion + 1);
                      }
                      else {
                        handleSubmit();
                      }
                    }}
                    onQuestionClick={handleQuestionClick}
                    onMoreDetailsClick={handleMoreDetailsClick}
                    selectedAnswer={
                      currentQuestion === 0
                          ? null
                          : selectedAnswers[currentQuestion - 1]
                    }
                    setSelectedAnswer={
                      currentQuestion === 0 ? () => { } : setters[currentQuestion - 1]
                    }
                    onFaceCapture={handleFaceCapture}
                    onFaceCaptureFile={handleFaceCaptureFile}
                    onSkipFaceCapture={handleSkipFaceCapture}
                    isFaceCaptureStep={currentQuestion === 0}
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
                            <button className="close-button" onClick={handleCloseModal}>
                              ×
                            </button>
                          </div>
                          
                        </motion.div>
                      </motion.div>
                  )}
                </AnimatePresence>
              </>
          )}
        </motion.div>
        </div>
      </motion.div>
  );
}

export default App;