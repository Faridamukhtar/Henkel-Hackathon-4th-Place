import React, { useRef, useEffect, useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "./FaceCapture.css";

// Types
interface FaceCaptureProps {
  onCapture?: (imageData: string) => void;
  onSkip?: () => void;
  onNext?: () => void;
  capturedImage?: string | null;
}

type FacePositionStatus = "none" | "detected" | "positioned";

interface FaceBox {
  xMin: number;
  yMin: number;
  width: number;
  height: number;
}

interface Face {
  box: FaceBox;
  keypoints: Array<{ x: number; y: number }>;
}

// Constants
const CANVAS_DIMENSIONS = { width: 400, height: 300 }; // Smaller for right panel
const GUIDE_DIMENSIONS = { width: 140, height: 170 }; // Proportionally smaller guide
const FACE_SIZE_RATIO = { min: 0.05, max: 0.3 }; // Same ratios
const VIDEO_TIMEOUT = 5000;

const FaceCapture: React.FC<FaceCaptureProps> = ({
                                                   onCapture,
                                                   onSkip,
                                                   onNext,
                                                   capturedImage,
                                                 }) => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [facePositionStatus, setFacePositionStatus] =
      useState<FacePositionStatus>("none");
  const [hasCaptured, setHasCaptured] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Utility functions
  const checkFacePosition = useCallback((face: Face): boolean => {
    const { xMin, yMin, width, height } = face.box;
    const { width: canvasWidth, height: canvasHeight } = CANVAS_DIMENSIONS;
    const { width: guideWidth, height: guideHeight } = GUIDE_DIMENSIONS;

    // Guide area (center of the canvas)
    const guideCenterX = canvasWidth / 2;
    const guideCenterY = canvasHeight / 2;
    const guideLeft = guideCenterX - guideWidth / 2;
    const guideRight = guideCenterX + guideWidth / 2;
    const guideTop = guideCenterY - guideHeight / 2;
    const guideBottom = guideCenterY + guideHeight / 2;

    // Check if face is within the guide area
    const faceCenterX = xMin + width / 2;
    const faceCenterY = yMin + height / 2;

    const isWithinGuide =
        faceCenterX >= guideLeft &&
        faceCenterX <= guideRight &&
        faceCenterY >= guideTop &&
        faceCenterY <= guideBottom;

    // Check if face size is appropriate (must be smaller than or equal to guide)
    const faceSizeRatio = (width * height) / (canvasWidth * canvasHeight);
    const guideSizeRatio =
        (guideWidth * guideHeight) / (canvasWidth * canvasHeight);

    // Face must be smaller than or equal to the guide size
    const isNotTooBig = faceSizeRatio <= guideSizeRatio;
    const isNotTooSmall = faceSizeRatio >= FACE_SIZE_RATIO.min;

    return isWithinGuide && isNotTooBig && isNotTooSmall;
  }, []);

  const updateFacePositionStatus = useCallback(
      (faces: Face[]) => {
        if (faces.length === 0) {
          setFacePositionStatus("none");
        } else {
          const isProperlyPositioned = faces.some(checkFacePosition);
          setFacePositionStatus(isProperlyPositioned ? "positioned" : "detected");
        }
      },
      [checkFacePosition]
  );

  // Camera setup
  const setupCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: CANVAS_DIMENSIONS.width,
          height: CANVAS_DIMENSIONS.height,
          facingMode: "user",
        },
      });

      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;

      const handleVideoReady = () => {
        if (!videoRef.current) return;
        setIsVideoReady(true);
      };

      const handleVideoError = () => {
        setError("Camera error occurred. Please refresh and try again.");
        setIsLoading(false);
      };

      videoRef.current.onloadedmetadata = () => {
        if (!videoRef.current) return;
        videoRef.current
            .play()
            .then(() => setIsVideoReady(true))
            .catch(console.error);
        videoRef.current.width = CANVAS_DIMENSIONS.width;
        videoRef.current.height = CANVAS_DIMENSIONS.height;
      };

      videoRef.current.oncanplay = handleVideoReady;
      videoRef.current.onerror = handleVideoError;
    } catch (err) {
      console.error("Camera setup error:", err);
      setError(
          "Camera access denied. Please allow camera permissions and try again."
      );
      setIsLoading(false);
    }
  }, []);

  // Face detection setup
  const runFaceDetection = useCallback(async () => {
    let animationFrameId: number;

    try {
      await tf.setBackend("webgl");
      const model = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          {
            runtime: "tfjs",
            refineLandmarks: true,
          }
      );

      setIsLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const detect = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        if (
            videoRef.current.videoWidth === 0 ||
            videoRef.current.videoHeight === 0
        ) {
          animationFrameId = requestAnimationFrame(detect);
          return;
        }

        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        const faces = await model.estimateFaces(videoRef.current);
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        updateFacePositionStatus(faces);

        // Draw face detection visualization
        faces.forEach((face) => {
          const isProperlyPositioned = checkFacePosition(face);
          const color = isProperlyPositioned ? "#10b981" : "#f59e0b";
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;

          const { xMin, yMin, width, height } = face.box;
          ctx.strokeRect(xMin, yMin, width, height);

          ctx.fillStyle = color;
          face.keypoints.forEach((kp) => {
            ctx.beginPath();
            ctx.arc(kp.x, kp.y, 2, 0, 2 * Math.PI);
            ctx.fill();
          });
        });

        animationFrameId = requestAnimationFrame(detect);
      };

      detect();
    } catch (err) {
      setError(
          "Failed to load face detection model. Please refresh and try again."
      );
      setIsLoading(false);
    }
  }, [checkFacePosition, updateFacePositionStatus]);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    await setupCamera();
    await runFaceDetection();
  }, [setupCamera, runFaceDetection]);

  useEffect(() => {
    let videoTimeout: NodeJS.Timeout;

    const initialize = async () => {
      // If we already have a captured image to show, skip camera init
      if (capturedImage) {
        setIsLoading(false);
        setShowPreview(true);
        return;
      }
      await startCamera();
    };

    // Set timeout for video loading
    videoTimeout = setTimeout(() => {
      if (!isVideoReady) {
        console.log("Video loading timeout");
        setIsLoading(false);
      }
    }, VIDEO_TIMEOUT);

    initialize();

    return () => {
      if (videoTimeout) {
        clearTimeout(videoTimeout);
      }
    };
  }, [startCamera, isVideoReady, capturedImage]);

  // Event handlers
  const handleCapture = useCallback(() => {
    if (!videoRef.current || !onCapture) return;

    if (
        videoRef.current.videoWidth === 0 ||
        videoRef.current.videoHeight === 0
    ) {
      console.error("Video not ready for capture");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg", 0.8);

    onCapture(imageData);
    setHasCaptured(true);
    setShowPreview(true);
  }, [onCapture]);

  const handleRetry = useCallback(async () => {
    setError(null);
    setFacePositionStatus("none");
    setShowPreview(false);
    await startCamera();
  }, [startCamera]);

  // Status indicator component
  const StatusIndicator = () => {
    const statusConfig = {
      none: { icon: "!", text: "Face not detected", className: "not-detected" },
      detected: {
        icon: "⚠",
        text: "Face detected - fit within the guide",
        className: "detected-but-positioned",
      },
      positioned: {
        icon: "✓",
        text: "Face positioned correctly",
        className: "positioned",
      },
    };

    const config = statusConfig[facePositionStatus];

    return (
        <div className={`face-status ${facePositionStatus}`}>
          <div className={`status-indicator ${config.className}`}>
            <span className="status-icon">{config.icon}</span>
            <span className="status-text">{config.text}</span>
          </div>
        </div>
    );
  };

  // Error component
  if (error) {
    return (
        <div className="face-capture-container">
          <div className="error-message">
            <p>{error}</p>
            <div className="error-actions">
              <button className="retry-button" onClick={handleRetry}>
                Try Again
              </button>
              {onSkip && (
                  <button className="skip-button" onClick={onSkip}>
                    Skip
                  </button>
              )}
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="face-capture-container">
        {showPreview && capturedImage ? (
            <div className="camera-rectangle">
              <img
                  src={capturedImage}
                  alt="Captured face"
                  className="captured-image"
              />
            </div>
        ) : (
            <div className="camera-rectangle">
              <video
                  ref={videoRef}
                  className="face-capture-video"
                  width={CANVAS_DIMENSIONS.width}
                  height={CANVAS_DIMENSIONS.height}
                  autoPlay
                  muted
                  playsInline
              />
              <canvas ref={canvasRef} className="face-detection-canvas" />

              {!isLoading && !isVideoReady && (
                  <div className="video-fallback">Camera not available</div>
              )}

              <div className="face-avatar-guide">
                <div className="avatar-outline">
                  <div className="avatar-eyes">
                    <div className="eye left-eye"></div>
                    <div className="eye right-eye"></div>
                  </div>
                  <div className="avatar-nose"></div>
                  <div className="avatar-mouth"></div>
                  <div className="guide-lines">
                    <div className="guide-line top"></div>
                    <div className="guide-line bottom"></div>
                  </div>
                </div>
              </div>

              <StatusIndicator />
            </div>
        )}

        {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading camera and face detection...</p>
            </div>
        ) : (
            <div className="capture-controls">
              {showPreview && capturedImage ? (
                  <>
                    <button className="capture-button ready" onClick={handleRetry}>
                      Retry
                    </button>
                    {onNext && (
                        <button className="skip-button" onClick={onNext}>
                          Next
                        </button>
                    )}
                  </>
              ) : (
                  <>
                    {facePositionStatus === "positioned" ? (
                        <button
                            className="capture-button ready"
                            onClick={handleCapture}
                        >
                          📸 Capture Photo
                        </button>
                    ) : (
                        <div className="capture-button disabled">
                          📸{" "}
                          {facePositionStatus === "none"
                              ? "Face not detected"
                              : "Fit your face within the guide"}
                        </div>
                    )}
                    {onSkip && (
                        <button className="skip-button" onClick={onSkip}>
                          Skip this step
                        </button>
                    )}
                  </>
              )}
            </div>
        )}
      </div>
  );
};

export default FaceCapture;