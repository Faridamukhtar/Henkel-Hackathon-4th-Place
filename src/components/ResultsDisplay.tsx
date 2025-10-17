import React from "react";
import "./ResultsDisplay.css";

interface Recommendation {
  recommended_line: string;
  reason: string;
  product_routine: string;
  alternative: string;
}

interface ResultsData {
  user_id: string;
  image_analysis: string;
  quiz_data: any;
  recommendation: Recommendation;
}

interface ResultsDisplayProps {
  results: ResultsData;
  onRestart?: () => void;
  theme?: { primary: string; secondary: string; text: string };
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onRestart, theme }) => {
  const { recommendation, image_analysis } = results;

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

  return (
    <div className="results-container">
      <div className="results-header">
        <h2 className="results-title">Your Personalized Hair Care Recommendation</h2>
        <p className="results-subtitle">
          Based on your hair analysis and preferences, here's what we recommend for you.
        </p>
      </div>

      <div className="results-content">
        {/* Main Recommendation */}
        <div 
          className="recommendation-card main-recommendation"
          style={{
            background: theme ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` : undefined
          }}
        >
          <div className="card-header">
            <h3 className="card-title" style={{ color: theme?.text }}>Recommended Product Line</h3>
            <div className="recommendation-badge">Best Match</div>
          </div>
          <div className="recommendation-content">
            <div className="product-showcase">
              <div className="product-image-container">
                <img 
                  src={getProductImage(recommendation.recommended_line)} 
                  alt={recommendation.recommended_line}
                  className="product-image"
                />
              </div>
              <div className="product-details">
                <h4 className="product-name" style={{ color: theme?.text }}>{recommendation.recommended_line}</h4>
                <p className="recommendation-reason" style={{ color: theme?.text }}>{recommendation.reason}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Routine */}
        <div className="recommendation-card">
          <div className="card-header">
            <h3 className="card-title">Recommended Routine</h3>
          </div>
          <div className="routine-content">
            <p className="routine-text">{recommendation.product_routine}</p>
          </div>
        </div>

        {/* Alternative Recommendation
        <div className="recommendation-card">
          <div className="card-header">
            <h3 className="card-title">Alternative Option</h3>
          </div>
          <div className="alternative-content">
            <p className="alternative-text">{recommendation.alternative}</p>
          </div>
        </div> */}

        {/* Image Analysis */}
        {image_analysis && (
          <div className="recommendation-card">
            <div className="card-header">
              <h3 className="card-title">Image Analysis</h3>
            </div>
            <div className="analysis-content">
              <p className="analysis-text">{image_analysis}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="results-actions">
          <button className="restart-button" onClick={onRestart}>
            Take Quiz Again
          </button>

        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
