import React from 'react';

const VisitsByCity = ({ cities }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Top Cities</h2>
      <div className="space-y-4">
        {cities.length > 0 ? (
          cities.map((city, index) => (
            <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <span className="text-gray-400 mr-3">{index + 1}</span>
                <div>
                  <p className="font-medium">{city.city}, {city.country}</p>
                  <p className="text-sm text-gray-500">
                    {city.unique_visitors} unique visitors
                  </p>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {city.visits} visits
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No city data available</p>
        )}
      </div>
    </div>
  );
};

export default VisitsByCity;