import React, { useEffect, useState } from 'react';
import API from '../api';

export default function LowStockAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const getLowStockProducts = async () => {
      const {data} = await API.get("/products/low-stock")
      setAlerts(data)
    }
    getLowStockProducts()
  }, []);

  return (
    <div className="p-6 bg-red-50 border-l-4 border-red-400 rounded-md">
      <h2 className="text-xl font-semibold text-red-700 mb-3">Low Stock Alerts</h2>
      {alerts.length === 0 ? (
        <p className="text-green-700">All products are sufficiently stocked.</p>
      ) : (
        <ul className="list-disc list-inside">
          {alerts.map(a => (
            <li key={a.id}>
              {a.name} <span className="text-sm text-gray-500">(SKU: {a.sku})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
