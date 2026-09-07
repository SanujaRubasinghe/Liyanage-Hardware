import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

const BulkUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const response = await API.post('/products/bulk-upload', formData);

      toast.success(`Successfully uploaded ${response.data.count} products`);
      onUploadComplete();
    } catch (error) {
      console.log(error)
      toast.error(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Bulk Product Upload</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excel File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload an Excel file with product data
          </p>
        </div>
        <button
          type="submit"
          disabled={isUploading}
          className={`px-4 py-2 rounded-md text-white ${isUploading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isUploading ? 'Uploading...' : 'Upload Products'}
        </button>
      </form>
    </div>
  );
};

export default BulkUpload;