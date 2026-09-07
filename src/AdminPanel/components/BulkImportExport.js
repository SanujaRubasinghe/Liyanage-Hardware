import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from "../api"

const BulkImportExport = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const response = await API.post('/products/bulk-import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(`Successfully imported ${response.data.importedCount} products`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Import failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/products/bulk-export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products_export.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success('Export completed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Export failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bulk Import/Export</h2>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Import Products</h3>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />
          <button
            onClick={handleImport}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? 'Importing...' : 'Import'}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Upload a CSV or Excel file with product data. Download the template for reference.
        </p>
      </div>

      <div>
        <h3 className="font-medium mb-2">Export Products</h3>
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isLoading ? 'Exporting...' : 'Export All Products'}
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Export all products to a CSV file.
        </p>
      </div>
    </div>
  );
};

export default BulkImportExport;