import React, { useEffect, useState } from "react";

import sofia from "../../assets/celebrities/1.webp";
import nadine from "../../assets/celebrities/2.jpg";
import ana from "../../assets/celebrities/3.webp";
import sophie from "../../assets/celebrities/4.jpg";
import phoebe from "../../assets/celebrities/5.jpg";
import aquaImage from "../../assets/aqua.jpg";
import supremeLengthImage from "../../assets/supreme length.jpg";
import oilNutritiveImage from "../../assets/oil nutritive.jpg";
import ultimateRepairImage from "../../assets/ultimate repare.jpg";
import totalRepairImage from "../../assets/Total Repair.jpg";
import glissLogo from "../../assets/Gliss Logo 1.png";

interface Celebrity {
  name: string;
  product_line: string;
  association_level: string;
  reference: string;
  image_path: any;
}

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

const celebrityData: { celebrities: Celebrity[] } = {
  celebrities: [
    {
      name: "Sofía Vergara",
      product_line: "Total Repair",
      association_level: "verified",
      reference: "Official Schwarzkopf Gliss campaign ambassador",
      image_path: sofia,
    },
    {
      name: "Nadine Nassib Njeim",
      product_line: "Ultimate Repair",
      association_level: "verified",
      reference: "Regional face of Gliss in MENA",
      image_path: nadine,
    },
    {
      name: "Ana Ivanović",
      product_line: "Oil Nutritive",
      association_level: "semi-verified",
      reference: "Gliss campaign / social ambassador",
      image_path: ana,
    },
    {
      name: "Sophie Passmann",
      product_line: "Aqua Revive",
      association_level: "semi-verified",
      reference: "Featured in Gliss Shine Booster reel",
      image_path: sophie,
    },
    {
      name: "Phoebe Coombes",
      product_line: "Supreme Length",
      association_level: "semi-verified",
      reference: "Featured in Gliss Supreme Length campaign",
      image_path: phoebe,
    },
  ],
};

