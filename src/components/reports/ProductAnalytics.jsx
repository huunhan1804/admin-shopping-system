import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Package, TrendingUp, Eye, ShoppingCart } from 'lucide-react';

const ProductAnalytics = ({ data }) => {
  const topProductsChartRef = useRef(null);
  const categoriesChartRef = useRef(null);
  const topProductsChartInstanceRef = useRef(null);
  const categoriesChartInstanceRef = useRef(null);

  useEffect(() => {
    // Top Products Chart
    if (topProductsChartRef.current && data?.topProducts) {
      if (topProductsChartInstanceRef.current) {
        topProductsChartInstanceRef.current.destroy();
      }

      const ctx = topProductsChartRef.current.getContext('2d');
      
      topProductsChartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.topProducts.map(product => 
            product.productName.length > 20 
              ? product.productName.substring(0, 20) + '...'
              : product.productName
          ),
          datasets: [{
            label: 'Số đơn hàng',
            data: data.topProducts.map(product => product.orderCount),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: '#3B82F6',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                title: function(context) {
                  const index = context[0].dataIndex;
                  return data.topProducts[index].productName;
                },
                label: function(context) {
                  return `Số đơn hàng: ${context.parsed.y}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            },
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 0
              }
            }
          }
        }
      });
    }

    // Categories Chart
    if (categoriesChartRef.current && data?.trendingCategories) {
      if (categoriesChartInstanceRef.current) {
        categoriesChartInstanceRef.current.destroy();
      }

      const ctx = categoriesChartRef.current.getContext('2d');
      
      categoriesChartInstanceRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.trendingCategories.map(category => category.categoryName),
          datasets: [{
            data: data.trendingCategories.map(category => category.viewCount),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#FF6384',
              '#C9CBCF'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.label}: ${context.parsed} lượt xem`;
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (topProductsChartInstanceRef.current) {
        topProductsChartInstanceRef.current.destroy();
      }
      if (categoriesChartInstanceRef.current) {
        categoriesChartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  if (!data?.topProducts && !data?.trendingCategories) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Không có dữ liệu phân tích sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products Chart */}
        {data?.topProducts && data.topProducts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Sản phẩm bán chạy nhất
            </h3>
            <div className="h-80 bg-gray-50 rounded-lg p-4">
              <canvas ref={topProductsChartRef}></canvas>
            </div>
          </div>
        )}

        {/* Categories Chart */}
        {data?.trendingCategories && data.trendingCategories.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-green-600" />
              Danh mục được xem nhiều
            </h3>
            <div className="h-80 bg-gray-50 rounded-lg p-4">
              <canvas ref={categoriesChartRef}></canvas>
            </div>
          </div>
        )}
      </div>

      {/* Top Products Table */}
      {data?.topProducts && data.topProducts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Chi tiết sản phẩm bán chạy
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thứ hạng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lượt xem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tỷ lệ chuyển đổi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`
                          inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                          ${index < 3 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                          }
                        `}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1 text-gray-400" />
                        {new Intl.NumberFormat('vi-VN').format(product.viewCount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-1 text-gray-400" />
                        {new Intl.NumberFormat('vi-VN').format(product.orderCount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {new Intl.NumberFormat('vi-VN').format(product.revenue)} VNĐ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${product.conversionRate > 5 
                          ? 'bg-green-100 text-green-800' 
                          : product.conversionRate > 2 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }
                      `}>
                        {product.conversionRate?.toFixed(2) || 0}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories Table */}
      {data?.trendingCategories && data.trendingCategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-green-600" />
            Chi tiết danh mục xu hướng
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lượt xem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trung bình xem/sản phẩm
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.trendingCategories.map((category, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('vi-VN').format(category.viewCount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('vi-VN').format(category.productCount || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.productCount > 0 
                        ? (category.viewCount / category.productCount).toFixed(1)
                        : '0'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAnalytics;