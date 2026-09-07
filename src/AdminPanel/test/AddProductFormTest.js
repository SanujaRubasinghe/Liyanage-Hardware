import React, { useState } from 'react';
import { ProductImageUploader, CategoryImageUploader } from '../components/BaseImageUploader';

export default function AddProductFormTest() {
  const [images, setImages] = useState([]);
  const [productImages, setProductImages] = useState([]);

  const handleImagesChange = (files) => {
    setImages(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((file, idx) => {
      formData.append(`images`, file);
    });
    // Add other form fields and send to backend
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold">Add Product</h2>
      <ProductImageUploader
        onImageChange={handleImagesChange}
        multiple
        maxFiles={1}
      />

      {/* <CategoryImageUploader
        onImageChange={handleImagesChange}
        maxFiles={1}
      /> */}

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Submit Product
      </button>
    </form>
  );
}
