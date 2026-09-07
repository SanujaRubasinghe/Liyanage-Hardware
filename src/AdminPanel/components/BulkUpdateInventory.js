import React, { useEffect, useState } from 'react';
import API from '../api';

export default function BulkUpdateInventory() {
  const [products, setProducts] = useState([]);
  const [updates, setUpdates] = useState({});

  useEffect(() => {
    const getProducts = async () => {
        const {data} = await API.get(`/products`)
        setProducts(data)
    }
    getProducts()
  }, []);

  const handleChange = (id, value) => {
    setUpdates(prev => ({ ...prev, [id]: { ...prev[id], price: value } }));
  };

  const submitUpdates = async () => {
    const updateList = Object.entries(updates).map(([id, val]) => ({
      product_id: id,
      price: parseFloat(val.price),
    }));

    const res = await API.post('/products/bulk-update', JSON.stringify(updateList))
    alert('bulk update successful')
  };

  return (
    <div className="p-6 bg-white shadow rounded-md">
      <h2 className="text-xl font-bold mb-4">Bulk Update Inventory</h2>
      <div className="space-y-4">
        {products.map(p => (
          <div key={p.id} className="flex items-center gap-4">
            <label className="w-1/3 font-medium">{p.name}</label>
            <input
              type="number"
              className="border border-gray-300 rounded px-3 py-1 w-1/3"
              defaultValue={p.price}
              onChange={(e) => handleChange(p.product_id, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button
        onClick={submitUpdates}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Bulk Update
      </button>
    </div>
  );
}
