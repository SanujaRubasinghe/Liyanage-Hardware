import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { FiPackage, FiDollarSign, FiAlertTriangle, FiTrendingUp, FiSearch} from 'react-icons/fi';
import API from '../api';
import {formatCurrency} from '../utils/formatCurrency'
import { toast } from 'react-hot-toast';
import ProductDetailsModal from '../components/ProductDetailsModal';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [groupByCategory, setGroupByCategory] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [currentPage, groupByCategory]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch products with search and grouping parameters
            const productsRes = await API.get(`/products?page=${currentPage}&search=${searchTerm}&group=${groupByCategory}`);
            setProducts(productsRes.data.products);
            setTotalPages(productsRes.data.pages);
            
            // Fetch stats
            const statsRes = await API.get('/products/stats');
            setStats(statsRes.data);
            
            // Fetch performance data
            const perfRes = await API.get('/products/performance');
            setPerformance(perfRes.data);
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page when searching
        fetchData();
    };

    const handleEdit = (productId) => {
        navigate(`/products/edit/${productId}`);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`/products/${productId}`);
                toast.success('Product deleted successfully');
                fetchData();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) {
            toast.error('No products selected');
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
            try {
                await API.post('/products/bulk-delete', { productIds: selectedProducts });
                toast.success(`${selectedProducts.length} products deleted successfully`);
                setSelectedProducts([]);
                fetchData();
            } catch (error) {
                console.error('Error deleting products:', error);
                toast.error('Failed to delete products');
            }
        }
    };

    const toggleProductSelection = (productId) => {
        setSelectedProducts(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map(p => p.product_id));
        }
    };

    const handleProductUpdate = () => {
        fetchData(); // Refresh the product list after updates
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Product Management</h1>
                <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                    <Link
                        to="/products/new"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                    >
                        Add New Product
                    </Link>
                    <Link
                        to="/products/bulk"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                    >
                        Bulk Operations
                    </Link>
                </div>
            </div>

            {/* Statistics Cards - Responsive Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <StatCard 
                    icon={<FiPackage className="text-blue-500" size={20} />}
                    title="Total Products"
                    value={stats.products.total}
                    change={`${stats.products.total_change_percent}%`}
                    color="bg-blue-50"
                />
                <StatCard 
                    icon={<FiDollarSign className="text-green-500" size={20} />}
                    title="Inventory Value"
                    value={`${formatCurrency(stats?.inventory.value || 0)}`}
                    change={`${stats.inventory.value_change_percent}%`}
                    color="bg-green-50"
                />
                <StatCard 
                    icon={<FiAlertTriangle className="text-yellow-500" size={20} />}
                    title="Low Stock Items"
                    value={stats?.stock.low_stock_items}
                    change="+2"
                    color="bg-yellow-50"
                />
                <StatCard 
                    icon={<FiTrendingUp className="text-purple-500" size={20} />}
                    title="Monthly Revenue"
                    value={`${formatCurrency(stats?.sales.total_revenue || 0)}`}
                    change={`${stats.sales.revenue_times_value}x`}
                    color="bg-purple-50"
                />
            </div>
            
            {/* Search and Filter Section */}
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-4 sm:mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    <form onSubmit={handleSearch} className="flex items-center">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        <button 
                            type="submit"
                            className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            onClick={() => fetchData()}
                        >
                            Search
                        </button>
                    </form>
                    
                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    className="sr-only" 
                                    checked={groupByCategory}
                                    onChange={() => setGroupByCategory(!groupByCategory)}
                                />
                                <div className={`block w-10 h-6 rounded-full ${groupByCategory ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${groupByCategory ? 'transform translate-x-4' : ''}`}></div>
                            </div>
                            <div className="ml-2 text-sm sm:text-base font-medium text-gray-700">
                                Group by Category
                            </div>
                        </label>
                    </div>
                    
                    {selectedProducts.length > 0 && (
                        <div className="flex items-center justify-end">
                            <button
                                onClick={handleBulkDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                                {/* <Trash2 className="mr-1" size={16} /> */}
                                Delete Selected ({selectedProducts.length})
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            
            
            {/* Products Table - Responsive */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-4 sm:mb-6">
                <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold">
                        {groupByCategory ? 'Products Grouped by Category' : 'All Products'}
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedProducts.length === products.length && products.length > 0}
                                        onChange={toggleSelectAll}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xs:table-cell">Status</th>
                                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <React.Fragment key={product.product_id}>
                                    {groupByCategory && product.category_header && (
                                        <tr className="bg-gray-50">
                                            <td colSpan="8" className="px-3 sm:px-4 py-2 font-semibold text-gray-900">
                                                {product.category_name} ({product.product_count} products)
                                            </td>
                                        </tr>
                                    )}
                                    {!product.category_header && (
                                    <tr 
                                        onClick={() => handleProductClick(product)}
                                        className="cursor-pointer hover:bg-gray-50"
                                    >
                                        <td className="px-3 sm:px-4 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedProducts.includes(product.product_id)}
                                                onChange={() => toggleProductSelection(product.product_id)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-3 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                            {product.product_id}
                                        </td>
                                        <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                                    <img 
                                                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-md" 
                                                        src={`${process.env.REACT_APP_API_BASE_URL}/${product.primary_image}` || 'https://via.placeholder.com/40'} 
                                                        alt={product.name} 
                                                    />
                                                </div>
                                                <div className="ml-2 sm:ml-3">
                                                    <div className="text-xs sm:text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-xs text-gray-500 hidden xs:block">{product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                                            {product.category_name}
                                        </td>
                                        <td className="px-3 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                                            {formatCurrency(product.price)}
                                        </td>
                                        <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                                            <div className="text-xs sm:text-sm text-gray-900">{product.stock_quantity}</div>
                                            {product.stock_quantity <= product.stock_alert_limit && (
                                                <div className="text-xs text-yellow-600">Low stock</div>
                                            )}
                                        </td>
                                        <td className="px-3 sm:px-4 py-2 whitespace-nowrap hidden xs:table-cell">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm font-medium">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(product.product_id);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900 mr-2 sm:mr-3 text-xs sm:text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(product.product_id);
                                                }}
                                                className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="text-xs sm:text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * 20 + 1}</span> to <span className="font-medium">{Math.min(currentPage * 20, stats.products.total)}</span> of <span className="font-medium">{stats.products.total}</span> products
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 sm:px-4 py-1 sm:py-2 border rounded-md text-xs sm:text-sm ${currentPage === 1 ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 sm:px-4 py-1 sm:py-2 border rounded-md text-xs sm:text-sm ${currentPage === totalPages ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Details Modal */}
            {selectedProduct && (
                <ProductDetailsModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                    onDelete={handleDelete}
                    onUpdate={handleProductUpdate}
                />
            )}
        </div>
    );
};

// StatCard component remains the same
const StatCard = ({ icon, title, value, change, color }) => {
    return (
        <div className={`${color} p-3 sm:p-4 rounded-lg shadow`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mt-1">{value}</p>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded-full">
                    {icon}
                </div>
            </div>
            <div className="mt-2 sm:mt-3">
                <span className="text-xs sm:text-sm font-medium text-green-600">{change}</span>
                <span className="text-xs sm:text-sm text-gray-500 ml-1">vs last month</span>
            </div>
        </div>
    );
};

export default ProductManagement;