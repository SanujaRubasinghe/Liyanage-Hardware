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
  FiStar,
} from "react-icons/fi";

// Utility functions
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function validateImageDimensions(width, height) {
  return width > 0 && height > 0 && !isNaN(width) && !isNaN(height);
}

const BaseImageUploader = ({
  targetWidth = 200,
  targetHeight = 200,
  previewWidth = 260,
  previewHeight = 260,
  previewComponent,
  onImageChange,
  multiple = false,
  maxFiles = 5,
}) => {
  // Validate props
  if (typeof targetWidth !== 'number' || targetWidth <= 0 ||
      typeof targetHeight !== 'number' || targetHeight <= 0) {
    console.error('Invalid target dimensions provided');
    targetWidth = 200;
    targetHeight = 200;
  }

  const aspectRatio = 1 / 1;
  
  // State management
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [crop, setCrop] = useState(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 1, height: 1 });
  const [error, setError] = useState("");
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'cropping' | 'error'
  const [activeImageLoad, setActiveImageLoad] = useState(false);
  const [isImageReadyForCrop, setIsImageReadyForCrop] = useState(false)

  // Refs
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());

  // Initialize crop when image dimensions are available
  useEffect(() => {
    if (imgDimensions.width > 0 && imgDimensions.height > 0 && !crop) {
      try {
        const initialWidth = Math.min(imgDimensions.width * 0.8, targetWidth);
        const initialHeight = initialWidth / aspectRatio;
        
        setCrop({
          unit: "px",
          x: (imgDimensions.width - initialWidth) / 2,
          y: (imgDimensions.height - initialHeight) / 2,
          width: initialWidth,
          height: initialHeight,
          aspect: aspectRatio,
        });
      } catch (err) {
        console.error('Error initializing crop:', err);
        setStatus('error');
      }
    }
  }, [imgDimensions, aspectRatio, targetWidth, crop]);

  // Handle image load with extensive error checking
  const handleImageLoad = useCallback((e) => {
    try {
      const { naturalWidth, naturalHeight } = e.target;
      if (!validateImageDimensions(naturalWidth, naturalHeight)) {
        throw new Error('Invalid image dimensions');
      }
      
      setImgDimensions({ width: naturalWidth, height: naturalHeight });
      setActiveImageLoad(true);
      setIsImageReadyForCrop(true)
      setStatus('idle');
      console.log('image loaded successfully, (line:93)')
    } catch (err) {
      console.error('Image load error:', err);
      setError('Failed to load image');
      setStatus('error');
      removeImage(currentIndex);
    }
  }, [currentIndex]);

  // Handle image errors
  const handleImageError = useCallback((e) => {
    console.error("Failed to load image:", e.target.src);
    setError("Failed to load image. Please try another one.");
    setStatus('error');
    removeImage(currentIndex);
  }, [currentIndex]);

  // Stable crop application with abort capability
  const applyCrop = useCallback(async () => {
    if (!crop || !imgRef.current || !canvasRef.current || status === 'cropping') return;

    abortControllerRef.current = new AbortController();
    setStatus('cropping');

    try {
      const image = imgRef.current;
      if (!image.complete || image.naturalWidth === 0) {
        throw new Error('Image not properly loaded');
      }

      const canvas = canvasRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Use a promise for the blob creation with timeout
      const blob = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Canvas toBlob timed out'));
        }, 5000);

        canvas.toBlob(
          (blob) => {
            clearTimeout(timeout);
            if (abortControllerRef.current.signal.aborted) {
              reject(new Error('Operation aborted'));
            } else {
              resolve(blob);
            }
          },
          "image/jpeg",
          0.92
        );
      });

      if (blob) {
        const croppedUrl = URL.createObjectURL(blob);
        const croppedFile = new File([blob], "cropped.jpg", { type: "image/jpeg" });
        const updated = [...images];
        updated[currentIndex] = {
          ...updated[currentIndex],
          croppedUrl,
          croppedFile,
          cropData: JSON.stringify(crop)
        };
        
        setImages(updated);
        onImageChange(multiple ? updated : updated[0]);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("Error applying crop:", err);
        setError("Failed to apply crop. Please try again.");
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setStatus('idle');
      }
    }
  }, [crop, currentIndex, images, multiple, onImageChange, targetWidth, targetHeight, status]);

  // Handle file drops with validation
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    abortControllerRef.current.abort(); // Cancel any ongoing operations
    
    if (fileRejections.length > 0) {
      const errors = fileRejections.map(({ errors }) => (
        errors.map(e => e.message).join(', ')
      ));
      setError(`Invalid files: ${errors.join('; ')}`);
      return;
    }

    if (acceptedFiles.length === 0) {
      setError("No valid files selected");
      return;
    }

    setError("");
    setStatus('loading');

    try {
      const newImages = acceptedFiles
        .slice(0, maxFiles - images.length)
        .map((file, index) => {
          const preview = URL.createObjectURL(file);
          return {
            file,
            preview,
            croppedUrl: null,
            is_primary: images.length === 0 && index === 0,
          };
        });

      const updated = multiple ? [...images, ...newImages] : newImages;
      setImages(updated);
      setCurrentIndex(0);
      setStatus('idle');
      onImageChange(multiple ? updated : updated[0]);
    } catch (err) {
      console.error("Error processing dropped files:", err);
      setError("Failed to process images. Please try again.");
      setStatus('error');
    }
  }, [images, maxFiles, multiple, onImageChange]);

  // Clean up resources
  useEffect(() => {
    return () => {
      abortControllerRef.current.abort();
      images.forEach(image => {
        URL.revokeObjectURL(image.preview);
        if (image.croppedUrl) URL.revokeObjectURL(image.croppedUrl);
      });
    };
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple,
    maxSize: 5 * 1024 * 1024,
    noClick: status === 'cropping' || status === 'loading',
  });

  // Image navigation and management
  const goToImage = useCallback((idx) => {
    setCurrentIndex(clamp(idx, 0, images.length - 1));
    setActiveImageLoad(false);
  }, [images.length]);

  const removeImage = useCallback((idx) => {
    abortControllerRef.current.abort();
    
    const wasPrimary = images[idx].is_primary;
    const updated = images.filter((_, i) => i !== idx);
    
    if (wasPrimary && updated.length > 0) {
      updated[0].is_primary = true;
    }

    setImages(updated);
    setCurrentIndex(clamp(currentIndex - (idx < currentIndex ? 1 : 0), 0, updated.length - 1));
    onImageChange(multiple ? updated : updated[0] || null);
    setStatus('idle');
  }, [currentIndex, images, multiple, onImageChange]);

  const setPrimaryImage = useCallback((idx) => {
    const updated = images.map((img, i) => ({
      ...img,
      is_primary: i === idx,
    }));
    setImages(updated);
    onImageChange(multiple ? updated : updated[0]);
  }, [images, multiple, onImageChange]);

  const resetCrop = useCallback(() => {
    abortControllerRef.current.abort();
    
    if (imgDimensions.width > 0 && imgDimensions.height > 0) {
      const initialWidth = Math.min(imgDimensions.width * 0.8, targetWidth);
      const initialHeight = initialWidth / aspectRatio;
      
      setCrop({
        unit: "px",
        x: (imgDimensions.width - initialWidth) / 2,
        y: (imgDimensions.height - initialHeight) / 2,
        width: initialWidth,
        height: initialHeight,
        aspect: aspectRatio,
      });
    }
    setStatus('idle');
  }, [imgDimensions, targetWidth, aspectRatio]);

  // Render functions
  const renderThumbnails = () => (
    <div className="flex items-center gap-3 mb-4">
      {images.length > 1 && (
        <button
          className="p-2 rounded hover:bg-blue-100 text-blue-600 disabled:opacity-50"
          onClick={() => goToImage(currentIndex - 1)}
          disabled={currentIndex === 0 || status !== 'idle'}
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
          >
            <img
              src={img.croppedUrl || img.preview}
              alt={`thumb ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={() => removeImage(idx)}
            />
            <button
              className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-bl"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(idx);
              }}
              disabled={status !== 'idle'}
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <button
          className="p-2 rounded hover:bg-blue-100 text-blue-600 disabled:opacity-50"
          onClick={() => goToImage(currentIndex + 1)}
          disabled={currentIndex === images.length - 1 || status !== 'idle'}
        >
          <FiChevronRight />
        </button>
      )}
    </div>
  );

  const renderImageGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {images.map((image, index) => (
        <div 
          key={index} 
          className={`relative group border rounded-md overflow-hidden ${
            image.is_primary ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <img
            src={image.croppedUrl || image.preview}
            alt={`Preview ${index + 1}`}
            className="w-full h-32 object-cover"
            onError={() => removeImage(index)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPrimaryImage(index);
              }}
              className={`p-1 rounded-full ${
                image.is_primary ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              } mr-2`}
              title={image.is_primary ? 'Primary image' : 'Set as primary'}
              disabled={status !== 'idle'}
            >
              <FiStar className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(index);
              }}
              className="p-1 rounded-full bg-white text-red-500"
              title="Remove image"
              disabled={status !== 'idle'}
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          {image.is_primary && (
            <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
              Primary
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderCropInterface = () => {
  if (!images.length || !crop) return null;
  return (
    <div className="w-[290px] p-4 border rounded-lg shadow bg-white relative">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">
        Crop & Adjust
      </h4>
      <div className="relative rounded overflow-hidden flex justify-center items-center bg-gray-100"
           style={{ width: previewWidth, height: previewHeight }}>
        <ReactCrop
          crop={crop}
          onChange={setCrop}
          aspect={aspectRatio}
          minWidth={50}
          minHeight={50}
          keepSelection={false}
          disabled={status !== 'idle'}
        >
          <img
            ref={imgRef}
            src={images[currentIndex]?.preview}
            alt="Crop"
            className="max-w-full max-h-[300px] object-contain"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </ReactCrop>
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
            <div className="loader" />
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={applyCrop}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium flex items-center justify-center transition-all"
          disabled={status !== 'idle' || !crop}
          aria-label="Apply Crop"
        >
          <FiCheck className="inline mr-1" />
          Apply Crop
        </button>
        <button
          onClick={resetCrop}
          className="flex-0 bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 text-sm font-medium flex items-center justify-center"
          title="Reset crop"
          disabled={status !== 'idle'}
          aria-label="Reset Crop"
        >
          <FiRefreshCw className="inline" />
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};


  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center bg-white shadow transition cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500"
        } ${status !== 'idle' ? 'opacity-70 pointer-events-none' : ''}`}
        tabIndex={0}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto text-blue-500 text-3xl mb-2" />
        <p className="text-base text-gray-600 font-medium">
          Click or drop {multiple ? "images" : "an image"} here
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {targetWidth}x{targetHeight}px • JPG/PNG/WEBP • Max 5MB
        </p>
        {error && (
          <p className="text-xs text-red-500 mt-2 animate-pulse">
            {error}
            <button 
              onClick={() => setError("")} 
              className="ml-2 text-red-700 font-bold"
            >
              ×
            </button>
          </p>
        )}
      </div>

      {/* Image Grid and Actions */}
      {images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Selected Images</h3>
          
          {renderThumbnails()}
          {renderImageGrid()}

          <div className="flex gap-6 mt-6">
            {renderCropInterface()}
            
            {/* Live Preview */}
            <div className="flex-1 max-w-md flex justify-center items-start">
              {previewComponent(
                images[currentIndex]?.croppedUrl || images[currentIndex]?.preview,
                images[currentIndex]
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Preview components with prop validation
const ProductPreviewCard = ({ imageUrl, imageData }) => {
  if (!imageUrl) return (
    <div className="rounded-xl shadow-md border bg-white p-4 flex flex-col items-center w-[260px] min-h-[340px] max-w-[320px]">
      <div className="animate-pulse bg-gray-200 w-full h-full" />
    </div>
  );

  return (
    <div
  className="
    product-card
    flex flex-col
    bg-white
    rounded-lg
    shadow-md
    p-3
    mx-auto
    w-full max-w-full
    transition-transform duration-200 ease-in-out
    focus-within:outline focus-within:outline-2 focus-within:outline-orange-500 focus-within:outline-offset-2
    hover:translate-y-[-2px]
    hover:shadow-lg
    md:flex-row md:max-w-[640px] md:p-4
    lg:max-w-[900px] lg:p-6
  "
>
  <div
    className="
      product-image-container
      w-full h-[140px]
      flex justify-center items-center
      mb-3
      overflow-hidden
      rounded-md
      bg-[#f8f8f8]
      shadow-sm
      relative
      cursor-pointer
      border-[5px] border-[#cc0000]
      md:w-[160px] md:h-[160px] md:mr-4 md:mb-0
      lg:w-[200px] lg:h-[200px]
    "
  >
    <img
      src={imageUrl}
      alt="Preview"
      className="
        w-full h-full
        object-cover
        rounded-[10px]
        transition-shadow duration-200
      "
      onError={(e) => {
        e.target.src = '/fallback-image.jpg';
      }}
    />
  </div>

  <div
    className="
      product-details
      flex flex-col flex-1 min-w-0
    "
  >
    <div
      className="
        product-title
        text-[1rem] font-semibold text-[#cc0000] mb-1 leading-snug
        line-clamp-2
        md:text-[1.1rem]
        lg:text-[1.22rem]
      "
    >
      Test Product
    </div>
    <div className="product-part text-[0.82rem] text-gray-600 mb-1">
      Part Number: framing_nail_1234
    </div>
    <div
      className="
        product-price
        text-[1.1rem] font-bold text-gray-800 mb-1
        md:text-[1.2rem]
        lg:text-[1.3rem]
      "
    >
      Rs.10.00 <span className="text-sm font-normal text-gray-500">inc VAT</span>
    </div>
    <div className="product-unit text-xs text-gray-600 mb-3">
      1 unit
    </div>
    <div className="product-actions flex gap-2 mt-auto">
      <button
        className="
          buy-now-btn
          flex-1 px-3 py-2 bg-orange-500 text-white text-sm font-medium rounded-md
          hover:bg-[#cc0000] transition
          md:text-base md:px-4 md:py-2
        "
      >
        Buy
      </button>
      <button
        className="
          details-btn
          flex-1 px-3 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md
          hover:bg-gray-300 transition
          md:text-base md:px-4 md:py-2
        "
      >
        Details
      </button>
    </div>
  </div>
</div>

  );
};

const CategoryPreviewCard = ({ imageUrl, imageData }) => {
  if (!imageUrl) return (
    <div className="rounded-xl shadow-md bg-white flex flex-col items-center border-2 border-red-600 w-[164px] h-[300px] max-w-[200px] overflow-hidden">
      <div className="animate-pulse bg-gray-200 w-full h-full" />
    </div>
  );

  return (
    <div
  className="
    bg-[#cc0000]
    border-[5px] border-[#cc0000]
    rounded-[12px] md:rounded-[16px]
    shadow-md
    transition-transform duration-300 ease-in-out
    aspect-[9/16]
    w-full max-w-[220px]
    mx-auto
    flex flex-col
    overflow-hidden
    relative
  "
>
  <div
    className="
      w-full
      h-[85%]
      aspect-[9/7]
      flex-shrink-0
    "
  >
    <img
      src={imageUrl}
      alt="Preview"
      className="
        w-full
        h-full
        object-cover
        rounded-t-[12px] md:rounded-t-[16px]
      "
      onError={(e) => {
        e.target.src = '/fallback-image.jpg';
      }}
    />
  </div>
  <div
    className="
      w-full
      text-center
      font-semibold
      py-2
      text-white
      text-base
      bg-[#cc0000]
    "
  >
    Test Category
  </div>
</div>
  );
};

export const ProductImageUploader = ({ 
  onImageChange, 
  multiple = false, 
  maxFiles = 5,
  targetWidth = 200,
  targetHeight = 200
}) => {
  return (
    <BaseImageUploader
      targetWidth={targetWidth}
      targetHeight={targetHeight}
      previewWidth={260}
      previewHeight={260}
      previewComponent={(imageUrl, imageData) => (
        <ProductPreviewCard imageUrl={imageUrl} imageData={imageData} />
      )}
      onImageChange={onImageChange}
      multiple={multiple}
      maxFiles={maxFiles}
    />
  );
};

export const CategoryImageUploader = ({ 
  onImageChange, 
  multiple = false, 
  maxFiles = 1,
  targetWidth = 190,
  targetHeight = 300
}) => {
  return (
    <BaseImageUploader
      targetWidth={targetWidth}
      targetHeight={targetHeight}
      previewWidth={164}
      previewHeight={260}
      previewComponent={(imageUrl, imageData) => (
        <CategoryPreviewCard imageUrl={imageUrl} imageData={imageData} />
      )}
      onImageChange={onImageChange}
      multiple={multiple}
      maxFiles={maxFiles}
    />
  );
};