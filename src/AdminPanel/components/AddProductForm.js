import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { ProductImageUploader } from './BaseImageUploader';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api';

const AddProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    unit: '',
    primary_category_id: '',
    secondary_category_id: '',
    tertiary_category_id: '',
    stock_quantity: '',
    stock_alert_limit: '',
    sku: '',
    brand: '',
    weight: '',
    dimensions: '',
    is_active: true
  });

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState({
    primary: [],
    secondary: [],
    tertiary: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPrimary, setSelectedPrimary] = useState('');
  const [selectedSecondary, setSelectedSecondary] = useState('');
  const fileInputRef = useRef(null);

  const navigate = useNavigate()

  const handleImagesChange = (files) => {
    setImages(files);
  };

  useEffect(() => {
    const fetchPrimaryCategories = async () => {
      try {
        const { data } = await API.get('/categories/primary');
        setCategories(prev => ({
          ...prev,
          primary: data.categories
        }));
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch primary categories!');
      }
    };
    fetchPrimaryCategories();
  }, []);

  const fetchSecondaryCategories = async (primaryId) => {
    if (!primaryId) {
      setCategories(prev => ({
        ...prev,
        secondary: [],
        tertiary: []
      }));
      setSelectedSecondary('')
      setProduct(prev => ({
        ...prev,
        category_id: selectedPrimary,
      }));
      return;
    }

    try {
      const { data } = await API.get(`/categories/secondary?primary_id=${primaryId}`);
      console.log(data.categories)
      setCategories(prev => ({
        ...prev,
        secondary: data.categories,
        tertiary: []
      }));
      setSelectedSecondary('')
      setProduct(prev => ({
        ...prev,
        category_id: primaryId
      }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch secondary categories!');
    }
  };

  const fetchTertiaryCategories = async (secondaryId) => {
    if (!secondaryId) {
      setCategories(prev => ({
        ...prev,
        tertiary: []
      }));
      setProduct(prev => ({
        ...prev,
        category_id: selectedPrimary
      }));
      return;
    }

    try {
      const { data } = await API.get(`/categories/tertiary?secondary_id=${secondaryId}`);
      setCategories(prev => ({
        ...prev,
        tertiary: data.categories
      }));
      setProduct(prev => ({
        ...prev,
        category_id: secondaryId
      }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch tertiary categories!');
    }
  };

  const handlePrimaryChange = (e) => {
    const value = e.target.value;
    setSelectedPrimary(value);
    fetchSecondaryCategories(value);
  };

  const handleSecondaryChange = (e) => {
    const value = e.target.value;
    setSelectedSecondary(value);
    fetchTertiaryCategories(value);
    setProduct(prev => ({
      ...prev,
      category_id: value // Update to selected secondary
    }));
  };

  const handleTertiaryChange = (e) => {
    const value = e.target.value;
    setProduct(prev => ({
      ...prev,
      category_id: value // Update to selected tertiary
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and size
    const validFiles = files.filter(file => {
      if (!file.type.match('image.*')) {
        toast.error(`File ${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`File ${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      is_primary: prev.length === 0 && images.length === 0 // First image is primary by default
    }))]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const removed = newImages.splice(index, 1);
    URL.revokeObjectURL(removed[0].preview); // Clean up memory
    
    // If we removed the primary image, make the first image primary
    if (removed[0].is_primary && newImages.length > 0) {
      newImages[0].is_primary = true;
    }
    
    setImages(newImages);
  };

  const setPrimaryImage = (index) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      is_primary: i === index
    })));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!images.length) {
      toast.error('Please upload at least one image');
      return;
    }

    if (!product.category_id) {
      toast.error('Please select at least a primary category');
      return;
    }

    const formData = new FormData();
    
    // Append product data
    Object.entries(product).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Append images
    // images.forEach((img, index) => {
    //   formData.append('images', img.file);
    //   formData.append(`imageData[${index}][is_primary]`, img.is_primary);
    //   formData.append(`imageData[${index}][alt_text]`, `Image of ${product.name}`);
    // });
    images.forEach((img, index) => {
      let fileToSend = img.croppedFile || img.file;
        if (!fileToSend) {
        fileToSend = img.file;
      }
      formData.append('images', fileToSend);
      formData.append(`imageData[${index}][is_primary]`, img.is_primary);
      formData.append(`imageData[${index}][alt_text]`, `Image of ${product.name}`);
    });


    try {
      setIsUploading(true);
      const response = await API.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Product added successfully!');
      // Reset form
      setProduct({
        name: '',
        description: '',
        price: '',
        unit: '',
        category_id: '',
        stock_quantity: '',
        stock_alert_limit: '',
        sku: '',
        brand: '',
        weight: '',
        dimensions: '',
        is_active: true
      });
      setSelectedPrimary('');
      setSelectedSecondary('');
      setCategories({
        primary: categories.primary,
        secondary: [],
        tertiary: []
      });
      setImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      navigate('/products')
      toast.success('Product added successfully!')
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                <input
                  type="text"
                  name="unit"
                  value={product.unit}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Category *</label>
              <select
                value={selectedPrimary}
                onChange={handlePrimaryChange}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select primary category</option>
                {categories.primary.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                ))}
              </select>
            </div>
            {selectedPrimary && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Category *</label>
              <select
                value={selectedSecondary}
                onChange={handleSecondaryChange}
                disabled={!product.category_id}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select secondary category</option>
                {categories.secondary.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                ))}
              </select>
            </div>
            )}

            {selectedSecondary && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tertiary Category *</label>
              <select
                onChange={handleTertiaryChange}
                disabled={!product.category_id}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select tertiary category</option>
                {categories.tertiary.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                ))}
              </select>
            </div>
            )}
          </div>
          
          {/* Inventory & Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Inventory & Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={product.stock_quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Limit</label>
                <input
                  type="number"
                  name="stock_alert_limit"
                  value={product.stock_alert_limit}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                value={product.sku}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={product.weight}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                <input
                  type="text"
                  name="dimensions"
                  value={product.dimensions}
                  onChange={handleChange}
                  placeholder="L x W x H"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={product.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Product is active
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ProductImageUploader
            onImageChange={handleImagesChange}
            multiple
            maxFiles={5}
          />
        </div>
        
        {/* Image Upload Section */}
        {/* <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Product Images</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload Images
            </label>
            <p className="mt-2 text-sm text-gray-500">Upload one or multiple images (max 5MB each)</p>
          </div>
          
          {images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Selected Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className={`relative group border rounded-md overflow-hidden ${image.is_primary ? 'ring-2 ring-blue-500' : ''}`}>
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className={`p-1 rounded-full ${image.is_primary ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} mr-2`}
                        title={image.is_primary ? 'Primary image' : 'Set as primary'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 rounded-full bg-white text-red-500"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
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
            </div>
          )}
        </div> */}
        
        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
