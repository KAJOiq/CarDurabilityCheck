import React, { useRef, useEffect, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const CameraComponentForChassis = ({ setPhoto }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const cropperRef = useRef(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [focusDistance, setFocusDistance] = useState(100);
  const [focusSupported, setFocusSupported] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [brightnessSupported, setBrightnessSupported] = useState(false);
  const [focusRange, setFocusRange] = useState({ min: 0, max: 100 });
  const [manualFocusEnabled, setManualFocusEnabled] = useState(false);
  const [manualBrightnessEnabled, setManualBrightnessEnabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [croppedImage, setCroppedImage] = useState(null);

  const dataURLtoFile = (dataURL, filename) => {
    if (!dataURL || typeof dataURL !== 'string') {
      throw new Error('Invalid dataURL');
    }

    const arr = dataURL.split(',');
    if (arr.length < 2 || !arr[0].startsWith('data:image')) {
      throw new Error('Invalid dataURL format');
    }

    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const getCroppedImg = (imageSrc, cropper) => {
    return new Promise((resolve) => {
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } else {
        resolve(null);
      }
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        if (capabilities.focusDistance) {
          setFocusSupported(true);
          setFocusRange({ min: capabilities.focusDistance.min, max: capabilities.focusDistance.max });
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

        if (capabilities.brightness) {
          setBrightnessSupported(true);
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

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

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

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const imageUrl = canvas.toDataURL("image/png");
      setImageSrc(imageUrl);
      setIsEditing(true);
    }
  };

  const saveCroppedPhoto = async () => {
    try {
      const cropper = cropperRef.current.cropper;
      const croppedImageDataURL = await getCroppedImg(imageSrc, cropper);

      if (!croppedImageDataURL) {
        throw new Error('Failed to crop image');
      }

      if (!croppedImageDataURL.startsWith('data:image')) {
        throw new Error('Invalid dataURL format');
      }

      const croppedImageFile = dataURLtoFile(croppedImageDataURL, 'croppedImage.png');
      const fullImageFile = dataURLtoFile(imageSrc, 'fullImage.png');

      setPhoto({
        fullImage: fullImageFile,
        croppedImage: croppedImageFile,
      });

      setCroppedImage(croppedImageDataURL);
      setIsEditing(false);
      setSuccessMessage("تم حفظ الصورة بنجاح!"); 
      setTimeout(() => setSuccessMessage(""), 3000); 
    } catch (error) {
      console.error('Error saving cropped photo:', error);
      alert('فشل في حفظ الصورة المقصوصة: ' + error.message);
    }
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
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-md">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="border-2 border-gray-300 rounded-lg w-full max-w-3xl h-96 object-cover"
      ></video>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {focusSupported && (
        <div className="w-full max-w-3xl mt-4">
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">التركيز اليدوي</span>
            <input
              type="checkbox"
              checked={manualFocusEnabled}
              onChange={(e) => setManualFocusEnabled(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          )}
        </div>
      )}

      {brightnessSupported && (
        <div className="w-full max-w-3xl mt-4">
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">السطوع اليدوي</span>
            <input
              type="checkbox"
              checked={manualBrightnessEnabled}
              onChange={(e) => setManualBrightnessEnabled(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          )}
        </div>
      )}

      <button
        type="button"
        className={`px-6 py-2 rounded-lg mt-4 text-white font-semibold transition-all ${
          cameraEnabled
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        onClick={captureImage}
        disabled={!cameraEnabled}
      >
        التقاط الصورة
      </button>

      {isEditing && (
        <div className="w-full max-w-3xl mt-4">
          <div className="relative w-full h-[500px] bg-gray-200 rounded-lg overflow-hidden">
            <Cropper
              src={imageSrc}
              style={{ height: "100%", width: "100%" }}
              aspectRatio={9/3}
              guides={false}
              ref={cropperRef}
              viewMode={1}
              movable={false} 
              zoomable={false} 
              rotatable={false} 
              scalable={false} 
              background={false}
              cropBoxResizable={false}
              cropBoxMovable={true}
              dragMode={"none"} 
              ready={() => {
                const cropper = cropperRef.current?.cropper;
                if (cropper) {
                  const width = 600; 
                  cropper.setCropBoxData({
                    width: width,
                    height: width * (3 / 4),
                    left: (cropper.getContainerData().width - width) / 2, 
                    top: (cropper.getContainerData().height - width * (3 / 4)) / 2,
                  });
                }
              }}
              
            />
          </div>
          <button
            type="button"
            className="w-full px-6 py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
            onClick={saveCroppedPhoto}
          >
            حفظ الصورة الملتقطة
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 text-green-600 font-semibold">
          {successMessage}
        </div>
      )}

      {croppedImage && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">الصورة المقتطعة:</h2>
          <img src={croppedImage} alt="Cropped" className="mt-2 border-2 border-gray-300 rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default CameraComponentForChassis;