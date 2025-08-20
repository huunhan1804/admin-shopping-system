import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { TrendingUp, DollarSign } from 'lucide-react';

const RevenueReport = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && data?.data) {
      // Destroy existing chart
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      // Prepare chart data
      const chartData = {
        labels: data.data.map(item => {
          const date = new Date(item.reportDate);
          return date.toLocaleDateString('vi-VN');
        }),
        datasets: [
          {
            label: 'Doanh thu thuần',
            data: data.data.map(item => item.netProfit),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Doanh thu giao dịch',
            data: data.data.map(item => item.transactionRevenue),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: false
          },
          {
            label: 'Hoa hồng',
            data: data.data.map(item => item.commissionRevenue),
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: false
          }
        ]
      };

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${new Intl.NumberFormat('vi-VN').format(context.parsed.y)} VNĐ`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return new Intl.NumberFormat('vi-VN', {
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value) + ' VNĐ';
                }
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Không có dữ liệu doanh thu</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Biểu đồ doanh thu {data.period}
        </h3>
        <div className="h-80">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      {/* Data Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Chi tiết doanh thu
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doanh thu giao dịch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hoa hồng
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doanh thu đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chi phí vận hành
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lợi nhuận thuần
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(item.reportDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat('vi-VN').format(item.totalTransactionRevenue)} VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat('vi-VN').format(item.agencyCommissionRevenue)} VNĐ
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat('vi-VN').format(item.subscriptionRevenue)} VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {new Intl.NumberFormat('vi-VN').format(item.operatingCosts)} VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {new Intl.NumberFormat('vi-VN').format(item.netProfit)} VNĐ
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;