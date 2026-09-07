import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from "../api"

const BulkCategoryAssignment = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productIds, setProductIds] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsFetchingCategories(true);
        const response = await API.get('/categories');
        setCategories(response.data.categories);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0].category_id.toString());
        }
      } catch (error) {
        toast.error('Failed to fetch categories');
      } finally {
        setIsFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    try {
      setIsLoading(true);
      const response = await API.post('/products/bulk-category-assignment', {
        categoryId: Number(selectedCategory),
        productIds: productIds.split(',').map(id => id.trim()).filter(id => id)
      });
      
      toast.success(`Successfully updated category for ${response.data.updatedCount} products`);
      setProductIds('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Category assignment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bulk Category Assignment</h2>
      
      {isFetchingCategories ? (
        <p>Loading categories...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Select Category</label>
            <select
              className="border p-2 rounded w-full max-w-xs"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Product IDs (comma separated, leave empty for all products)</label>
            <textarea
              className="border p-2 rounded w-full max-w-xl h-20"
              value={productIds}
              onChange={(e) => setProductIds(e.target.value)}
              placeholder="e.g., 123, 456, 789"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Assign Category'}
          </button>
        </form>
      )}
    </div>
  );
};

export default BulkCategoryAssignment;