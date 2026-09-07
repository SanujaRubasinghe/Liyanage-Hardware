import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from "../api"

const BulkStatusChange = () => {
  const [status, setStatus] = useState('active');
  const [productIds, setProductIds] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const response = await API.post('/products/bulk-status-change', {
        status: status === 'active',
        productIds: productIds.split(',').map(id => id.trim()).filter(id => id)
      });
      
      toast.success(`Successfully updated status for ${response.data.updatedCount} products`);
      setProductIds('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status change failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bulk Status Change</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Status</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={status === 'active'}
                onChange={() => setStatus('active')}
              />
              <span className="ml-2">Active</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={status === 'inactive'}
                onChange={() => setStatus('inactive')}
              />
              <span className="ml-2">Inactive/Discontinued</span>
            </label>
          </div>
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
          {isLoading ? 'Processing...' : 'Update Status'}
        </button>
      </form>
    </div>
  );
};

export default BulkStatusChange;