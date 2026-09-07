import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import ScheduleList from './ScheduleList';
import AddScheduleModal from './AddScheduleModal';
import API from '../api';

const BannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [banner, setBanner] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    page: '',
    is_active: 1,
    display_order: 0,
    start_date: '',
    end_date: ''
  });
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      const fetchBanner = async () => {
        setLoading(true);
        try {
          const response = await API.get(`/banners/${id}`);
          const { schedules, ...bannerData } = response.data;
          setBanner(bannerData);
          setImagePreview(bannerData.image_url);
          setSchedules(schedules);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      fetchBanner();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBanner(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, WebP)');
      return;
    }

    // Validate image dimensions (optional)
    try {
      const isValid = await validateImage(file);
      if (!isValid) return;
    } catch (err) {
      setError('Failed to validate image');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 800) {
          setError('For best quality, use images at least 800px wide (will be resized to 1200px)');
          resolve(true); // Still allow but show warning
        } else {
          resolve(true);
        }
      };
      img.onerror = () => {
        setError('Invalid image file');
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData();
    const file = fileInputRef.current?.files[0];
    
    if (file) {
      formData.append('banner_image', file);
    }
    
    // Append all other form data
    Object.entries(banner).forEach(([key, value]) => {
      if (key !== 'image_url') {
        formData.append(key, value);
      }
    });
    
    // If editing, include current image URL
    if (isEditing) {
      formData.append('current_image', banner.image_url);
    }
    
    setLoading(true);
    setIsUploading(true);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      };
      
      if (isEditing) {
        const response = await API.put(`/banners/${id}`, formData, config);
        setBanner(prev => ({ ...prev, image_url: response.data.image_url }));
      } else {
        const response = await API.post('/banners', formData, config);
        navigate(`/banners`);
      }
      
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAddSchedule = async (scheduleData) => {
    try {
      const response = await API.post(`/banners/${id}/schedules`, scheduleData);
      setSchedules([...schedules, response.data]);
      setShowScheduleModal(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleUpdateSchedule = async (scheduleId, updatedData) => {
    try {
      await API.put(`/schedules/${scheduleId}`, updatedData);
      setSchedules(schedules.map(schedule => 
        schedule.schedule_id === scheduleId ? { ...schedule, ...updatedData } : schedule
      ));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await API.delete(`/schedules/${scheduleId}`);
      setSchedules(schedules.filter(schedule => schedule.schedule_id !== scheduleId));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  if (loading && isEditing) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? 'Edit Banner' : 'Create New Banner'}
        </h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={banner.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="subtitle">
                Subtitle
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={banner.subtitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="banner_image">
                Banner Image
              </label>
              
              <input
                type="file"
                id="banner_image"
                name="banner_image"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              
              <div className="flex items-center space-x-4 mb-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-300"
                >
                  Choose Image
                </button>
                
                {fileInputRef.current?.files[0] && (
                  <span className="text-gray-600">
                    {fileInputRef.current.files[0].name}
                  </span>
                )}
              </div>
              
              <div className="mb-2 text-sm text-gray-500">
                <p>Recommended size: 1200px wide or larger</p>
                <p>Images will be automatically compressed</p>
              </div>
              
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="target_url">
                Page
              </label>
              <input
                type="text"
                id="page"
                name="page"
                value={banner.page}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="display_order">
                Display Order
              </label>
              <input
                type="number"
                id="display_order"
                name="display_order"
                value={banner.display_order}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={banner.is_active}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="ml-2 text-gray-700">
                Active
              </label>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="start_date">
                Start Date
              </label>
              <input
                type="datetime-local"
                id="start_date"
                name="start_date"
                value={banner.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="end_date">
                End Date
              </label>
              <input
                type="datetime-local"
                id="end_date"
                name="end_date"
                value={banner.end_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {(imagePreview || banner.image_url) && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Preview</label>
              <div className="border rounded-lg p-4">
                <img 
                  src={`${process.env.REACT_APP_API_BASE_URL}${imagePreview}` || `${process.env.REACT_APP_API_BASE_URL}${banner.image_url}`} 
                  alt="Banner Preview" 
                  className="max-h-48 mx-auto"
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(isEditing ? '..' : '/banners')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Banner'}
              {isUploading && ` (${uploadProgress}%)`}
            </button>
          </div>
        </form>
        
        {isEditing && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Scheduled Times</h3>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                Add Schedule
              </button>
            </div>
            
            <ScheduleList 
              schedules={schedules} 
              onUpdate={handleUpdateSchedule}
              onDelete={handleDeleteSchedule}
            />
          </div>
        )}
      </motion.div>
      
      {showScheduleModal && (
        <AddScheduleModal 
          onClose={() => setShowScheduleModal(false)}
          onSave={handleAddSchedule}
        />
      )}
    </div>
  );
};

export default BannerForm;