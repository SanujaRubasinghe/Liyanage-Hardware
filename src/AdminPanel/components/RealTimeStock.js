import React, { useEffect, useState } from 'react';

export default function RealTimeStock() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Real-Time Stock</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Price</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Last Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map(p => (
            <tr key={p.id}>
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">${p.price}</td>
              <td className="px-4 py-2">{p.last_updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
