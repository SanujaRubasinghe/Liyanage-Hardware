import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState({
        primary: [],
        secondary: [],
        tertiary: []
    });
    const [selectedPrimary, setSelectedPrimary] = useState('');
    const [selectedSecondary, setSelectedSecondary] = useState('');
    const [productImages, setProductImages] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        unit: '',
        stock_quantity: '',
        stock_alert_limit: '',
        category_id: '',
        sku: '',
        brand: '',
        weight: '',
        dimensions: '',
        is_active: true,
        is_on_offer: false
    });
    const [imageUpdates, setImageUpdates] = useState({
        primary: null,
        newImages: [],
        deletedImages: [],
        updatedImages: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productRes, primaryCategoriesRes] = await Promise.all([
                    API.get(`/products/${id}`),
                    API.get('/categories/primary')
                ]);
                
                const product = productRes.data;
                setCategories(prev => ({
                    ...prev,
                    primary: primaryCategoriesRes.data.categories
                }));

                // Find the category hierarchy for the current product
                let primaryId = '';
                let secondaryId = '';
                let tertiaryId = product.category_id;

                if (product.category) {
                    if (product.category.level === 'tertiary') {
                        // Fetch the hierarchy for tertiary category
                        const hierarchyRes = await API.get(`/categories/hierarchy/${product.category_id}`);
                        primaryId = hierarchyRes.data.primary_id;
                        secondaryId = hierarchyRes.data.secondary_id;
                        
                        // Fetch secondary categories for this primary
                        const secondaryRes = await API.get(`/categories/secondary?primary_id=${primaryId}`);
                        setCategories(prev => ({
                            ...prev,
                            secondary: secondaryRes.data.categories
                        }));
                        
                        // Fetch tertiary categories for this secondary
                        const tertiaryRes = await API.get(`/categories/tertiary?secondary_id=${secondaryId}`);
                        setCategories(prev => ({
                            ...prev,
                            tertiary: tertiaryRes.data.categories
                        }));
                    } else if (product.category.level === 'secondary') {
                        primaryId = product.category.parent_id;
                        secondaryId = product.category_id;
                        
                        // Fetch secondary categories for this primary
                        const secondaryRes = await API.get(`/categories/secondary?primary_id=${primaryId}`);
                        setCategories(prev => ({
                            ...prev,
                            secondary: secondaryRes.data.categories
                        }));
                    } else if (product.category.level === 'primary') {
                        primaryId = product.category_id;
                    }
                }

                setSelectedPrimary(primaryId);
                setSelectedSecondary(secondaryId);
                
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    unit: product.unit,
                    stock_quantity: product.stock_quantity,
                    stock_alert_limit: product.stock_alert_limit || '',
                    category_id: product.category_id,
                    sku: product.sku || '',
                    brand: product.brand || '',
                    weight: product.weight || '',
                    dimensions: product.dimensions || '',
                    is_active: product.is_active,
                    is_on_offer: Boolean(product.is_on_offer)
                });

                if (product.images && product.images.length > 0) {
                    setProductImages(product.images.map(img => ({
                        ...img,
                        url: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/${img.image_url}`,
                        isDeleted: false
                    })));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const fetchSecondaryCategories = async (primaryId) => {
        if (!primaryId) {
            setCategories(prev => ({
                ...prev,
                secondary: [],
                tertiary: []
            }));
            setSelectedSecondary('');
            setFormData(prev => ({
                ...prev,
                category_id: selectedPrimary // Set to primary if only primary selected
            }));
            return;
        }

        try {
            const { data } = await API.get(`/categories/secondary?primary_id=${primaryId}`);
            setCategories(prev => ({
                ...prev,
                secondary: data.categories,
                tertiary: []
            }));
            setSelectedSecondary('');
            setFormData(prev => ({
                ...prev,
                category_id: primaryId // Default to primary if no secondary selected
            }));
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch secondary categories!');
        }
    };

    const fetchTertiaryCategories = async (secondaryId) => {
        if (!secondaryId) {
            setCategories(prev => ({
                ...prev,
                tertiary: []
            }));
            setFormData(prev => ({
                ...prev,
                category_id: selectedPrimary // Fall back to primary if no secondary
            }));
            return;
        }

        try {
            const { data } = await API.get(`/categories/tertiary?secondary_id=${secondaryId}`);
            setCategories(prev => ({
                ...prev,
                tertiary: data.categories
            }));
            setFormData(prev => ({
                ...prev,
                category_id: secondaryId // Default to secondary if no tertiary selected
            }));
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch tertiary categories!');
        }
    };

    const handlePrimaryChange = (e) => {
        const value = e.target.value;
        setSelectedPrimary(value);
        fetchSecondaryCategories(value);
    };

    const handleSecondaryChange = (e) => {
        const value = e.target.value;
        setSelectedSecondary(value);
        fetchTertiaryCategories(value);
        setFormData(prev => ({
            ...prev,
            category_id: value // Update to selected secondary
        }));
    };

    const handleTertiaryChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            category_id: value // Update to selected tertiary
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePrimaryImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageUpdates(prev => ({
                ...prev,
                primary: file
            }));
        }
    };

    const handleAdditionalImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setImageUpdates(prev => ({
            ...prev,
            newImages: [...prev.newImages, ...files.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }))]
        }));
    };

    const markImageForDeletion = (imageId) => {
        setProductImages(prev => 
            prev.map(img => 
                img.image_id === imageId 
                    ? { ...img, isDeleted: true } 
                    : img
            )
        );
        setImageUpdates(prev => ({
            ...prev,
            deletedImages: [...prev.deletedImages, imageId]
        }));
    };

    const handleImageAltTextChange = (imageId, altText) => {
        setProductImages(prev => 
            prev.map(img => 
                img.image_id === imageId 
                    ? { ...img, alt_text: altText } 
                    : img
            )
        );
        setImageUpdates(prev => ({
            ...prev,
            updatedImages: [
                ...prev.updatedImages.filter(img => img.image_id !== imageId),
                { image_id: imageId, alt_text: altText }
            ]
        }));
    };

    const setPrimaryImage = (imageId) => {
        setProductImages(prev => 
            prev.map(img => ({
                ...img,
                is_primary: img.image_id === imageId ? 1 : 0
            }))
        );
        setImageUpdates(prev => ({
            ...prev,
            updatedImages: [
                ...prev.updatedImages.filter(img => img.image_id !== imageId),
                { image_id: imageId, is_primary: 1 }
            ]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Create FormData object
            const formDataToSend = new FormData();

            // Append all product data fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    if (typeof formData[key] === 'boolean') {
                        formDataToSend.append(key, formData[key] ? 1 : 0);
                    } else {
                        formDataToSend.append(key, formData[key]);
                    }
                }
            });

            // Handle primary image update
            if (imageUpdates.primary) {
                formDataToSend.append('primary_image', imageUpdates.primary);
            }

            // Handle new additional images
            imageUpdates.newImages.forEach((image, index) => {
                formDataToSend.append('additional_images', image.file);
            });

            if (imageUpdates.deletedImages.length > 0) {
                formDataToSend.append('deleted_images', JSON.stringify(imageUpdates.deletedImages));
            } 

            if (imageUpdates.updatedImages.length > 0) {
                formDataToSend.append('image_updates', JSON.stringify(imageUpdates.updatedImages));
            }

            // Send the request
            const response = await API.put(`/products/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Product updated successfully');
            navigate('/products');
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error(error.response?.data?.message || 'Failed to update product');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Product</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primary Category *
                            </label>
                            <select
                                value={selectedPrimary}
                                onChange={handlePrimaryChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select primary category</option>
                                {categories.primary.map((cat) => (
                                    <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedPrimary && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Secondary Category
                                </label>
                                <select
                                    value={selectedSecondary}
                                    onChange={handleSecondaryChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select secondary category (optional)</option>
                                    {categories.secondary.map((cat) => (
                                        <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {selectedSecondary && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tertiary Category
                                </label>
                                <select
                                    onChange={handleTertiaryChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select tertiary category (optional)</option>
                                    {categories.tertiary.map((cat) => (
                                        <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Unit *
                            </label>
                            <input
                                type="text"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Stock Alert Limit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Alert Limit
                            </label>
                            <input
                                type="number"
                                name="stock_alert_limit"
                                value={formData.stock_alert_limit}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* SKU */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                SKU
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brand
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Dimensions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dimensions (L×W×H)
                            </label>
                            <input
                                type="text"
                                name="dimensions"
                                value={formData.dimensions}
                                onChange={handleChange}
                                placeholder="e.g., 10×5×2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                                Active
                            </label>
                        </div>

                        {/* Offer Section Toggle */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_on_offer"
                                checked={formData.is_on_offer}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                                Show in "Offer Items" homepage section
                            </label>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    {/* Primary Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Image
                        </label>
                        <div className="mt-1 flex items-center">
                            {productImages.find(img => img.is_primary === 1 && !img.isDeleted) ? (
                                <img
                                    src={productImages.find(img => img.is_primary === 1 && !img.isDeleted).url}
                                    alt="Primary"
                                    className="h-32 w-32 object-cover rounded-md mr-4"
                                />
                            ) : imageUpdates.primary ? (
                                <img
                                    src={URL.createObjectURL(imageUpdates.primary)}
                                    alt="New primary"
                                    className="h-32 w-32 object-cover rounded-md mr-4"
                                />
                            ) : null}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePrimaryImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    {/* Existing Images */}
                    {productImages.filter(img => !img.isDeleted).length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Existing Images
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {productImages.filter(img => !img.isDeleted).map((image) => (
                                    <div key={image.image_id} className="relative group">
                                        <img
                                            src={image.url}
                                            alt={image.alt_text || 'Product image'}
                                            className="h-24 w-24 object-cover rounded-md"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex flex-col justify-between p-2">
                                            <button
                                                type="button"
                                                onClick={() => markImageForDeletion(image.image_id)}
                                                className="self-end bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setPrimaryImage(image.image_id)}
                                                    className={`p-1 rounded-full ${image.is_primary === 1 ? 'bg-green-500' : 'bg-blue-500'} text-white`}
                                                    title={image.is_primary === 1 ? 'Primary image' : 'Set as primary'}
                                                >
                                                    {image.is_primary === 1 ? '✓' : '★'}
                                                </button>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            value={image.alt_text || ''}
                                            onChange={(e) => handleImageAltTextChange(image.image_id, e.target.value)}
                                            placeholder="Alt text"
                                            className="w-full mt-1 px-2 py-1 text-xs border rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Additional Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add More Images
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {imageUpdates.newImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image.preview}
                                        alt={`New image ${index + 1}`}
                                        className="h-24 w-24 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setImageUpdates(prev => ({
                                            ...prev,
                                            newImages: prev.newImages.filter((_, i) => i !== index)
                                        }))}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAdditionalImagesChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/products')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {submitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
