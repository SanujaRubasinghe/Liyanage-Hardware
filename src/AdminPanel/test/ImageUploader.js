import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDropzone } from "react-dropzone";
import {
  FiUpload,
  FiCheck,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";

const IMAGE_DIMENSIONS = {
  product: { width: 200, height: 200, previewWidth: 260, previewHeight: 260 },
  category: { width: 190, height: 300, previewWidth: 164, previewHeight: 260 },
};

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

const ImageUploader = ({
  type = "product",
  onImageChange,
  multiple = false,
  maxFiles = 5,
}) => {
  const {
    width: targetWidth,
    height: targetHeight,
    previewWidth,
    previewHeight,
  } = IMAGE_DIMENSIONS[type];
  const aspectRatio = targetWidth / targetHeight;

  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [crop, setCrop] = useState({
    aspect: aspectRatio,
    unit: "%",
    width: 80,
    x: 10,
    y: 10,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 1, height: 1 });
  const [fixedCrop, setFixedCrop] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setError("File must be JPG, PNG, or WEBP and less than 5MB.");
        return;
      }
      setError("");
      const newImages = acceptedFiles
        .slice(0, maxFiles - images.length)
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          croppedUrl: null,
        }));
      const updated = multiple ? [...images, ...newImages] : newImages;
      setImages(updated);
      setCurrentIndex(0);
      setCrop({
        aspect: aspectRatio,
        unit: "%",
        width: 80,
        x: 10,
        y: 10,
      });
      setCompletedCrop(null);
      onImageChange(multiple ? updated : updated[0]);
    },
    [images, maxFiles, multiple, onImageChange, aspectRatio]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple,
    maxSize: 5 * 1024 * 1024,
  });

  useEffect(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return;
    setLoading(true);

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedUrl = URL.createObjectURL(blob);
        const updated = [...images];
        updated[currentIndex].croppedUrl = croppedUrl;
        setImages(updated);
        onImageChange(multiple ? updated : updated[0]);
      }
      setLoading(false);
    }, "image/jpeg");
    // eslint-disable-next-line
  }, [completedCrop, targetWidth, targetHeight]);

  const goToImage = (idx) =>
    setCurrentIndex(clamp(idx, 0, images.length - 1));
  const removeImage = (idx) => {
    const updated = images.filter((_, i) => i !== idx);
    setImages(updated);
    setCurrentIndex(clamp(currentIndex - (idx < currentIndex ? 1 : 0), 0, updated.length - 1));
    onImageChange(multiple ? updated : updated[0] || null);
  };

  const resetCrop = () => {
    setCrop({ aspect: aspectRatio, unit: "%", width: 80, x: 10, y: 10 });
    setCompletedCrop(null);
  };

  // --- Preview Card Markup ---
  function ProductPreviewCard() {
    return (
      <div
        className="rounded-xl shadow-md border bg-white p-4 flex flex-col items-center"
        style={{
          width: previewWidth,
          minHeight: previewHeight + 80,
          maxWidth: 320,
        }}
      >
        <div
          className="rounded border-[5px] mb-3 flex items-center justify-center"
          style={{
            borderColor: "#e53935",
            width: targetWidth,
            height: targetHeight,
            background: "#fff",
          }}
        >
          {images[currentIndex]?.croppedUrl ? (
            <img
              src={images[currentIndex]?.croppedUrl || images[currentIndex]?.preview}
              alt="Preview"
              className="object-contain"
              style={{
                width: "90%",
                height: "90%",
              }}
            />
          ) : (
            <div
              className="animate-pulse bg-gray-200"
              style={{
                width: "90%",
                height: "90%",
              }}
            />
          )}
        </div>
        <div className="w-full text-left">
          <div className="text-lg font-bold" style={{ color: "#e53935" }}>
            Test Product
          </div>
          <div className="text-xs text-gray-500 mb-1">
            Part Number: framing_nail_1234
          </div>
          <div className="text-base font-semibold mb-1">
            Rs.10.00{" "}
            <span className="text-xs text-gray-400 font-normal">inc VAT</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">1 unit</div>
          <div className="flex gap-2">
            <button className="bg-orange-500 text-white py-1 px-4 rounded font-semibold">
              Buy
            </button>
            <button className="bg-gray-200 text-gray-700 py-1 px-4 rounded font-semibold">
              Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  function CategoryPreviewCard() {
    return (
      <div
        className="rounded-xl shadow-md bg-white flex flex-col items-center border"
        style={{
          width: previewWidth,
          height: previewHeight + 40,
          borderColor: "#e53935",
          borderWidth: 2,
          overflow: "hidden",
          maxWidth: 200,
        }}
      >
        <div
          className="flex-1 flex items-center justify-center"
          style={{
            width: "100%",
            height: previewHeight,
            background: "#fff",
          }}
        >
          {images[currentIndex]?.croppedUrl ? (
            <img
              src={images[currentIndex]?.croppedUrl}
              alt="Preview"
              className="object-contain"
              style={{
                width: "90%",
                height: "90%",
              }}
            />
          ) : (
            <div
              className="animate-pulse bg-gray-200"
              style={{
                width: "90%",
                height: "90%",
              }}
            />
          )}
        </div>
        <div
          className="w-full text-center font-semibold py-2"
          style={{
            background: "#e53935",
            color: "#fff",
            fontSize: "1rem",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: "0.75rem",
            borderBottomRightRadius: "0.75rem",
          }}
        >
          Test Category
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-5 border-dashed rounded-lg p-6 text-center bg-white shadow transition cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "hover:border-blue-500"
        }`}
        tabIndex={0}
        aria-label="Image upload area"
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto text-blue-500 text-3xl mb-2" />
        <p className="text-base text-gray-600 font-medium">
          Click or drop {multiple ? "images" : "an image"} here
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {targetWidth}x{targetHeight}px • JPG/PNG/WEBP • Max 5MB
        </p>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {/* Thumbnails and navigation */}
      {images.length > 0 && (
        <div className="flex items-center gap-3">
          {images.length > 1 && (
            <button
              className="p-2 rounded hover:bg-blue-100 text-blue-600"
              onClick={() => goToImage(currentIndex - 1)}
              disabled={currentIndex === 0}
              aria-label="Previous image"
            >
              <FiChevronLeft />
            </button>
          )}
          <div className="flex gap-3 flex-wrap">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative w-16 h-16 border rounded-md shadow-sm overflow-hidden cursor-pointer transition ${
                  idx === currentIndex ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => goToImage(idx)}
                tabIndex={0}
                aria-label={`Select image ${idx + 1}`}
              >
                <img
                  src={img.croppedUrl || img.preview}
                  alt={`thumb ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-bl"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx);
                  }}
                  aria-label={`Remove image ${idx + 1}`}
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <button
              className="p-2 rounded hover:bg-blue-100 text-blue-600"
              onClick={() => goToImage(currentIndex + 1)}
              disabled={currentIndex === images.length - 1}
              aria-label="Next image"
            >
              <FiChevronRight />
            </button>
          )}
        </div>
      )}

      {/* Edit and Preview */}
      {images.length > 0 && (
        <div className="flex gap-6">
          {/* Edit Image */}
          <div className="w-[260px] p-4 border rounded-lg shadow bg-white">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Crop & Adjust
            </h4>
            <div
              className="relative rounded overflow-hidden flex justify-center items-center bg-gray-100"
              style={{
                width: Math.min(260, 300 * (imgDimensions.width / imgDimensions.height)),
                height: Math.min(300, 260 * (imgDimensions.height / imgDimensions.width)),
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={setCrop}
                onComplete={setCompletedCrop}
                aspect={aspectRatio}
                minWidth={20}
                minHeight={20}
                keepSelection={true}
                style={{ width: "100%" }}
              >
                <img
                  ref={imgRef}
                  src={images[currentIndex]?.preview}
                  alt="Crop"
                  className="max-w-full max-h-[300px] object-contain"
                  onLoad={(e) => {
                    setImgDimensions({
                      width: e.target.naturalWidth,
                      height: e.target.naturalHeight,
                    });
                  }}
                />
              </ReactCrop>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setCompletedCrop({ ...crop })}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium flex items-center justify-center"
                disabled={loading}
              >
                <FiCheck className="inline mr-1" />
                {loading ? "Applying..." : "Apply Crop"}
              </button>
              <button
                onClick={resetCrop}
                className="flex-0 bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 text-sm font-medium flex items-center justify-center"
                title="Reset crop"
                type="button"
              >
                <FiRefreshCw className="inline" />
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Live Card */}
          <div className="flex-1 max-w-md flex justify-center items-start">
            {type === "product" ? <ProductPreviewCard /> : <CategoryPreviewCard />}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
