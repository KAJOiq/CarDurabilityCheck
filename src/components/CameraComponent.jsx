import React, { useRef, useEffect, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import getCroppedImg from "../utils/cropImage";

const CameraComponent = ({ setPhoto }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const cropperRef = useRef(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [focusDistance, setFocusDistance] = useState(100); // Default to 100% focus
  const [focusSupported, setFocusSupported] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [brightnessSupported, setBrightnessSupported] = useState(false);
  const [focusRange, setFocusRange] = useState({ min: 0, max: 100 }); // Default range
  const [manualFocusEnabled, setManualFocusEnabled] = useState(false);
  const [manualBrightnessEnabled, setManualBrightnessEnabled] = useState(false);

  // Start the camera to display the live feed
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        // Check if focus is supported
        if (capabilities.focusDistance) {
          setFocusSupported(true);
          setFocusRange({ min: capabilities.focusDistance.min, max: capabilities.focusDistance.max });
          // Set initial focus to auto
          track
            .applyConstraints({
              advanced: [{ focusMode: "continuous" }],
            })
            .then(() => {
              console.log("Auto-focus enabled");
            })
            .catch((error) => {
              console.error("Error enabling auto-focus:", error);
            });
        }

        // Check if brightness is supported
        if (capabilities.brightness) {
          setBrightnessSupported(true);
          // Set initial brightness to the middle of the supported range
          const initialBrightness = (capabilities.brightness.min + capabilities.brightness.max) / 2;
          setBrightness(initialBrightness);
          track
            .applyConstraints({
              advanced: [{ brightness: initialBrightness }],
            })
            .then(() => {
              console.log("Brightness constraints applied:", initialBrightness);
            })
            .catch((error) => {
              console.error("Error applying brightness constraints:", error);
            });
        }
      }
      setCameraEnabled(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraEnabled(false);
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  // Adjust camera focus
  const adjustFocus = (percentage) => {
    const stream = mediaStreamRef.current;
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      const focusValue =
        capabilities.focusDistance.min +
        (capabilities.focusDistance.max - capabilities.focusDistance.min) * (percentage / 100);
      if (focusValue < capabilities.focusDistance.min || focusValue > capabilities.focusDistance.max) {
        console.error(
          `Focus distance value ${focusValue} is out of range (${capabilities.focusDistance.min} - ${capabilities.focusDistance.max})`
        );
        return;
      }
      track
        .applyConstraints({
          advanced: [{ focusMode: "manual", focusDistance: focusValue }],
        })
        .then(() => {
          console.log("Focus constraints applied:", focusValue);
        })
        .catch((error) => {
          console.error("Error applying focus constraints:", error);
        });
      setFocusDistance(percentage);
    }
  };

  // Adjust camera brightness
  const adjustBrightness = (value) => {
    const stream = mediaStreamRef.current;
    if (stream) {
      const track = stream.getVideoTracks()[0];
      track
        .applyConstraints({
          advanced: [{ brightness: value }],
        })
        .then(() => {
          console.log("Brightness constraints applied:", value);
        })
        .catch((error) => {
          console.error("Error applying brightness constraints:", error);
        });
      setBrightness(value);
    }
  };

  // Capture image and save it to localStorage
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      const width = 320;
      const height = 240;
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const imageUrl = canvas.toDataURL("image/png");
      setImageSrc(imageUrl);
      setIsEditing(true);

      // Save the full image to localStorage
      const savedImages = JSON.parse(localStorage.getItem("fullImages")) || [];
      savedImages.push(imageUrl);
      localStorage.setItem("fullImages", JSON.stringify(savedImages));

      console.log("Image saved to localStorage");
    }
  };

  // Save the cropped photo
  const saveCroppedPhoto = async () => {
    const cropper = cropperRef.current.cropper;
    const croppedImage = await getCroppedImg(imageSrc, cropper);
    setPhoto(croppedImage);
    setIsEditing(false);

    // Save cropped image to localStorage
    const savedCroppedImages = JSON.parse(localStorage.getItem("croppedImages")) || [];
    savedCroppedImages.push(croppedImage);
    localStorage.setItem("croppedImages", JSON.stringify(savedCroppedImages));

    console.log("Cropped image saved to localStorage");
  };

  useEffect(() => {
    const handleDeviceChange = async () => {
      try {
        stopCamera();
        await startCamera();
      } catch (error) {
        console.error("Error handling device change:", error);
      }
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    startCamera();

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (manualFocusEnabled) {
      adjustFocus(focusDistance);
    } else {
      const stream = mediaStreamRef.current;
      if (stream) {
        const track = stream.getVideoTracks()[0];
        track
          .applyConstraints({
            advanced: [{ focusMode: "continuous" }],
          })
          .then(() => {
            console.log("Auto-focus enabled");
          })
          .catch((error) => {
            console.error("Error enabling auto-focus:", error);
          });
      }
    }
  }, [manualFocusEnabled]);

  useEffect(() => {
    if (manualBrightnessEnabled) {
      adjustBrightness(brightness);
    }
  }, [manualBrightnessEnabled]);

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="border rounded w-full h-80 mt-4"
      ></video>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {focusSupported && (
        <div className="flex flex-col items-center mt-4">
          <label className="mb-2">
            <input
              type="checkbox"
              checked={manualFocusEnabled}
              onChange={(e) => setManualFocusEnabled(e.target.checked)}
              className="mr-2"
            />
            Enable Manual Focus
          </label>
          {manualFocusEnabled && (
            <input
              id="focus-slider"
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={focusDistance}
              onChange={(e) => adjustFocus(Number(e.target.value))}
              className="w-full"
            />
          )}
        </div>
      )}

      {brightnessSupported && (
        <div className="flex flex-col items-center mt-4">
          <label className="mb-2">
            <input
              type="checkbox"
              checked={manualBrightnessEnabled}
              onChange={(e) => setManualBrightnessEnabled(e.target.checked)}
              className="mr-2"
            />
            Enable Manual Brightness
          </label>
          {manualBrightnessEnabled && (
            <input
              id="brightness-slider"
              type="range"
              min={0}
              max={200}
              step={1}
              value={brightness}
              onChange={(e) => adjustBrightness(Number(e.target.value))}
              className="w-full"
            />
          )}
        </div>
      )}

      <button
        type="button"
        className={`px-6 py-2 rounded mt-4 ${
          cameraEnabled
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
        onClick={captureImage}
        disabled={!cameraEnabled}
      >
        التقاط الصورة
      </button>

      {isEditing && (
        <>
          <div className="relative w-full h-64 mt-4">
            <Cropper
              src={imageSrc}
              style={{ height: "120%", width: "100%" }}
              aspectRatio={NaN}
              guides={false}
              ref={cropperRef}
              viewMode={1}
            />
          </div>
          <button
            type="button"
            className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 mt-20"
            onClick={saveCroppedPhoto}
          >
            حفظ الصورة الملتقطة
          </button>
        </>
      )}
    </div>
  );
};

export default CameraComponent;
