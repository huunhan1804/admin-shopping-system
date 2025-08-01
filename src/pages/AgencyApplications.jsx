import React, { useState, useEffect } from 'react';
import { FileText, Clock, Search, Store, RefreshCw, ArrowLeft } from 'lucide-react';
import apiService from '../services/api';

const AgencyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        hasNext: false,
        hasPrevious: false
    });

    useEffect(() => {
        loadApplications();
    }, [pagination.currentPage]);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: pagination.currentPage,
                size: 12, // Grid layout hoạt động tốt hơn với bội số của 3 hoặc 4
                sortBy: 'submittedDate',
                sortDir: 'desc'
            });

            const data = await apiService.get(`/admin/users/agencies/applications?${queryParams}`);
            
            if (data.success) {
                setApplications(data.applications);
                setPagination({
                    currentPage: data.currentPage,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    hasNext: data.hasNext,
                    hasPrevious: data.hasPrevious
                });
            }
        } catch (error) {
            console.error('Lỗi khi tải đơn đăng ký:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handleViewApplication = (applicationId) => {
        window.location.href = `/users/agencies/applications/${applicationId}`;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center">
                    <FileText className="mr-2" />
                    Đơn đăng ký Agency chờ duyệt
                    <span className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                        {pagination.totalElements}
                    </span>
                </h1>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => window.location.href = '/users/agencies'}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <Store className="w-4 h-4 mr-1" />
                        Quản lý Agency
                    </button>
                    <button 
                        onClick={loadApplications}
                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Làm mới
                    </button>
                </div>
            </div>

            {/* Applications Grid */}
            {!loading && applications.length > 0 && (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {applications.map((application) => (
                            <div key={application.applicationId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 hover:border-blue-300">
                                <div className="relative p-6">
                                    {/* Pending Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Chờ duyệt
                                        </span>
                                    </div>

                                    {/* Shop Name */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pr-20">
                                        {application.shopName}
                                    </h3>

                                    {/* Applicant Information */}
                                    <div className="mb-4">
                                        <h4 className="text-blue-600 font-medium mb-2 flex items-center">
                                            <i className="fas fa-user mr-2"></i>
                                            Thông tin người đăng ký
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                            <div className="font-medium">{application.fullNameApplicant}</div>
                                            <div className="text-gray-600 flex items-center">
                                                <i className="fas fa-envelope w-4 mr-1"></i>
                                                {application.email}
                                            </div>
                                            <div className="text-gray-600 flex items-center">
                                                <i className="fas fa-phone w-4 mr-1"></i>
                                                {application.phone}
                                            </div>
                                            <div className="text-gray-600 flex items-center">
                                                <i className="fas fa-id-card w-4 mr-1"></i>
                                                {application.idCardNumber}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shop Information */}
                                    <div className="mb-4">
                                        <h4 className="text-green-600 font-medium mb-2 flex items-center">
                                            <Store className="w-4 h-4 mr-2" />
                                            Thông tin Shop
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                            <div className="text-gray-600 flex items-center">
                                                <i className="fas fa-envelope w-4 mr-1"></i>
                                                {application.shopEmail}
                                            </div>
                                            <div className="text-gray-600 flex items-center">
                                                <i className="fas fa-phone w-4 mr-1"></i>
                                                {application.shopPhone}
                                            </div>
                                            <div className="text-gray-600 flex items-center">
                                                <i className="fas fa-hashtag w-4 mr-1"></i>
                                                {application.taxNumber}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Documents */}
                                    <div className="mb-4">
                                        <h4 className="text-purple-600 font-medium mb-2 flex items-center">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Giấy tờ đính kèm
                                        </h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {application.idCardFrontImageUrl && (
                                                <div className="relative">
                                                    <img
                                                        src={application.idCardFrontImageUrl}
                                                        alt="CCCD mặt trước"
                                                        className="w-full h-16 object-cover rounded border border-gray-300"
                                                        title="CCCD mặt trước"
                                                    />
                                                </div>
                                            )}
                                            {application.idCardBackImageUrl && (
                                                <div className="relative">
                                                    <img
                                                        src={application.idCardBackImageUrl}
                                                        alt="CCCD mặt sau"
                                                        className="w-full h-16 object-cover rounded border border-gray-300"
                                                        title="CCCD mặt sau"
                                                    />
                                                </div>
                                            )}
                                            {application.businessLicenseUrls && (
                                                <div className="flex items-center justify-center h-16 bg-gray-50 rounded border border-gray-300">
                                                    <i className="fas fa-file-pdf text-2xl text-red-500"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submission Date */}
                                    <div className="mb-4 text-sm text-gray-500">
                                        <i className="fas fa-calendar mr-1"></i>
                                        Nộp ngày: {new Date(application.submittedDate).toLocaleString('vi-VN')}
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleViewApplication(application.applicationId)}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <Search className="w-4 h-4 mr-2" />
                                        Xem chi tiết & Duyệt
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPrevious}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trước
                                </button>
                                
                                {[...Array(pagination.totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            index === pagination.currentPage
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNext}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sau
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center h-64">
                    <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-gray-600">Đang tải đơn đăng ký...</span>
                </div>
            )}

            {/* Empty State */}
            {!loading && applications.length === 0 && (
                <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                        <i className="fas fa-clipboard-check text-6xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn đăng ký chờ duyệt</h3>
                    <p className="text-gray-500 mb-4">Tất cả đơn đăng ký đã được xử lý.</p>
                    <button 
                        onClick={() => window.location.href = '/users/agencies'}
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <Store className="w-4 h-4 mr-2" />
                        Quản lý Agency
                    </button>
                </div>
            )}
        </div>
    );
};

export default AgencyApplications;