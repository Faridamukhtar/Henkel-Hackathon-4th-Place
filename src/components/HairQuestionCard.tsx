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
}

const HairQuestionCard: React.FC<HairQuestionCardProps> = ({
  question,
  answers,
  currentQuestion,
  totalQuestions,
  onNext,
  onQuestionClick,
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
      Straight: "👩‍🦰",
      Wavy: "👩‍🦱", 
      Curly: "👩‍🦱",
      Coily: "👩‍🦱",
    }
    return iconMap[answer] || "✨"
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
            <a href="#" className="text-sm font-medium text-stone-900 underline whitespace-nowrap hover:text-stone-700">
              More details
            </a>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-200" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {answers.map((answer) => (
              <button
                key={answer}
                onClick={() => handleSelect(answer)}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                  selected === answer
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-900 border-stone-300 hover:border-stone-900"
                }`}
              >
                <div className="text-4xl mb-3">{getIconForAnswer(answer)}</div>
                <span className="text-sm font-medium text-center">{answer}</span>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!selected}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              selected ? "bg-stone-900 text-white hover:bg-stone-800" : "bg-stone-200 text-stone-400 cursor-not-allowed"
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
