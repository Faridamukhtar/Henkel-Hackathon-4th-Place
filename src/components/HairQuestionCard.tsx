import React, { useState } from 'react'
import ProgressBar from './ProgressBar'
import './HairQuestionCard.css'

interface HairQuestionCardProps {
  question: string
  answers: string[]
  currentQuestion: number
  totalQuestions: number
  onNext?: () => void
  onQuestionClick?: (index: number) => void
  onMoreDetailsClick?: () => void
}

const HairQuestionCard: React.FC<HairQuestionCardProps> = ({
  question,
  answers,
  currentQuestion,
  totalQuestions,
  onNext,
  onQuestionClick,
  onMoreDetailsClick,
}) => {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (answer: string) => {
    setSelected(answer)
  }

  const handleNext = () => {
    if (selected && onNext) {
      setSelected(null)
      onNext()
    }
  }

  const handleQuestionClick = (index: number) => {
    if (onQuestionClick) {
      onQuestionClick(index)
      setSelected(null)
    }
  }

  const getIconForAnswer = (answer: string) => {
    const iconMap: { [key: string]: string } = {
      Short: "/assets/ShortHair.png",
      Medium: "/assets/MediumHair.png",
      Long: "/assets/LongHair.png",
      Straight: "👩‍🦰",
      Wavy: "👩‍🦱", 
      Curly: "👩‍🦱",
      Coily: "👩‍🦱",
    }
    return iconMap[answer] || ""
  }

  const isImageIcon = (answer: string) => {
    return ["Short", "Medium", "Long"].includes(answer)
  }

  return (
    <div className="space-y-8">
     

      {/* Question Card */}
      <div className="w-full shadow-sm border-2 border-stone-900 bg-white rounded-lg">
        <div className="p-8 space-y-6">
          {/* Question Header with More Details Link */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h2 className="text-2xl font-bold text-stone-900">
                {currentQuestion}/ {question}
              </h2>
              <p className="text-sm text-stone-600">
                {question.includes("texture") && "Texture will help us understand the underlying needs of your hair."}
                {question.includes("length") && "Hair length affects product recommendations and care routines."}
                {question.includes("wash") && "Washing frequency helps us suggest the right formulation."}
                {question.includes("color") && "Colored hair has different care needs."}
                {question.includes("concern") && "Understanding your main concern helps us find the perfect solution."}
              </p>
            </div>
            <button 
              onClick={onMoreDetailsClick}
              className="more-details-button"
            >
              <span className="button-text">More details</span>
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-200" />

          <div className="flex justify-center gap-4 answer-container">
            {answers.map((answer, index) => {
              const isSelected = selected === answer;
              const hasSelection = selected !== null;
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
                <span className="text-sm font-medium text-center">{answer}</span>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!selected}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              selected ? "next-button-enabled" : "next-button-disabled bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
       {/* Progress Bar */}
       <ProgressBar
        currentQuestion={currentQuestion - 1}
        totalQuestions={totalQuestions}
        onQuestionClick={handleQuestionClick}
      />
    </div>
  )
}

export default HairQuestionCard
