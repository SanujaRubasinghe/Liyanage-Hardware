import { formatCurrency } from '../utils/formatCurrency';

const OrderSummaryCards = ({ data }) => {
  if (!data) return null;

  const cards = [
    {
      title: 'Total Orders',
      value: data.total_orders.value,
      change: `${data.total_orders.percent_change}%`,
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
      ),
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Revenue',
      value: `${formatCurrency(data.total_revenue.value)}`,
      change: `${data.total_revenue.percent_change}%`,
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      bgColor: 'bg-green-50'
    },
    {
      title: 'Completed Orders',
      value: data.completed_orders.value,
      change: `${data.completed_orders.percent_change}%`,
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      ),
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg. Order Value',
      value: `${formatCurrency(data.avg_order_value.value)}`,
      change: `${data.avg_order_value.percent_change}%`,
      icon: (
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
        </svg>
      ),
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} p-6 rounded-lg shadow`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">{card.value}</p>
              <p className="text-sm text-green-600 mt-1">{card.change} from last month</p>
            </div>
            <div>{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSummaryCards;