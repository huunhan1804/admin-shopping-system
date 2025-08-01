import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Loader2,
  ChevronDown
} from 'lucide-react';

const PaginatedTable = ({ 
  data = [], 
  columns = [], 
  currentPage = 0, 
  totalPages = 0, 
  totalElements = 0,
  pageSize = 20,
  onPageChange, 
  onPageSizeChange,
  loading = false,
  emptyMessage = "Không có dữ liệu",
  className = "",
  pageSizeOptions = [10, 20, 50, 100]
}) => {
  // Tính toán thông tin hiển thị
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);
  
  // Xử lý click pagination
  const handlePageClick = (page) => {
    if (page >= 0 && page < totalPages && page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  // Xử lý thay đổi page size
  const handlePageSizeChange = (newPageSize) => {
    if (onPageSizeChange && newPageSize !== pageSize) {
      onPageSizeChange(newPageSize);
    }
  };

  // Render pagination button
  const PaginationButton = ({ 
    onClick, 
    disabled = false, 
    active = false, 
    children, 
    className: buttonClassName = "" 
  }) => (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center px-3 py-2 text-sm font-medium
        border transition-colors duration-200 min-w-[40px] h-10
        ${active 
          ? 'z-10 bg-blue-600 border-blue-600 text-white' 
          : disabled 
            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        }
        ${buttonClassName}
      `}
    >
      {children}
    </button>
  );

  // Page Size Selector Component
  const PageSizeSelector = () => (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-700">Hiển thị:</span>
      <div className="relative">
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          disabled={loading}
          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      <span className="text-sm text-gray-700">bản ghi</span>
    </div>
  );

  // Tạo danh sách các trang cần hiển thị
  const getVisiblePages = () => {
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    // Điều chỉnh nếu không đủ trang ở cuối
    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1 && totalElements <= pageSize) return null;

    const visiblePages = getVisiblePages();

    return (
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        {/* Mobile pagination */}
        <div className="flex items-center justify-between sm:hidden">
          <div className="flex items-center space-x-2">
            <PaginationButton
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 0}
              className="rounded-l-md"
            >
              Trước
            </PaginationButton>
            <span className="px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded">
              {currentPage + 1} / {totalPages}
            </span>
            <PaginationButton
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="rounded-r-md"
            >
              Sau
            </PaginationButton>
          </div>
          <PageSizeSelector />
        </div>

        {/* Desktop pagination */}
        <div className="hidden sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{' '}
                <span className="font-medium">{totalElements > 0 ? startItem : 0}</span>
                {' '}-{' '}
                <span className="font-medium">{endItem}</span>
                {' '}trong{' '}
                <span className="font-medium">{totalElements}</span>
                {' '}kết quả
              </p>
            </div>
            <PageSizeSelector />
          </div>
          
          {totalPages > 1 && (
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {/* First page */}
                <PaginationButton
                  onClick={() => handlePageClick(0)}
                  disabled={currentPage === 0}
                  className="rounded-l-md"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </PaginationButton>

                {/* Previous page */}
                <PaginationButton
                  onClick={() => handlePageClick(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </PaginationButton>

                {/* Ellipsis before visible pages */}
                {visiblePages[0] > 0 && (
                  <>
                    <PaginationButton onClick={() => handlePageClick(0)}>
                      1
                    </PaginationButton>
                    {visiblePages[0] > 1 && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                  </>
                )}

                {/* Visible page numbers */}
                {visiblePages.map((page) => (
                  <PaginationButton
                    key={page}
                    onClick={() => handlePageClick(page)}
                    active={page === currentPage}
                  >
                    {page + 1}
                  </PaginationButton>
                ))}

                {/* Ellipsis after visible pages */}
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <>
                    {visiblePages[visiblePages.length - 1] < totalPages - 2 && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                    <PaginationButton onClick={() => handlePageClick(totalPages - 1)}>
                      {totalPages}
                    </PaginationButton>
                  </>
                )}

                {/* Next page */}
                <PaginationButton
                  onClick={() => handlePageClick(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </PaginationButton>

                {/* Last page */}
                <PaginationButton
                  onClick={() => handlePageClick(totalPages - 1)}
                  disabled={currentPage === totalPages - 1}
                  className="rounded-r-md"
                >
                  <ChevronsRight className="h-4 w-4" />
                </PaginationButton>
              </nav>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Loading overlay
  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
      <div className="flex items-center space-x-2 text-blue-600">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm font-medium">Đang tải...</span>
      </div>
    </div>
  );

  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="relative">
        {/* Loading overlay */}
        {loading && <LoadingOverlay />}
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={`header-${index}`}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.headerClassName || ''
                    }`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!loading && data && data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr 
                    key={`row-${currentPage}-${rowIndex}`} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={`cell-${currentPage}-${rowIndex}-${colIndex}`}
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          column.cellClassName || 'text-gray-900'
                        }`}
                      >
                        {column.render ? column.render(row, rowIndex) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : !loading ? (
                <tr>
                  <td 
                    colSpan={columns.length} 
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Không có dữ liệu</p>
                      <p className="text-sm text-gray-500">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Loading rows placeholder
                Array.from({ length: pageSize }).map((_, index) => (
                  <tr key={`loading-${index}`}>
                    {columns.map((_, colIndex) => (
                      <td key={`loading-cell-${index}-${colIndex}`} className="px-6 py-4">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default PaginatedTable;