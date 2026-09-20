// src/components/OrderDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { formatCurrency } from '../utils/formatCurrency';
import API from '../api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-yellow-100 text-orange-800'
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await API.get(`/orders/${id}`);
        const data = response.data;
        
        if (response.status === 200) {
          setOrder(data);
        } else {
          setError(data.error || 'Failed to fetch order');
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Failed to fetch order');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await API.put(`/orders/${id}/status`, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-red-500">{error}</div>
        <Link to="/orders" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order #{order.order_id}</h1>
          <p className="text-gray-500">
            Placed on {format(new Date(order.order_date), 'MMMM dd, yyyy HH:mm')}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
            {order.status}
          </span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Customer Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Customer:</span> {`${order.first_name} ${order.last_name}`}</p>
            <p><span className="font-medium">Email:</span> {order.email}</p>
            <p><span className="font-medium">Phone:</span> {order.phone}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
          <address className="not-italic">
            {order.shipping_address.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </address>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Payment Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Method:</span> {order.payment_method}</p>
            <p><span className="font-medium">Status:</span> {order.payment_status}</p>
            <p><span className="font-medium">Amount:</span> {formatCurrency(order.total_amount)}</p>
            {order.tracking_number && (
              <p><span className="font-medium">Tracking:</span> {order.tracking_number}</p>
            )}
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Order Items</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.items.map((item) => (
              <tr key={item.order_item_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {item.image_url && (
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md" src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/${item.image_url}`} alt={item.product_name} />
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.product_name || `Product #${item.product_id}`}
                      </div>
                      <div className="text-sm text-gray-500">SKU: {item.product_id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.unit_price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                Subtotal
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(order.total_amount - order.shipping_cost)}
              </td>
            </tr>
            <tr>
              <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                Shipping
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(order.shipping_cost)}
              </td>
            </tr>
            <tr>
              <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(order.total_amount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {order.notes && (
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">Order Notes</h3>
          <p className="mt-1 text-sm text-yellow-700">{order.notes}</p>
        </div>
      )}
      
      <div className="mt-6">
        <Link to="/orders/list" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          Back to orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetail;
