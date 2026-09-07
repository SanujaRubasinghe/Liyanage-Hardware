const StatCard = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <span className="text-blue-600 text-xl">{icon}</span>
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          {trend === 'up' ? (
            <>
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span className="text-green-500 text-sm ml-1">Up from yesterday</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="text-red-500 text-sm ml-1">Down from yesterday</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;