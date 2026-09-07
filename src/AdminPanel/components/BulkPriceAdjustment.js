import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from "../api";

const BulkPriceAdjustment = () => {
  const [adjustmentType, setAdjustmentType] = useState('percentage');
  const [value, setValue] = useState('');
  const [productIds, setProductIds] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryLevel, setCategoryLevel] = useState('primary');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setFetchingCategories(true);
        const response = await API.get('/categories');
        setCategories(response.data.categories);
      } catch (error) {
        toast.error('Failed to load categories');
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!value || isNaN(Number(value))) {
      toast.error('Please enter a valid number');
      return;
    }

    // Validate that either product IDs or category is selected
    if (!productIds && !selectedCategory) {
      toast.error('Please select either products or a category');
      return;
    }

    try {
      setIsLoading(true);
      const response = await API.post('/products/bulk-price-adjustment', {
        adjustmentType,
        value: Number(value),
        productIds: productIds.split(',').map(id => id.trim()).filter(id => id),
        categoryId: selectedCategory,
        categoryLevel: selectedCategory ? categoryLevel : undefined
      });
      
      toast.success(`Successfully updated prices for ${response.data.updatedCount} products`);
      setValue('');
      setProductIds('');
      setSelectedCategory('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Price adjustment failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter categories by level
  const getCategoriesByLevel = (level) => {
    return categories.filter(cat => {
      if (level === 'primary') return !cat.parent_category_id;
      if (level === 'secondary') {
        const parent = categories.find(c => c.category_id === cat.parent_category_id);
        return parent && !parent.parent_category_id;
      }
      if (level === 'tertiary') {
        const parent = categories.find(c => c.category_id === cat.parent_category_id);
        return parent && parent.parent_category_id;
      }
      return false;
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bulk Price Adjustment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Adjustment Type</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={adjustmentType === 'percentage'}
                onChange={() => setAdjustmentType('percentage')}
              />
              <span className="ml-2">Percentage</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={adjustmentType === 'fixed'}
                onChange={() => setAdjustmentType('fixed')}
              />
              <span className="ml-2">Fixed Amount</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">
            {adjustmentType === 'percentage' ? 'Percentage Change' : 'Fixed Amount Change'}
          </label>
          <input
            type="text"
            className="border p-2 rounded w-full max-w-xs"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={adjustmentType === 'percentage' ? 'e.g., 10 for 10% increase' : 'e.g., 5.99 to add $5.99'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product IDs Section */}
          <div>
            <label className="block font-medium mb-1">Product IDs (comma separated)</label>
            <textarea
              className="border p-2 rounded w-full h-20"
              value={productIds}
              onChange={(e) => setProductIds(e.target.value)}
              placeholder="e.g., 123, 456, 789"
            />
            <p className="text-sm text-gray-500 mt-1">Leave empty if adjusting by category</p>
          </div>

          {/* Category Section */}
          <div>
            <label className="block font-medium mb-1">OR Select by Category</label>
            
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Category Level</label>
              <select
                value={categoryLevel}
                onChange={(e) => {
                  setCategoryLevel(e.target.value);
                  setSelectedCategory('');
                }}
                className="border p-2 rounded w-full"
                disabled={fetchingCategories}
              >
                <option value="primary">Primary Category</option>
                <option value="secondary">Secondary Category</option>
                <option value="tertiary">Tertiary Category</option>
              </select>
            </div>

            {fetchingCategories ? (
              <p>Loading categories...</p>
            ) : (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select a category</option>
                {getCategoriesByLevel(categoryLevel).map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            <p className="text-sm text-gray-500 mt-1">Leave unselected if adjusting by product IDs</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || fetchingCategories}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Apply Price Adjustment'}
        </button>
      </form>
    </div>
  );
};

export default BulkPriceAdjustment;