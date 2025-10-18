import React from "react";
import ProgressBar from "./ProgressBar";
import FaceCapture from "./FaceCapture";
import "./HairQuestionCard.css";
import longHairIcon from "../../assets/LongHair.png";
import mediumHairIcon from "../../assets/MediumHair.png";
import shortHairIcon from "../../assets/ShortHair.png";

interface HairQuestionCardProps {
  question: string;
  answers: string[];
  subtitle?: string;
  currentQuestion: number;
  totalQuestions: number;
  capturedImage?: string | null;
  onNext?: () => void;
  onQuestionClick?: (index: number) => void;
  onMoreDetailsClick?: () => void;
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string) => void;
  showFaceCapture?: boolean;
  onFaceCapture?: (imageData: string) => void;
  onFaceCaptureFile?: (file: File) => void;
  onSkipFaceCapture?: () => void;
  isFaceCaptureStep?: boolean;
}

const HairQuestionCard: React.FC<HairQuestionCardProps> = ({
                                                             question,
                                                             answers,
                                                             subtitle,
                                                             currentQuestion,
                                                             totalQuestions,
                                                             capturedImage,
                                                             onNext,
                                                             onQuestionClick,
                                                             onMoreDetailsClick,
                                                             selectedAnswer,
                                                             setSelectedAnswer,
                                                             showFaceCapture = false,
                                                             onFaceCapture,
                                                             onFaceCaptureFile,
                                                             onSkipFaceCapture,
                                                             isFaceCaptureStep = false,
                                                           }) => {
  const handleSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer && onNext) {
      onNext();
    }
  };

  const handleQuestionClick = (index: number) => {
    if (onQuestionClick) {
      onQuestionClick(index);
    }
  };

  const getIconForAnswer = (answer: string) => {
    const iconMap: { [key: string]: string } = {
      Short: shortHairIcon,
      Medium: mediumHairIcon,
      Long: longHairIcon,
    };
    return iconMap[answer] || "";
  };

  const isImageIcon = (answer: string) => {
    return ["Short", "Medium", "Long"].includes(answer);
  };

  // If it's the face capture step, show FaceCapture component
  if (isFaceCaptureStep) {
    return (
        <div>
          {/* Question Card */}
          <div className="wshadow-sm border-2 border-stone-900 bg-white rounded-lg">
            <div className="p-8 space-y-6">
              {/* Question Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-stone-900">
                  {question}
                </h2>
                <p className="text-sm text-stone-600">{subtitle}</p>
              </div>

              {/* Face Capture Component */}
              <FaceCapture
                  onCapture={onFaceCapture || (() => {})}
                  onCaptureFile={onFaceCaptureFile}
                  onSkip={onSkipFaceCapture || (() => {})}
                  onNext={onSkipFaceCapture || (() => {})}
                  capturedImage={capturedImage}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar-section mt-12">
            <ProgressBar
                currentQuestion={currentQuestion}
                totalQuestions={totalQuestions}
                onQuestionClick={handleQuestionClick}
                showFaceCapture={showFaceCapture}
            />
          </div>
        </div>
    );
  }

  return (
      <div className="card-and-progress">
        {/* Question Card */}
        <div className="question-card shadow-sm border-2 border-stone-900 bg-white rounded-lg">
          <div className="p-8 space-y-6">
            {/* Question Header with More Details Link */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <h2 className="text-2xl font-bold text-stone-900">
                  {question}
                </h2>
                <p className="text-sm text-stone-600">
                  {subtitle || "Select one option that best describes you."}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-stone-200" />

            <div className="flex justify-center gap-4 answer-container">
              {answers.map((answer) => {
                const isSelected = selectedAnswer === answer;
                const hasSelection = selectedAnswer !== null;
                const isUnselected = hasSelection && !isSelected;

                return (
                    <button
                        key={answer}
                        onClick={() => handleSelect(answer)}
                        className={`answer-button flex flex-col items-center justify-center p-6 rounded-2xl transition-all ${
                            isSelected
                                ? "selected bg-white text-stone-900 border-stone-900 border-4"
                                : isUnselected
                                    ? "unselected bg-white text-stone-900 border-stone-400 border-2 hover:border-stone-600"
                                    : "bg-white text-stone-900 border-stone-400 border-2 hover:border-stone-600"
                        }`}
                    >
                      {isImageIcon(answer) && (
                          <div className="text-4xl mb-3">
                            <img
                                src={getIconForAnswer(answer)}
                                alt={answer}
                                className="w-12 h-12 object-contain"
                            />
                          </div>
                      )}
                      <span className="text-sm font-medium text-center">
                    {answer}
                  </span>
                    </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    selectedAnswer
                        ? "next-button-enabled"
                        : "next-button-disabled bg-stone-200 text-stone-400 cursor-not-allowed"
                }`}
            >
              Next
            </button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="progress-bar-section">
          <ProgressBar
              currentQuestion={currentQuestion}
              totalQuestions={totalQuestions}
              onQuestionClick={handleQuestionClick}
              showFaceCapture={showFaceCapture}
          />
        </div>
      </div>
  );
};

export default HairQuestionCard;