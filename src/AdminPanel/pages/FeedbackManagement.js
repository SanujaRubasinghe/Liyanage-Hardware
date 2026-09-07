// components/FeedbackManagement.jsx
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import FeedbackList from '../components/FeedbackList';
import FeedbackModal from '../components/FeedbackModal';
import FeedbackFilters from '../components/FeedbackFilters';
import FeedbackAnalytics from '../components/FeedbackAnalytics';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api';

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        page: 1,
        limit: 10
    });
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        fetchFeedbacks();
        setupSocketConnection();
        
        return () => {
            if (window.socket) {
                window.socket.disconnect();
            }
        };
    }, [filters]);

    const setupSocketConnection = () => {
        const socket = io('http://localhost:5000');
        window.socket = socket;
        
        socket.on('newFeedback', (feedback) => {
            toast.success(
                `New ${feedback.type} received: ${feedback.title}`,
                {
                    position: "top-right",
                    autoClose: 5000,
                    onClick: () => {
                        setFilters(prev => ({ ...prev, page: 1 }));
                        fetchFeedbacks();
                    }
                }
            );
            
            // Refresh the list if we're on the first page
            if (filters.page === 1) {
                fetchFeedbacks();
            }
        });
    };

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await API.get(`/feedback?${queryParams}`);
            
            setFeedbacks(response.data.feedbacks);
            setPagination(response.data.pagination);
        } catch (error) {
            toast.error('Failed to fetch feedbacks');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status, adminResponse = null) => {
        try {
            const response = await API.put(`/feedback/${id}`, {
                    status,
                    admin_response: adminResponse,
                    is_visible: status === 'approved' && filters.type === 'review'
            });

            if (response.status === 200) {
                toast.success('Feedback updated successfully');
                fetchFeedbacks();
                setIsModalOpen(false);
            } else {
                toast.error('Failed to update feedback');
            }
        } catch (error) {
            toast.error('Error updating feedback');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) {
            return;
        }

        try {
            const response = await API.delete(`/feedback/${id}`);

            if (response.status === 200) {
                toast.success('Feedback deleted successfully');
                fetchFeedbacks();
            } else {
                toast.error('Failed to delete feedback');
            }
        } catch (error) {
            toast.error('Error deleting feedback');
        }
    };

    const handleViewDetails = (feedback) => {
        setSelectedFeedback(feedback);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <FeedbackAnalytics />
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Feedback Management
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage user complaints and reviews
                        </p>
                    </div>

                    <FeedbackFilters 
                        filters={filters}
                        onFiltersChange={setFilters}
                    />

                    <FeedbackList
                        feedbacks={feedbacks}
                        loading={loading}
                        pagination={pagination}
                        onStatusUpdate={handleStatusUpdate}
                        onDelete={handleDelete}
                        onViewDetails={handleViewDetails}
                        onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                    />
                </div>
            </div>

            <FeedbackModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                feedback={selectedFeedback}
                onStatusUpdate={handleStatusUpdate}
            />

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="mt-16"
            />
        </div>
    );
};

export default FeedbackManagement;
