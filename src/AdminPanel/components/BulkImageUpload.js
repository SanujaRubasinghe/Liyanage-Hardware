import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

const BulkImageUpload = () => {
  const [zipFile, setZipFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [namingConvention, setNamingConvention] = useState('productId_primary.jpg, productId_1.jpg, productId_2.jpg');

  const handleFileChange = (e) => {
    if (e.target.files[0]?.type === 'application/zip' || 
        e.target.files[0]?.name.endsWith('.zip')) {
      setZipFile(e.target.files[0]);
    } else {
      toast.error('Please select a ZIP file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!zipFile) {
      toast.error('Please select a ZIP file');
      return;
    }

    const formData = new FormData();
    formData.append('zipFile', zipFile);

    try {
      setIsLoading(true);
      const response = await API.post('/products/bulk-image-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success(`Successfully processed ${response.data.processedCount} images`);
      setZipFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bulk Image Upload (ZIP)</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">ZIP File with Images</label>
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload a ZIP file containing product images
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-2">Naming Convention:</h3>
          <p className="mb-2">Name your images like this in the ZIP file:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><code>productId_primary.jpg</code> - Primary image (e.g. <code>123_primary.jpg</code>)</li>
            <li><code>productId_1.jpg</code> - Additional image 1</li>
            <li><code>productId_2.jpg</code> - Additional image 2</li>
            <li>... and so on</li>
          </ul>
          <p className="mt-2 text-sm">Where <code>productId</code> is your product's ID number.</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Upload ZIP'}
        </button>
      </form>
    </div>
  );
};

export default BulkImageUpload;