const LiveActivities = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'pageVisit':
        return '🌐';
      case 'productView':
        return '👀';
      case 'cartAction':
        return '🛒';
      case 'searchQuery':
        return '🔍';
      case 'checkout':
        return '💰';
      default:
        return '⚡';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="border rounded-lg divide-y">
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <div key={index} className="p-4 flex items-start hover:bg-gray-50">
            <span className="text-2xl mr-3">{getActivityIcon(activity.type)}</span>
            <div className="flex-1">
              <p className="font-medium">{activity.message}</p>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                {activity.device && (
                  <span className="capitalize mr-2">{activity.device}</span>
                )}
                <span>{formatTime(activity.timestamp)}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-6 text-center text-gray-500">
          No recent activities. Activities will appear here in real-time.
        </div>
      )}
    </div>
  );
};

export default LiveActivities;