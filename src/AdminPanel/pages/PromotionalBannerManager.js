import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const PromotionalBannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerForm, setBannerForm] = useState({
    name: '',
    location: '',
    description: '',
    is_active: true
  });
  const [imageForm, setImageForm] = useState({
    alt_text: '',
    is_active: true,
  });
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [editingImageId, setEditingImageId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (selectedBanner) {
      fetchBannerImages(selectedBanner);
    }
  }, [selectedBanner]);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await API.get('/promotional-banners');
      setBanners(response.data);
    } catch (error) {
      toast.error('Failed to fetch promotional banners');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBannerImages = async (bannerId) => {
    setIsLoading(true);
    try {
      const response = await API.get(`/promotional-banners/${bannerId}/images`);
      setBannerImages(response.data);
    } catch (error) {
      toast.error('Failed to fetch banner images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBannerChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBannerForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const { name, value, type, checked } = e.target;
    setImageForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBannerId) {
        await API.put(`/promotional-banners/${editingBannerId}`, bannerForm);
        toast.success('Promotional banner updated successfully');
      } else {
        await API.post('/promotional-banners', bannerForm);
        toast.success('Promotional banner created successfully');
      }
      setBannerForm({
        name: '',
        location: '',
        description: '',
        is_active: true
      });
      setEditingBannerId(null);
      fetchBanners();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving promotional banner');
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBanner) {
      toast.error('Please select a banner first');
      return;
    }
    if (!selectedFile && !editingImageId) {
      toast.error('Please select an image file');
      return;
    }

    const formData = new FormData();
    if (selectedFile) formData.append('image', selectedFile);
    Object.entries(imageForm).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    formData.append('banner_id', selectedBanner);

    try {
      if (editingImageId) {
        await API.put(`/promotional-banners/images/${editingImageId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Banner image updated successfully');
      } else {
        await API.post('/promotional-banners/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Banner image added successfully');
      }
      setImageForm({
        alt_text: '',
        is_active: true,
      });
      setSelectedFile(null);
      setEditingImageId(null);
      setIsImageModalOpen(false);
      fetchBannerImages(selectedBanner);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving banner image');
    }
  };

  const handleEditBanner = (banner) => {
    setBannerForm({
      name: banner.name,
      location: banner.location,
      description: banner.description,
      is_active: banner.is_active
    });
    setEditingBannerId(banner.id);
  };

  const handleEditImage = (image) => {
    setImageForm({
      alt_text: image.alt_text,
      is_active: image.is_active,
    });
    setEditingImageId(image.id);
    setIsImageModalOpen(true);
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm('Are you sure you want to delete this promotional banner? All associated images will also be deleted.')) {
      try {
        await API.delete(`/promotional-banners/${id}`);
        toast.success('Promotional banner deleted successfully');
        if (selectedBanner === id) {
          setSelectedBanner(null);
          setBannerImages([]);
        }
        fetchBanners();
      } catch (error) {
        toast.error('Failed to delete promotional banner');
      }
    }
  };

  const handleDeleteImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner image?')) {
      try {
        await API.delete(`/promotional-banners/images/${id}`);
        toast.success('Banner image deleted successfully');
        fetchBannerImages(selectedBanner);
      } catch (error) {
        toast.error('Failed to delete banner image');
      }
    }
  };

  const openImageModal = () => {
    setImageForm({
      alt_text: '',
      is_active: true,
    });
    setEditingImageId(null);
    setSelectedFile(null);
    setIsImageModalOpen(true);
  };

  return (
   <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Banner List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Promotional Banners</h2>
              <button
                onClick={() => {
                  setEditingBannerId(null);
                  setBannerForm({
                    name: '',
                    location: '',
                    description: '',
                    is_active: true
                  });
                  setSelectedBanner(null);
                  setBannerImages([]);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition"
              >
                New Banner
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : banners.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No promotional banners found
              </div>
            ) : (
              <div className="space-y-2">
                {banners.map(banner => (
                  <motion.div
                    key={banner.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-md transition ${selectedBanner === banner.id ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-50 border border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => setSelectedBanner(banner.id)}
                      >
                        <h3 className="font-medium text-gray-800">{banner.name}</h3>
                        <p className="text-sm text-gray-500">Location: {banner.location}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {banner.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditBanner(banner);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          aria-label="Edit banner"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBanner(banner.id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          aria-label="Delete banner"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Banner Form and Images */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner Form */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingBannerId ? 'Edit Promotional Banner' : 'Create New Promotional Banner'}
            </h2>
            <form onSubmit={handleBannerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={bannerForm.name}
                  onChange={handleBannerChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Identifier</label>
                <input
                  type="text"
                  name="location"
                  value={bannerForm.location}
                  onChange={handleBannerChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  placeholder="e.g., homepage-sidebar, category-tools, etc."
                />
                <p className="text-xs text-gray-500 mt-1">This unique identifier will be used to place the banner in your website code</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={bannerForm.description}
                  onChange={handleBannerChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Optional description that might appear with the banner"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={bannerForm.is_active}
                  onChange={handleBannerChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Active</label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                {editingBannerId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBannerId(null);
                      setBannerForm({
                        name: '',
                        location: '',
                        description: '',
                        is_active: true
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                >
                  {editingBannerId ? 'Update' : 'Create'} Banner
                </button>
              </div>
            </form>
          </motion.div>
          
          {/* Banner Images */}
          {selectedBanner && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Banner Images
                  {banners.find(b => b.id === selectedBanner) && (
                    <span className="ml-2 text-blue-600">({banners.find(b => b.id === selectedBanner).name})</span>
                  )}
                </h2>
                <button
                  onClick={openImageModal}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition"
                >
                  Add Image
                </button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : bannerImages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No images found for this banner
                </div>
              ) : (
                <div className="space-y-4">
                  {bannerImages.map(image => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}${image.image_url}`}
                            alt={image.alt_text}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              {image.alt_text && <p className="font-medium text-gray-800">{image.alt_text}</p>}
                              
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${image.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {image.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => handleEditImage(image)}
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteImage(image.id)}
                              className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {editingImageId ? 'Edit Banner Image' : 'Add Banner Image'}
                </h3>
                
                <form onSubmit={handleImageSubmit} className="space-y-4">
                  {!editingImageId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image File</label>
                      <div className="flex items-center">
                        <label className="flex flex-col items-center px-4 py-6 bg-white rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="mt-2 text-sm text-gray-600">
                            {selectedFile ? selectedFile.name : 'Choose an image'}
                          </span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                    <input
                      type="text"
                      name="alt_text"
                      value={imageForm.alt_text}
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Description for screen readers"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={imageForm.is_active}
                      onChange={handleImageChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Active</label>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsImageModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                    >
                      {editingImageId ? 'Update' : 'Add'} Image
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromotionalBannerManager;