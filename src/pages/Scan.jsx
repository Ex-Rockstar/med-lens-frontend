import React, { useState, useRef, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { AiOutlineCamera } from "react-icons/ai";
import axios from "axios";
import JSZip from "jszip";
import { GoogleGenerativeAI } from "@google/generative-ai";
function Scan() {
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isRetakeMode, setIsRetakeMode] = useState(false);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const genAI = new GoogleGenerativeAI("AIzaSyBwc4UjMcLVWa07Qu0GF_q_cHH6YMrGAgU");
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      setSelectedImage(null);
      setResizedImage(null);
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(newStream);
      setIsCameraActive(true);
      setCapturedImage(null);
      setPrediction(null);
      setIsRetakeMode(false); 
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
      setIsCameraActive(false);
    }
  };  

  const captureImage = async () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);

      const capturedDataURL = canvas.toDataURL("image/jpeg");
      setCapturedImage(capturedDataURL);

      stopCamera();

      setResizedImage(capturedDataURL);

      try {
        const formData = new FormData();
        formData.append("image", dataURLtoBlob(capturedDataURL));

        const response = await axios.post(
          "http://localhost:5000/predict",
          formData
        );

        if (response.status === 200) {
          const result = response.data;
          setPrediction(result);
          setIsRetakeMode(true);
        } else {
          console.error("Error predicting image");
        }
      } catch (error) {
        console.error("Error sending image to API:", error);
      }
    }
  };

  const askGemini = async () => {
    if (prediction) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = prediction.class_name;
      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = response.text();
      console.log(text);
    }
  };
  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setCapturedImage(null);
      setResizedImage(null);

      const resizedImageDataURL = await resizeImage(file, 320, 240);
      setResizedImage(resizedImageDataURL);

      const formData = new FormData();
      formData.append("image", dataURLtoBlob(resizedImageDataURL));

      try {
        const response = await axios.post(
          "http://localhost:5000/predict",
          formData
        );

        if (response.status === 200) {
          const result = response.data;
          setPrediction(result);
        } else {
          console.error("Error predicting uploaded image");
        }
      } catch (error) {
        console.error("Error sending uploaded image to API:", error);
      }
    }
  };

  const handleDownload = () => {
    if (prediction) {
      if (selectedImage) {
        const textData = `Prediction: ${prediction.class_name}\nConfidence Score: ${prediction.confidence_score}%`;
        const textBlob = new Blob([textData], { type: "text/plain" });

        const textUrl = URL.createObjectURL(textBlob);

        const a = document.createElement("a");
        a.href = textUrl;
        a.download = "results.txt";
        a.style.display = "none";

        document.body.appendChild(a);
        a.click();

        URL.revokeObjectURL(textUrl);
      } else {
        const zip = new JSZip();

        zip.file(
          "results.txt",
          `Prediction: ${prediction.class_name}\nConfidence Score: ${prediction.confidence_score}%`
        );

        const imageBlob = dataURLtoBlob(capturedImage);
        zip.file("image.jpeg", imageBlob);

        zip.generateAsync({ type: "blob" }).then((content) => {
          const zipBlob = new Blob([content]);

          const zipUrl = URL.createObjectURL(zipBlob);

          const a = document.createElement("a");
          a.href = zipUrl;
          a.download = "results_and_image.zip";
          a.style.display = "none";

          document.body.appendChild(a);
          a.click();

          URL.revokeObjectURL(zipUrl);
        });
      }
    }
  };
  const openArticleLink = () => {
    if (prediction) {
      // Make a GET request to fetch search results directly from Google Custom Search API
      const apiKey = 'AIzaSyBXkv6xq-f5gwCaCG07RoxOl4wyoYFtxGk'; // Replace with your Google API key
      const cx = '15371b6c2deae4027'; // Replace with your Google Custom Search Engine ID
      const predictionQuery = encodeURIComponent(prediction.class_name);
      const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${predictionQuery}&key=${apiKey}&cx=${cx}`;
      axios.get(searchUrl)
        .then((response) => {
          if (response.status === 200) {
            const searchResults = response.data.items;
            if (searchResults && searchResults.length > 0) {
              // Get the URL of the first search result
              const firstResult = searchResults[0];
              const firstResultUrl = firstResult.link;
              if (firstResultUrl) {
                // Open the URL of the first search result in a new tab/window
                window.open(firstResultUrl, "_blank");
              } else {
                console.error("No URL found for the first search result.");
              }
            } else {
              console.error("No search results found for the prediction.");
            }
          } else {
            console.error("Failed to fetch search results.");
          }
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    }
  };
  

  return (
    <div className="min-h-screen w-full bg-[#272829] flex flex-col justify-center items-center">
      <h1 className="text-3xl font-semibold mb-4 text-white">Skin Detector</h1>
      <div className="flex flex-row">
        <button
          className={`border-collapse rounded px-2 py-4 m-2 transition ease-in-out delay-150 bg-black text-white hover:-translate-y-1 hover:scale-110 hover:bg-red-400 duration-300`}
          onClick={isCameraActive ? stopCamera : startCamera}
          style={{ display: "flex", alignItems: "center" }}
        >
          <AiOutlineCamera
            style={{ marginRight: "8px", transition: "margin-right 0.3s" }}
            className={
              (capturedImage || selectedImage) && isRetakeMode ? "mr-2" : "mr-0"
            }
          />
          {isCameraActive
            ? "Stop Camera"
            : (capturedImage || selectedImage) && isRetakeMode
            ? "Retake"
            : "Start Camera"}
        </button>

        <label
          className={`border-collapse rounded px-2 py-4 m-2 transition ease-in-out delay-150 bg-black text-white hover:-translate-y-1 hover:scale-110 hover:bg-red-400 duration-300`}
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <FiUpload style={{ marginRight: "8px" }} /> Upload Image
        </label>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {isCameraActive && <video ref={videoRef} autoPlay />}
      {resizedImage && (
        <img
          src={resizedImage}
          alt={selectedImage ? "Selected" : "Captured"}
          style={{ maxWidth: "100%", maxHeight: "100%", display: "block" }}
        />
      )}
      {prediction && (
        <div>
          <p className="text-2xl text-white font-mono">
            Prediction: {prediction.class_name}
          </p>
          <p className="text-2xl text-white font-mono">
            Confidence Score: {prediction.confidence_score}%
          </p>
          <div className="flex flex-row ">
          <button
            className="border-collapse rounded px-2 py-4 m-2 transition ease-in-out delay-150 bg-black text-white hover:-translate-y-1 hover:scale-110 hover:bg-red-400 duration-300"
            onClick={handleDownload}
            disabled={!prediction}
          >
            Download Image with Results
          </button>
          <button className="order-collapse rounded px-2 py-4 m-2 transition ease-in-out delay-150 bg-black text-white hover:-translate-y-1 hover:scale-110 hover:bg-red-400 duration-300" onClick={openArticleLink}>Read Article</button> <button className="order-collapse rounded px-2 py-4 m-2 transition ease-in-out delay-150 bg-black text-white hover:-translate-y-1 hover:scale-110 hover:bg-red-400 duration-300" onClick={askGemini}>ASk Gemini</button>
          </div>
        </div>
      )}
      {isCameraActive && !capturedImage && !selectedImage && !resizedImage && (
        <button
          className="border-collapse rounded bg-sky-300 py-2 px-4 mt-5 hover:bg-blue-700"
          onClick={captureImage}
        >
          Capture Image
        </button>
      )}
    </div>
  );
}

function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

async function resizeImage(file, maxWidth, maxHeight) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }

      if (height > maxHeight) {
        const ratio = maxHeight / height;
        height = maxHeight;
        width = width * ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result);
        };
      }, file.type);
    };
  });
}

export default Scan;
