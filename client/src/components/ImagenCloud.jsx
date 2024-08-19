import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import LoaderAE from "./LoaderAE";

const ImagenCloud = ({ url, rounded, upload, setURLUpload, size = "128" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [localUrl, setLocalUrl] = useState(url);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const resizedImage = await resizeAndCompressImage(file);
      const uploadedUrl = await uploadToCloudinary(resizedImage);

      setLocalUrl(uploadedUrl);
      setURLUpload(uploadedUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resizeAndCompressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (height > 1000) {
            width = Math.round((1000 * img.width) / img.height);
            height = 1000;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, { type: "image/webp" }));
            },
            "image/webp",
            0.7
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "imagesPruebas");
    data.append("cloud_name", "drdkb6gjx");
    data.append("folder", "images");

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/drdkb6gjx/image/upload`, {
        method: "POST",
        body: data,
      });
      const res = await response.json();
      return res.secure_url;
    } catch (error) {
      console.error("Error al subir la imagen a Cloudinary:", error);
      throw error;
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        {localUrl ? (
          <img
            src={localUrl}
            alt="Uploaded"
            className={`object-cover ${rounded ? "rounded-full border-2 border-black dark:border-white" : ""}`}
            style={{ width: size + "px", height: size + "px" }}
          />
        ) : (
          <div
            className={`bg-gray-200 dark:bg-gray-400 flex flex-col items-center justify-center ${
              rounded ? "rounded-full border-2 border-black dark:border-white" : ""
            }`}
            style={{ width: size + "px", height: size + "px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M15 8h.01" />
              <path d="M7 3h11a3 3 0 0 1 3 3v11m-.856 3.099a2.991 2.991 0 0 1 -2.144 .901h-12a3 3 0 0 1 -3 -3v-12c0 -.845 .349 -1.608 .91 -2.153" />
              <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
              <path d="M16.33 12.338c.574 -.054 1.155 .166 1.67 .662l3 3" />
              <path d="M3 3l18 18" />
            </svg>
            <p>Sin imagen</p>
          </div>
        )}

        {isUploading && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
              rounded ? "rounded-full border-2 border-black dark:border-white" : ""
            }`}
            style={{ width: size + "px", height: size + "px" }}
          >
            <div className="text-white">
              <LoaderAE texto="" />
            </div>
          </div>
        )}
      </div>

      {upload && (
        <>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={fileInputRef} />
          <button onClick={() => fileInputRef.current.click()} className="bg-blue-500 text-white mt-2 py-2 px-4 rounded-full flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <path d="M7 9l5 -5l5 5" />
              <path d="M12 4l0 12" />
            </svg>
            Seleccionar imagen
          </button>
        </>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

ImagenCloud.propTypes = {
  url: PropTypes.string,
  rounded: PropTypes.bool,
  upload: PropTypes.bool,
  setURLUpload: PropTypes.func,
  size: PropTypes.string,
};

export default ImagenCloud;
