import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiImage, FiX, FiChevronDown } from 'react-icons/fi';
import API from '../api';
import { CategoryImageUploader } from './BaseImageUploader';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [categories, setCategories] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const handleImagesChange = (img) => {
    setThumbnailPreview(img?.croppedUrl || img?.preview || null);
    setFormData(prev => ({
      ...prev,
      thumbnail: img?.croppedFile || img?.file || null
    }));
  };
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: '',
    level: 'primary',
    is_active: true,
    is_delivery: true,
    delivery_range: 0,
    is_cod_only: false,
    thumbnail: null
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data.categories);
        
        if (id) {
          const { data: categoryData } = await API.get(`/categories/${id}`);
          setFormData({
            name: categoryData.category.name,
            description: categoryData.category.description,
            parent_id: categoryData.category.parent_category_id || '',
            level: categoryData.category.level,
            is_active: categoryData.category.is_active,
            is_delivery: categoryData.category.is_delivery,
            delivery_range: categoryData.category.is_colombo_only,
            is_cod_only: categoryData.category.is_cod_only,
            thumbnail: null
          });
          if (categoryData.category.thumbnail) {
            setThumbnailPreview(categoryData.category.thumbnail);
          }
          setLoading(false);
        }
      } catch (error) {
        toast.error('Failed to fetch data');
        navigate('/categories/all');
      }
    };
    
    fetchCategories();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData(prev => ({ ...prev, thumbnail: file }));
  //     setThumbnailPreview(URL.createObjectURL(file));
  //   }
  // };

  // const removeThumbnail = () => {
  //   setFormData(prev => ({ ...prev, thumbnail: null }));
  //   setThumbnailPreview(null);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('parent_id', formData.parent_id);
    formDataToSend.append('level', formData.level);
    formDataToSend.append('is_active', formData.is_active);
    formDataToSend.append('is_delivery', formData.is_delivery);
    formDataToSend.append('is_cod_only', formData.is_cod_only);
    formDataToSend.append('is_colombo_only', formData.delivery_range);

    if (formData.thumbnail) {
      formDataToSend.append('thumbnail', formData.thumbnail);
    }

    try {
      if (id) {
        await API.put(`/categories/${id}`, formDataToSend);
        toast.success('Category updated successfully');
      } else {
        await API.post('/categories', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Category created successfully');
      }
      navigate('/categories/all');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving category');
      setLoading(false);
    }
  };

  const filteredParentCategories = categories.filter(cat => {
    if (formData.level === 'primary') return false;
    if (formData.level === 'secondary') return cat.level === 'primary';
    if (formData.level === 'tertiary') return cat.level === 'secondary';
    return false;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {id ? 'Edit Category' : 'Add New Category'}
        </h1>
        <button
          onClick={() => navigate('/categories/all')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back to Categories
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="tertiary">Tertiary</option>
                </select>
              </div>
              
              {formData.level !== 'primary' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.level === 'secondary' ? 'Primary Category' : 'Secondary Category'} *
                  </label>
                  <div className="relative">
                    <select
                      name="parent_id"
                      value={formData.parent_category_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      required
                    >
                      <option value="">Select a category</option>
                      {filteredParentCategories.map(category => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
              )}
              
              <div className="flex gap-6 items-center">
                <div>
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center'>
                    <input
                      type="checkbox"
                      name="is_delivery"
                      id="is_delivery"
                      checked={formData.is_delivery}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_delivery" className="ml-2 text-sm text-gray-700">
                      Delivery Available
                    </label>
                  </div>

                  {formData.is_delivery && (
                    <div>
                      <select
                        id="delivery_range"
                        name="delivery_range"
                        value={formData.delivery_range || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="" disabled>Select Delivery Range</option>
                        <option value={1}>Only Colombo</option>
                        <option value={0}>Islandwide</option>
                      </select>
                    </div>
                  )}
                </div>

                  {formData.is_delivery && (
                    <div>
                      <input
                        type="checkbox"
                        name="is_cod_only"
                        id="is_cod_only"
                        checked={formData.is_cod_only}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_cod_only" className="ml-2 text-sm text-gray-700">
                        Only Cash on Delivery
                      </label>
                    </div>
                  )}
              </div>
            </div>
            
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img 
                       src={thumbnailPreview.startsWith('blob:') ? 
                            thumbnailPreview : 
                            `${process.env.REACT_APP_API_BASE_URL}${thumbnailPreview}`}
                      alt="Thumbnail preview" 
                      className="max-h-64 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="thumbnail"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="thumbnail"
                          name="thumbnail"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
            </div> */}
            <CategoryImageUploader
              onImageChange={handleImagesChange}
              maxFiles={1}
            />
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/categories/all')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : id ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;