import React, { useState, useEffect } from 'react';
import RealTimeStock from '../components/RealTimeStock';
import LowStockAlerts from '../components/LowStockAlerts';
import BulkUpdateInventory from '../components/BulkUpdateInventory';

import API from '../api';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    const getProducts = async () => {
        const {data} = await API.get(`/products?page=${currentPage}&limit=${productsPerPage}`)
        console.log(data)
        setProducts(data)
    }
    getProducts()
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Product Pagination Display */}
      <div className="bg-white shadow-md rounded-md p-4">
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        <ul className="divide-y divide-gray-200">
          {currentProducts.map(p => (
            <li key={p.id} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-gray-600 text-sm">SKU: {p.sku}</p>
                  <p className="text-gray-800 mt-1">Price: ${p.price}</p>
                </div>
                <img src={p.images[0]} alt={p.name} className="w-20 h-20 object-cover rounded" />
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
