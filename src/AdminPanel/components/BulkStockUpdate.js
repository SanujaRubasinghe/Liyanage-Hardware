import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api'

const BulkStockUpdate = () => {
  const [updateType, setUpdateType] = useState('set');
  const [value, setValue] = useState('');
  const [productIds, setProductIds] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!value || isNaN(Number(value))) {
      toast.error('Please enter a valid number');
      return;
    }

    try {
      setIsLoading(true);
      const response = await API.post('/products/bulk-stock-update', {
        updateType,
        value: Number(value),
        productIds: productIds.split(',').map(id => id.trim()).filter(id => id)
      });
      
      toast.success(`Successfully updated stock for ${response.data.updatedCount} products`);
      setValue('');
      setProductIds('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Stock update failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bulk Stock Update</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Update Type</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={updateType === 'set'}
                onChange={() => setUpdateType('set')}
              />
              <span className="ml-2">Set Quantity</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={updateType === 'add'}
                onChange={() => setUpdateType('add')}
              />
              <span className="ml-2">Add Quantity</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={updateType === 'subtract'}
                onChange={() => setUpdateType('subtract')}
              />
              <span className="ml-2">Subtract Quantity</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">
            {updateType === 'set' ? 'New Stock Quantity' : 
             updateType === 'add' ? 'Quantity to Add' : 'Quantity to Subtract'}
          </label>
          <input
            type="number"
            className="border p-2 rounded w-full max-w-xs"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min="0"
            step="1"
          />
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
          {isLoading ? 'Processing...' : 'Update Stock'}
        </button>
      </form>
    </div>
  );
};

export default BulkStockUpdate;