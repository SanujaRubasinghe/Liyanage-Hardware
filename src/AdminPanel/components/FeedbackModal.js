// components/FeedbackModal.jsx
import React, { useState } from 'react';

const FeedbackModal = ({ isOpen, onClose, feedback, onStatusUpdate }) => {
    const [adminResponse, setAdminResponse] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    if (!isOpen || !feedback) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedStatus) {
            onStatusUpdate(feedback.id, selectedStatus, adminResponse || null);
            setAdminResponse('');
            setSelectedStatus('');
        }
    };

    const renderStars = (rating) => {
        if (!rating) return null;
        
        return (
            <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)} Details
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="px-6 py-4 space-y-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">{feedback.title}</h3>
                        {feedback.rating && renderStars(feedback.rating)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                        </label>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            {feedback.image_path && (
                                <div>
                                    <p className="text-gray-900 whitespace-pre-wrap"><span className='font-bold'>Name:</span> {feedback.first_name} {feedback.last_name}</p>
                                    <p className="text-gray-900 whitespace-pre-wrap"><span className='font-bold'>Email:</span> {feedback.email}</p>
                                    <p className="text-gray-900 whitespace-pre-wrap"><span className='font-bold'>Contact Number:</span> {feedback.phone}</p>
                                </div>
                            )}
                            <p className="text-gray-900 whitespace-pre-wrap"><span className='font-bold'>Complaint:</span> {feedback.content}</p>
                        </div>
                    </div>

                    {feedback.image_path && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Attached Image
                            </label>
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${feedback.image_path}`}
                                alt="Feedback attachment"
                                className="max-w-full h-auto rounded-lg border border-gray-300"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                feedback.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                feedback.status === 'approved' ? 'bg-green-100 text-green-800' :
                                feedback.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                                {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Date:</span>
                            <span className="ml-2 text-gray-600">
                                {new Date(feedback.created_at).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {feedback.admin_response && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Response
                            </label>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-gray-900 whitespace-pre-wrap">{feedback.admin_response}</p>
                                {feedback.responded_at && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Responded on: {new Date(feedback.responded_at).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Update Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select status...</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Response (Optional)
                            </label>
                            <textarea
                                value={adminResponse}
                                onChange={(e) => setAdminResponse(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add your response..."
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                            >
                                Update Feedback
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
