// ScheduleList.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ScheduleList = ({ schedules, onUpdate, onDelete }) => {
  if (schedules.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
        No schedules found. Add a schedule to control when this banner appears.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <motion.div
          key={schedule.schedule_id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white border rounded-lg p-4 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${schedule.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className="font-medium">
                  {new Date(schedule.start_datetime).toLocaleString()} - {new Date(schedule.end_datetime).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Created by: User #{schedule.created_by}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onUpdate(schedule.schedule_id, { is_active: !schedule.is_active })}
                className={`p-2 rounded-full ${schedule.is_active ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}
              >
                {schedule.is_active ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => onDelete(schedule.schedule_id)}
                className="p-2 rounded-full bg-red-100 text-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ScheduleList;