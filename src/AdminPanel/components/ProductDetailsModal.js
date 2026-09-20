import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { FiX, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi';
import API from '../api';
import { toast } from 'react-toastify';

const ProductDetailsModal = ({ product, onClose, onDelete, onUpdate }) => {
    const navigate = useNavigate();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState(() => {
        // Initialize images array with primary image and additional images
        const primaryImage = product.primary_image ? {
            url: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/${product.primary_image}`,
            path: product.primary_image,
            isPrimary: true
        } : null;

        const additionalImages = (product.images || []).map(img => ({
            url: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/${img}`,
            path: img,
            isPrimary: false
        }));

        return [primaryImage, ...additionalImages].filter(Boolean);
    });

    const handleEdit = () => {
        navigate(`/products/edit/${product.product_id}`);
        onClose();
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            onDelete(product.product_id);
            onClose();
        }
    };

    const handleRemoveImage = async (index) => {
        const imageToRemove = images[index];
        if (!imageToRemove) return;

        if (imageToRemove.isPrimary) {
            toast.error('Cannot remove primary image. Please set another image as primary first.');
            return;
        }

        try {
            setLoading(true);
            await API.delete(`/products/${product.product_id}/images`, {
                data: { image_path: imageToRemove.path }
            });

            // Update local state
            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);
            
            // If we removed the currently selected image, adjust the index
            if (selectedImageIndex >= newImages.length) {
                setSelectedImageIndex(newImages.length - 1);
            }

            toast.success('Image removed successfully');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error removing image:', error);
            toast.error('Failed to remove image');
        } finally {
            setLoading(false);
        }
    };

    const handleSetPrimary = async (index) => {
        const imageToSet = images[index];
        if (!imageToSet || imageToSet.isPrimary) return;

        try {
            setLoading(true);
            await API.put(`/products/${product.product_id}/primary-image`, {
                product_id: product.product_id,
                new_primary_image_path: imageToSet.path,
                current_primary_image_path: product.primary_image
            });

            // Update local state
            const newImages = images.map((img, i) => ({
                ...img,
                isPrimary: i === index
            }));
            setImages(newImages);
            setSelectedImageIndex(index);

            toast.success('Primary image updated successfully');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating primary image:', error);
            toast.error('Failed to update primary image');
        } finally {
            setLoading(false);
        }
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (images.length === 0) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{product.name}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                    <div className="p-8 text-center">
                        <FiImage size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-300">No images available for this product</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{product.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col md:flex-row h-[calc(90vh-8rem)]">
                    {/* Image Gallery */}
                    <div className="md:w-2/3 p-4 relative">
                        <div className="relative h-full">
                            {/* Main Image */}
                            <div className="relative h-[calc(100%-100px)]">
                                <img
                                    src={images[selectedImageIndex].url}
                                    alt={product.name}
                                    className="w-full h-full object-contain rounded-lg"
                                />
                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            <FiChevronLeft size={24} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            <FiChevronRight size={24} />
                                        </button>
                                    </>
                                )}
                                {/* Image Actions */}
                                <div className="absolute top-2 right-2 flex space-x-2">
                                    {!images[selectedImageIndex].isPrimary && (
                                        <button
                                            onClick={() => handleSetPrimary(selectedImageIndex)}
                                            disabled={loading}
                                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                            title="Set as primary image"
                                        >
                                            <FiImage size={20} />
                                        </button>
                                    )}
                                    {!images[selectedImageIndex].isPrimary && (
                                        <button
                                            onClick={() => handleRemoveImage(selectedImageIndex)}
                                            disabled={loading}
                                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                                            title="Remove image"
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* Thumbnail Gallery */}
                            <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                            selectedImageIndex === index
                                                ? 'border-blue-500'
                                                : 'border-transparent'
                                        }`}
                                    >
                                        <button
                                            onClick={() => setSelectedImageIndex(index)}
                                            className="w-full h-full"
                                        >
                                            <img
                                                src={image.url}
                                                alt={`${product.name} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                        {image.isPrimary && (
                                            <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
                                                Primary
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="md:w-1/3 p-4 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                    Product Information
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">SKU:</span> {product.sku}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Category:</span> {product.category_name}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Price:</span> {formatCurrency(product.price)}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Stock:</span> {product.stock_quantity}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Status:</span>{' '}
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${
                                                product.is_active
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}
                                        >
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                    Description
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                    {product.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-4 pt-4">
                                <button
                                    onClick={handleEdit}
                                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <FiEdit2 className="mr-2" />
                                    Edit Product
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <FiTrash2 className="mr-2" />
                                    Delete Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal; 
