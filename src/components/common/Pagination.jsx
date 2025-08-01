// components/common/Pagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showPages = 5 
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const halfShow = Math.floor(showPages / 2);
    
    let startPage = Math.max(0, currentPage - halfShow);
    let endPage = Math.min(totalPages - 1, currentPage + halfShow);
    
    // Adjust if we're near the beginning or end
    if (currentPage < halfShow) {
      endPage = Math.min(totalPages - 1, showPages - 1);
    }
    if (currentPage > totalPages - halfShow - 1) {
      startPage = Math.max(0, totalPages - showPages);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 0;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Trang {currentPage + 1} trong {totalPages}
      </div>
      
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* First page */}
        {showStartEllipsis && (
          <>
            <button
              onClick={() => onPageChange(0)}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              1
            </button>
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </>
        )}

        {/* Visible pages */}
        {visiblePages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 text-sm rounded-md ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page + 1}
          </button>
        ))}

        {/* Last page */}
        {showEndEllipsis && (
          <>
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
            <button
              onClick={() => onPageChange(totalPages - 1)}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;