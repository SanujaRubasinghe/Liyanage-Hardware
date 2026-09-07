import React from 'react';
import { FlagIcon } from '@heroicons/react/outline';

const VisitsByCountry = ({ countries }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Visits by Country</h2>
      <div className="space-y-3">
        {countries.length > 0 ? (
          countries.map((country, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-400 mr-3">{index + 1}</span>
                <span className="mr-2">
                  {country.country_code && (
                    <span className={`fi fi-${country.country_code.toLowerCase()}`}></span>
                  )}
                </span>
                <span>{country.country}</span>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {country.visits} visits
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No country data available</p>
        )}
      </div>
    </div>
  );
};

export default VisitsByCountry;