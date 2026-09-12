import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Upload, Save, Eye, Sparkles, CheckCircle2, Layers, Tag, LayoutGrid } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';

const HomepageSectionsManager = () => {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(0); // 0: Row 1, 1: Row 2, 2: Row 3
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states for each row
  const [rowForms, setRowForms] = useState([
    { id: null, name: 'New Arrivals', category_id: 'new_arrivals', is_active: true, alt_text: 'New Arrivals', selectedFile: null, previewUrl: null },
    { id: null, name: 'Building Materials', category_id: '1', is_active: true, alt_text: 'Building Materials', selectedFile: null, previewUrl: null },
    { id: null, name: 'Tools & Hardware', category_id: '2', is_active: true, alt_text: 'Tools & Hardware', selectedFile: null, previewUrl: null }
  ]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch categories
      const catRes = await API.get('/categories/all');
      setCategories(catRes.data || []);

      // 2. Fetch homepage rows
      const rowsRes = await API.get('/content/homepage-rows');
      const rowData = rowsRes.data || [];
      setRows(rowData);

      // Populate forms
      const initialForms = rowData.map(r => ({
        id: r.id,
        name: r.name || '',
        category_id: String(r.category_id || 'new_arrivals'),
        is_active: Boolean(r.is_active),
        alt_text: r.alt_text || r.name,
        selectedFile: null,
        previewUrl: r.image_url ? getImageUrl(r.image_url) : null
      }));

      // Pad up to 3 rows if fewer
      while (initialForms.length < 3) {
        initialForms.push({
          id: null,
          name: `Section ${initialForms.length + 1}`,
          category_id: 'new_arrivals',
          is_active: true,
          alt_text: 'Section',
          selectedFile: null,
          previewUrl: null
        });
      }

      setRowForms(initialForms);
    } catch (error) {
      console.error('Error fetching homepage sections data:', error);
      toast.error('Failed to load homepage section settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (rowIndex, field, value) => {
    setRowForms(prev => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [field]: value
      };
      return updated;
    });
  };

  const handleFileChange = (rowIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      setRowForms(prev => {
        const updated = [...prev];
        updated[rowIndex] = {
          ...updated[rowIndex],
          selectedFile: file,
          previewUrl: URL.createObjectURL(file)
        };
        return updated;
      });
    }
  };

  const handleSaveRow = async (rowIndex) => {
    const row = rowForms[rowIndex];
    if (!row.id) {
      toast.error('Row ID not initialized');
      return;
    }

    setIsSaving(true);
    try {
      // 1. Update banner title & category ID (stored in description)
      await API.put(`/promotional-banners/${row.id}`, {
        name: row.name,
        location: row.location || rows[rowIndex]?.location || `home-row-${rowIndex + 1}`,
        description: row.category_id,
        is_active: row.is_active
      });

      // 2. Upload image if selected
      if (row.selectedFile) {
        const formData = new FormData();
        formData.append('image', row.selectedFile);
        formData.append('banner_id', row.id);
        formData.append('alt_text', row.alt_text || row.name);
        formData.append('is_active', true);

        await API.post('/promotional-banners/images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      toast.success(`Row ${rowIndex + 1} ("${row.name}") updated successfully!`);
      fetchInitialData();
    } catch (error) {
      console.error('Error updating row:', error);
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
      {/* Page Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            Homepage Product Sections & Cards Manager
          </h1>
          <p className="text-blue-100 mt-2 text-sm md:text-base max-w-3xl">
            Configure the 3 main horizontal product rows on the client homepage. For each row, choose the category, custom sidebar title, and upload a custom card image!
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md text-sm shrink-0 border border-white/20">
          <Layers className="w-5 h-5 text-green-400" />
          <span className="font-semibold">3 Active Rows Configured</span>
        </div>
      </div>

      {/* Row Selection Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        {rowForms.map((row, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`flex-1 min-w-[200px] py-3.5 px-5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm md:text-base ${
              activeTab === idx
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Row {idx + 1}: {row.name || `Section ${idx + 1}`}</span>
          </button>
        ))}
      </div>

      {/* Active Tab Form & Live Preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Form Settings */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-md p-6 border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-blue-600" />
                Row {activeTab + 1} Settings
              </h2>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase">
                {activeTab === 0 ? 'Top Row' : activeTab === 1 ? 'Middle Row' : 'Bottom Row'}
              </span>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Category for Row {activeTab + 1} <span className="text-red-500">*</span>
              </label>
              <select
                value={rowForms[activeTab].category_id}
                onChange={(e) => handleInputChange(activeTab, 'category_id', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 font-medium bg-white"
              >
                <option value="new_arrivals">🌟 New Arrivals (Latest Products)</option>
                <optgroup label="Primary Categories">
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={String(cat.category_id)}>
                      📁 {cat.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Products from this selected category will be loaded into this row's horizontal scroll grid.
              </p>
            </div>

            {/* Section Card Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sidebar Card Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={rowForms[activeTab].name}
                onChange={(e) => handleInputChange(activeTab, 'name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 font-semibold"
                placeholder="e.g. Building Materials, New Arrivals"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Displayed prominently inside the left sidebar card for this row.
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sidebar Card Image
              </label>
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors bg-gray-50/50">
                <div className="space-y-2 text-center">
                  <Upload className="mx-auto h-10 w-10 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor={`file-upload-${activeTab}`} className="relative cursor-pointer bg-white rounded-md font-semibold text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Choose a new card image</span>
                      <input
                        id={`file-upload-${activeTab}`}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleFileChange(activeTab, e)}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Image Alt Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image Alt Text
              </label>
              <input
                type="text"
                value={rowForms[activeTab].alt_text}
                onChange={(e) => handleInputChange(activeTab, 'alt_text', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
                placeholder="Image description"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="text-sm font-semibold text-gray-800 block">Row Visibility</span>
                <span className="text-xs text-gray-500">Show or hide this row on the customer homepage</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rowForms[activeTab].is_active}
                  onChange={(e) => handleInputChange(activeTab, 'is_active', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => handleSaveRow(activeTab)}
              disabled={isSaving}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-base"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Saving Row {activeTab + 1}...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Row {activeTab + 1} Changes
                </>
              )}
            </button>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
                <Eye className="w-5 h-5 text-indigo-600" />
                Live Card Preview
              </h2>

              <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 shadow-inner">
                {/* Simulated Homepage Sidebar Card */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-md space-y-4">
                  <h3 className="font-extrabold text-xl text-gray-900 border-b pb-3 flex items-center justify-between">
                    <span>{rowForms[activeTab].name || 'Section Title'}</span>
                    <span className="text-xs bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-full">
                      Row {activeTab + 1}
                    </span>
                  </h3>

                  <div className="relative rounded-xl overflow-hidden shadow-sm aspect-[4/3] bg-gray-200 flex items-center justify-center border">
                    {rowForms[activeTab].previewUrl ? (
                      <img
                        src={rowForms[activeTab].previewUrl}
                        alt={rowForms[activeTab].alt_text || 'Preview'}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/Sample.jpg'; }}
                      />
                    ) : (
                      <div className="text-center p-4 text-gray-400 flex flex-col items-center">
                        <ImageIcon className="w-10 h-10 mb-1" />
                        <span className="text-xs">No image selected</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 text-xs text-gray-500 flex items-center justify-between border-t">
                    <span>Linked Category:</span>
                    <span className="font-bold text-blue-600">
                      {rowForms[activeTab].category_id === 'new_arrivals'
                        ? '🌟 New Arrivals'
                        : categories.find(c => String(c.category_id) === String(rowForms[activeTab].category_id))?.name || `ID: ${rowForms[activeTab].category_id}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Saving will immediately update this card title, category link, and image on the client homepage.
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HomepageSectionsManager;
