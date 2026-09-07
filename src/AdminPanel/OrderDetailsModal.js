import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react'; // Optional: close icon
import React from 'react';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold text-gray-800 mb-4">🧾 New Order Details</h2>
          
          <div className="space-y-2 text-sm text-gray-700">
            <div><strong>🧑 Customer:</strong> {order.customer}</div>
            <div><strong>📦 Items:</strong> {order.items?.length || 0}</div>
            <div><strong>💵 Total:</strong> Rs.{Number(order.total).toFixed(2)}</div>
            <div><strong>⏱️ Time:</strong> {order.time}</div>
            <div><strong>📍 Address:</strong> {order.address}</div>
            {/* Add more fields like payment method, delivery type, etc. */}
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderDetailsModal;
