const DeviceDistributionChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.device_type}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium capitalize">{item.device_type}</span>
            <span className="text-sm text-gray-500">{Math.round((item.count / total) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                item.device_type === 'desktop' ? 'bg-blue-600' : 
                item.device_type === 'mobile' ? 'bg-green-600' : 'bg-purple-600'
              }`} 
              style={{ width: `${(item.count / total) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeviceDistributionChart;