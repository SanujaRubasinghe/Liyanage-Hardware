import React, { useState } from 'react';
import BulkImportExport from '../components/BulkImportExport';
import BulkPriceAdjustment from '../components/BulkPriceAdjustment';
import BulkStockUpdate from '../components/BulkStockUpdate';
import BulkCategoryAssignment from '../components/BulkCategoryAssignment';
import BulkStatusChange from '../components/BulkStatusChange';
import BulkImageUpload from '../components/BulkImageUpload';
import { ToastContainer } from 'react-toastify';

const BulkOperationsPanel = () => {
  const [activeTab, setActiveTab] = useState('import');

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-6">Bulk Product Operations</h1>
      
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 ${activeTab === 'import' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('import')}
        >
          Import/Export
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'price' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('price')}
        >
          Price Adjustment
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'stock' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          Stock Update
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'category' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('category')}
        >
          Category Assignment
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'status' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          Status Change
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'images' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          Image Upload
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {activeTab === 'import' && <BulkImportExport />}
        {activeTab === 'price' && <BulkPriceAdjustment />}
        {activeTab === 'stock' && <BulkStockUpdate />}
        {activeTab === 'category' && <BulkCategoryAssignment />}
        {activeTab === 'status' && <BulkStatusChange />}
        {activeTab === 'images' && <BulkImageUpload />}
      </div>
    </div>
  );
};

export default BulkOperationsPanel;