interface ResultsDisplayProps {
  results: ResultsData;
  onRestart?: () => void;
  theme?: { primary: string; secondary: string; text: string };
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onRestart, theme }) => {
  const { recommendation, image_analysis } = results;
  const getProductImage = (productLine: string) => {
  const imageMap: { [key: string]: string } = {
    "Aqua Revive": aquaImage,
    "Supreme Length": supremeLengthImage,
    "Oil Nutritive": oilNutritiveImage,
    "Ultimate Repair": ultimateRepairImage,
    "Total Repair": totalRepairImage,
    "Full Hair Wonder": glissLogo,
  };
  
  const normalizedLine = productLine.toLowerCase();
  for (const [key, value] of Object.entries(imageMap)) {
    if (normalizedLine.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return glissLogo;
};
  
  const API_URL = "https://melvina-heelless-yang.ngrok-free.dev";

  const [showResults, setShowResults] = useState<boolean>(true);
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [userImageUrlLocal, setUserImageUrlLocal] = useState<string | null>(null);
  const [celebrityImageURL, setCelebrityImageURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [matchedCelebrities, setMatchedCelebrities] = useState<Celebrity[]>([]);

  useEffect(() => {
    if (recommendation?.recommended_line) {
      const recommendedLine = recommendation.recommended_line;
      
      const filtered = celebrityData.celebrities.filter(
        (cel) =>
          cel.product_line.toLowerCase().includes(recommendedLine.toLowerCase()) ||
          recommendedLine.toLowerCase().includes(cel.product_line.toLowerCase())
      );

      console.log("Filtered Celebrities:", filtered);
      
      setMatchedCelebrities(filtered);
    }
  }, [recommendation]);

  useEffect(() => {
    handleCelebrityReveal(selectedCelebrity?.image_path || "");
  }, [selectedCelebrity]);

  const handleUserImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUserImage(file);
    const preview = URL.createObjectURL(file);
    setUserImageUrlLocal(preview);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_URL}/api/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const result = await response.json();
      setUserImageUrl(result.url);
    } catch (err: any) {
      console.error(err);
      setError("Failed to upload image");
    }
  };

  const handleCelebrityReveal = async (file_path: any) => {
    if (!file_path) return;

    try {
      const response = await fetch(file_path);
      const blob = await response.blob();
      const file = new File([blob], "celebrity.jpg", { type: blob.type });

      const formData = new FormData();
      formData.append("image", file);

      const uploadResponse = await fetch(`${API_URL}/api/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Upload failed");

      const result = await uploadResponse.json();
      setCelebrityImageURL(result.url);
    } catch (err: any) {
      console.error(err);
      setError("Failed to upload celebrity image");
    }
  };

  const handleTryCelebrityHair = async () => {
    if (!selectedCelebrity || !userImageUrl) {
      setError("Please select a celebrity and upload your photo");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/swap-hair-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          face_url: userImageUrl,
          shape_url: celebrityImageURL,
          color_url: userImageUrl,
          poisson_iters: 0,
          poisson_erosion: 15,
        }),
      });

      if (!response.ok) throw new Error("Failed to process images");
      const result = await response.json();
      setResultUrl(result.result_url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showResults) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '2rem',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          animation: 'slideInUp 0.6s ease-out',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <style>{`
            @keyframes slideInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes fadeInScale {
              from {
                opacity: 0;
                transform: scale(0.8);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '0.5rem',
              lineHeight: '1.2'
            }}>
              Your Personalized Recommendation
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#6c757d',
              lineHeight: '1.5',
              margin: '0'
            }}>
              Based on your hair analysis and preferences
            </p>
          </div>

          {/* Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            paddingBottom: '1rem'
          }}>
            {/* Main Recommendation */}
            <div style={{
              background: theme ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` : undefined,
              color: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'white',
                  margin: '0'
                }}>
                  Recommended Product
                </h3>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)'
                }}>
                  Best Match
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginTop: '1rem',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  flexShrink: 0,
                  width: '120px',
                  height: '120px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <img 
                    src={getProductImage(recommendation.recommended_line)} 
                    alt={recommendation.recommended_line}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      animation: 'fadeInScale 0.6s ease-out'
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'white',
                    margin: '0 0 0.75rem 0',
                    lineHeight: '1.3'
                  }}>
                    {recommendation.recommended_line}
                  </h4>
                  <p style={{
                    fontSize: '1rem',
                    color: 'white',
                    lineHeight: '1.6',
                    margin: '0'
                  }}>
                    {recommendation.reason}
                  </p>
                </div>
              </div>
            </div>

            {/* Routine Card */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e9ecef',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#2c3e50',
                margin: '0 0 0.5rem 0'
              }}>
                Recommended Routine
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#495057',
                lineHeight: '1.6',
                margin: '0'
              }}>
                {recommendation.product_routine}
              </p>
            </div>

            {/* Image Analysis */}
            {image_analysis && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e9ecef',
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#2c3e50',
                  margin: '0 0 0.5rem 0'
                }}>
                  Image Analysis
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#495057',
                  lineHeight: '1.6',
                  margin: '0'
                }}>
                  {image_analysis}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setShowResults(false)}
              style={{
                padding: '0.875rem 2rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '140px',
                background: '#000000',
                color: 'white',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
              }}
            >
              Try Celebrity Looks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <button
            onClick={() => setShowResults(true)}
            style={{
              marginBottom: '1.5rem',
              background: 'none',
              border: 'none',
              color: '#2c3e50',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← Back to Recommendation
          </button>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '0.5rem'
          }}>
            Celebrity Hair Try-On
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#6c757d',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Transform your look with styles from ambassadors using {recommendation?.recommended_line}
          </p>
        </div>

        {/* Celebrity Selection */}
        {!selectedCelebrity && matchedCelebrities.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Choose Your Celebrity Inspiration
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {matchedCelebrities.map((celebrity) => (
                <div
                  key={celebrity.name}
                  onClick={() => setSelectedCelebrity(celebrity)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e9ecef'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div style={{
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img
                      src={celebrity.image_path}
                      alt={celebrity.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)'
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      right: '1rem',
                      color: 'white'
                    }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        margin: '0 0 0.25rem 0'
                      }}>
                        {celebrity.name}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        margin: '0',
                        opacity: 0.9
                      }}>
                        {celebrity.reference}
                      </p>
                    </div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontWeight: '600',
                      background: celebrity.association_level === "verified" ? '#d4edda' : '#cce5ff',
                      color: celebrity.association_level === "verified" ? '#155724' : '#004085'
                    }}>
                      {celebrity.association_level === "verified" ? "✓ Verified" : "Featured"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Try On Section */}
        {selectedCelebrity && (
          <div style={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#2c3e50',
                margin: '0'
              }}>
                Try {selectedCelebrity.name}'s Hair
              </h2>
              <button
                onClick={() => {
                  setSelectedCelebrity(null);
                  setUserImageUrlLocal(null);
                  setResultUrl(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2c3e50',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                ← Choose Different Celebrity
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2c3e50',
                  marginBottom: '0.75rem'
                }}>
                  Upload Your Photo
                </label>
                <div
                  onClick={() => document.getElementById("user-upload")?.click()}
                  style={{
                    border: '2px dashed #dee2e6',
                    borderRadius: '16px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#6c757d';
                    e.currentTarget.style.background = '#f8f9fa';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#dee2e6';
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  {userImageUrlLocal ? (
                    <img
                      src={userImageUrlLocal}
                      alt="Your photo"
                      style={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover',
                        borderRadius: '12px'
                      }}
                    />
                  ) : (
                    <div>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                      <p style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#2c3e50',
                        margin: '0 0 0.5rem 0'
                      }}>
                        Click to upload your photo
                      </p>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6c757d',
                        margin: '0'
                      }}>
                        For best results, use a clear face photo
                      </p>
                    </div>
                  )}
                  <input
                    id="user-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleUserImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2c3e50',
                  marginBottom: '0.75rem'
                }}>
                  Celebrity Hairstyle
                </label>
                <div style={{
                  border: '2px solid #dee2e6',
                  borderRadius: '16px',
                  padding: '1rem',
                  background: 'white'
                }}>
                  <img
                    src={selectedCelebrity.image_path}
                    alt={selectedCelebrity.name}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginBottom: '1rem'
                    }}
                  />
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#2c3e50',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {selectedCelebrity.name}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6c757d',
                    margin: '0'
                  }}>
                    {selectedCelebrity.product_line}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleTryCelebrityHair}
              disabled={!userImageUrl || loading}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '600',
                border: 'none',
                cursor: !userImageUrl || loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                background: !userImageUrl || loading ? '#dee2e6' : '#000000',
                color: !userImageUrl || loading ? '#6c757d' : 'white',
                boxShadow: !userImageUrl || loading ? 'none' : '0 4px 15px rgba(0, 0, 0, 0.3)'
              }}
              onMouseOver={(e) => {
                if (!loading && userImageUrl) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading && userImageUrl) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                }
              }}
            >
              {loading ? "Processing..." : "Try This Hairstyle"}
            </button>

            {error && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '12px',
                color: '#721c24',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            {resultUrl && (
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#2c3e50',
                  marginBottom: '1rem'
                }}>
                  Your New Look!
                </h3>
                <img
                  src={resultUrl}
                  alt="Result"
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    margin: '0 auto',
                    display: 'block'
                  }}
                />
                <p style={{
                  marginTop: '1rem',
                  fontSize: '0.875rem',
                  color: '#6c757d'
                }}>
                  Love it? Right-click to save your new hairstyle!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsDisplay;