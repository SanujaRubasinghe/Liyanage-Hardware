import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Save, Tag, Sparkles, CheckCircle2, LayoutGrid, Eye } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';

const OfferSectionManager = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: 'Offer Items',
    category_id: 'offers',
    is_active: true,
    alt_text: 'Offer Items',
    selectedFile: null,
    previewUrl: null
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch categories
      let catList = [];
      try {
        const catRes = await API.get('/categories/primary');
        catList = catRes.data?.categories || catRes.data || [];
      } catch (catErr) {
        try {
          const catRes2 = await API.get('/categories');
          catList = catRes2.data?.categories || catRes2.data || [];
        } catch (e) {
          console.warn(e);
        }
      }
      setCategories(Array.isArray(catList) ? catList : []);

      // 2. Fetch offer banner configuration
      let data = null;
      try {
        const offerRes = await API.get('/content/offer-banner');
        data = offerRes.data;
      } catch (err) {
        console.error('Error getting offer-banner:', err);
      }

      if (!data || !data.id) {
        try {
          const locRes = await API.get('/promotional-banners/location/home-offer-row');
          data = locRes.data;
        } catch (err) {
          console.error('Error getting location banner:', err);
        }
      }

      if (data) {
        setForm(prev => ({
          ...prev,
          id: data.id || data.banner_id || null,
          name: data.name || 'Offer Items',
          category_id: String(data.category_id || data.description || 'offers'),
          is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
          alt_text: data.alt_text || 'Offer Items',
          selectedFile: null,
          previewUrl: data.image_url ? getImageUrl(data.image_url) : (data.current_image ? getImageUrl(data.current_image.image_url) : prev.previewUrl)
        }));
      }
    } catch (error) {
      console.error('Error fetching offer section data:', error);
      toast.error('Failed to load Offer Section settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        selectedFile: file,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let bannerId = form.id;

      if (!bannerId) {
        // Fetch or create banner dynamically
        try {
          const offerRes = await API.get('/content/offer-banner');
          if (offerRes.data && offerRes.data.id) {
            bannerId = offerRes.data.id;
          }
        } catch (err) {
          console.error(err);
        }

        if (!bannerId) {
          const createRes = await API.post('/promotional-banners', {
            name: form.name || 'Offer Items',
            location: 'home-offer-row',
            description: form.category_id || 'offers',
            is_active: form.is_active
          });
          bannerId = createRes.data.id;
        }
        setForm(prev => ({ ...prev, id: bannerId }));
      }

      // 1. Update banner title & category ID (stored in description)
      await API.put(`/promotional-banners/${bannerId}`, {
        name: form.name,
        location: 'home-offer-row',
        description: form.category_id,
        is_active: form.is_active
      });

      // 2. Upload image if selected
      if (form.selectedFile) {
        const formData = new FormData();
        formData.append('image', form.selectedFile);
        formData.append('banner_id', bannerId);
        formData.append('alt_text', form.alt_text || form.name);
        formData.append('is_active', true);

        await API.post('/promotional-banners/images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      toast.success('Offer Items Section updated successfully!');
      fetchInitialData();
    } catch (error) {
      console.error('Error updating offer section:', error);
      toast.error(error.response?.data?.message || 'Error saving changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Banner */}
      <div className="mb-8 bg-gradient-to-r from-red-600 via-rose-700 to-black p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            Offer Items Section Management
          </h1>
          <p className="text-red-100 mt-2 text-sm md:text-base max-w-2xl">
            Customize the "SPECIAL OFFERS - Offer Items" section displayed on the client Home Page (placed before Shop by Category).
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm self-start md:self-auto border border-white/20">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-xs md:text-sm font-semibold">Live Homepage Link</span>
        </div>
      </div>

      {/* Main Settings Form & Preview */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Settings */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-md p-6 border border-gray-100 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-red-600" />
              Offer Section Configuration
            </h2>
            <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold uppercase">
              Home Page Top Row
            </span>
          </div>

          {/* Section Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Section Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. Offer Items"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-gray-800 font-medium"
              required
            />
          </div>

          {/* Category / Offer Filter Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Filter / Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category_id}
              onChange={(e) => handleInputChange('category_id', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-gray-800 font-medium bg-white"
            >
              <option value="offers">🔥 Offer Items / Special Discounts (Default)</option>
              <option value="new_arrivals">🌟 New Arrivals</option>
              <optgroup label="Primary Categories">
                {categories.map((cat) => (
                  <option key={cat.category_id} value={String(cat.category_id)}>
                    📁 {cat.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select which product collection to display in the offer section scroll list.
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Left Sidebar Card Image
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-red-500 transition cursor-pointer bg-gray-50 hover:bg-red-50/20">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Choose Image File</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Image Alt Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image Alt Text / Description
            </label>
            <input
              type="text"
              value={form.alt_text}
              onChange={(e) => handleInputChange('alt_text', e.target.value)}
              placeholder="e.g. Special Offer Banner"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-gray-800 font-medium"
            />
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <span className="font-bold text-gray-800 block text-sm">Section Active</span>
              <span className="text-xs text-gray-500">Show or hide this Offer Items section on the Home Page</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving Changes...' : 'Save Offer Section Settings'}
            </button>
          </div>
        </div>

        {/* Right Live Preview Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-600" />
              Live Homepage Preview
            </h3>

            {/* Simulated Offer Section Card */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-[#cc0000] font-bold text-[10px] tracking-widest uppercase">SPECIAL OFFERS</p>
                  <h4 className="text-lg font-extrabold text-gray-900">{form.name || 'Offer Items'}</h4>
                </div>
                <span className="text-[#cc0000] text-xs font-bold">View all &rarr;</span>
              </div>

              {/* Sidebar Card Preview */}
              <div className="w-full bg-black rounded-xl p-4 text-white relative overflow-hidden min-h-[200px] flex flex-col justify-between shadow-md">
                <div className="mb-2 text-[#ffeb3b]">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[#ffeb3b] font-bold text-[9px] uppercase tracking-wider mb-1">HOT DEALS</p>
                  <h5 className="text-base font-extrabold leading-tight mb-1">Mega Savings. Best Deals.</h5>
                  <p className="text-gray-300 text-xs">Special discount offers on hardware tools.</p>
                </div>

                {form.previewUrl ? (
                  <div className="absolute inset-0 z-0 opacity-30">
                    <img
                      src={form.previewUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 bg-gray-800">
                    <ImageIcon className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OfferSectionManager;
