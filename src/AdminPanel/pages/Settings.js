import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Appearance</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Theme</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Choose between light and dark mode
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 