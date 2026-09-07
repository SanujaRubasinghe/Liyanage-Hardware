const PopularSearches = ({ searches }) => {
  return (
    <div className="space-y-3">
      {searches.length > 0 ? (
        searches.map((search, index) => (
          <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
            <div className="flex items-center">
              <span className="text-gray-400 mr-3">{index + 1}</span>
              <p className="font-medium truncate max-w-xs">{search.query}</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {search.searches}
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">No search data available</p>
      )}
    </div>
  );
};

export default PopularSearches;