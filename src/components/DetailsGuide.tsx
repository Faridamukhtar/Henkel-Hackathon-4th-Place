import React from 'react'
import './DetailsGuide.css'

interface DetailsGuideProps {
  currentQuestion: number
  question: string
}

const DetailsGuide: React.FC<DetailsGuideProps> = ({ currentQuestion, question }) => {
  // Detailed information for each question type
  const questionDetails = {
    0: { // Hair length
      title: "Hair Length Guide",
      description: "Understanding your hair length helps us recommend the right products and care routine.",
      
    }
  }

  const details = questionDetails[currentQuestion] || questionDetails[0]

  return (
    <>
    </>
  )
}

export default DetailsGuide
