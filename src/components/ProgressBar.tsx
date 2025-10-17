import React from "react";
import { motion } from "framer-motion";
import "./ProgressBar.css";

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  onQuestionClick?: (index: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuestion,
  totalQuestions,
  onQuestionClick,
}) => {
  return (
    <motion.div
      className="progress-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        <div className="progress-dots">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const isPast = index < currentQuestion;
            const isCurrent = index === currentQuestion;
            const isCompletedOrCurrent = index <= currentQuestion;
            return (
              <motion.div
                key={index}
                className={`progress-dot ${
                  isCompletedOrCurrent ? "completed" : ""
                } ${isCurrent ? "current" : ""} ${isPast ? "past" : ""}`}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompletedOrCurrent ? "#1B1B1B" : "#e9ecef",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1,
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                onClick={
                  isPast && onQuestionClick
                    ? () => onQuestionClick(index)
                    : undefined
                }
              >
                <motion.div
                  className="dot-inner"
                  animate={{
                    scale: isCurrent ? 1.2 : 1,
                    color: isCompletedOrCurrent ? "white" : "#6c757d",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isPast ? "✓" : index + 1}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <motion.div
        className="progress-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.span
          className="question-counter"
          key={currentQuestion}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          Question {currentQuestion + 1} of {totalQuestions}
        </motion.span>
        <motion.span
          className="progress-percentage"
          key={`${currentQuestion}-percent`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default ProgressBar;
