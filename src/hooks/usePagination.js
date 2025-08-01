import { useState, useCallback } from 'react';

export const usePagination = (initialPageSize = 20) => {
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: initialPageSize,
    totalElements: 0,
    totalPages: 0,
    loading: false
  });

  const updatePagination = useCallback((updates) => {
    setPagination(prev => ({ ...prev, ...updates }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: 0,
      totalElements: 0,
      totalPages: 0
    }));
  }, []);

  const setLoading = useCallback((loading) => {
    setPagination(prev => ({ ...prev, loading }));
  }, []);

  const setPageSize = useCallback((pageSize) => {
    setPagination(prev => ({
      ...prev,
      pageSize,
      currentPage: 0 // Reset to first page when changing page size
    }));
  }, []);

  const setCurrentPage = useCallback((currentPage) => {
    setPagination(prev => ({ ...prev, currentPage }));
  }, []);

  return {
    pagination,
    updatePagination,
    resetPagination,
    setLoading,
    setPageSize,
    setCurrentPage
  };
};