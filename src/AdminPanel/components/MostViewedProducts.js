const MostViewedProducts = ({ products }) => {
  return (
    <div className="space-y-4">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.product_id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded mr-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">ID: {product.product_id}</p>
              </div>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {product.views} views
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">No product views data available</p>
      )}
    </div>
  );
};

export default MostViewedProducts;