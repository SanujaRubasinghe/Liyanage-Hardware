// AddScheduleModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AddScheduleModal = ({ onClose, onSave }) => {
  const [schedule, setSchedule] = useState({
    start_datetime: '',
    end_datetime: '',
    is_active: true,
    created_by: 1 // In a real app, this would be the logged-in user's ID
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSchedule(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(schedule);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Add New Schedule</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="start_datetime">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="start_datetime"
                  name="start_datetime"
                  value={schedule.start_datetime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="end_datetime">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="end_datetime"
                  name="end_datetime"
                  value={schedule.end_datetime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={schedule.is_active}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="ml-2 text-gray-700">
                  Active
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Save Schedule
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddScheduleModal;