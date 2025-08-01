import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Users, Globe, Smartphone, TrendingUp, Clock, Eye } from 'lucide-react';

const UserAnalytics = ({ data }) => {
  const geoChartRef = useRef(null);
  const deviceChartRef = useRef(null);
  const geoChartInstanceRef = useRef(null);
  const deviceChartInstanceRef = useRef(null);

  useEffect(() => {
    // Geographic Chart
    if (geoChartRef.current && data?.geographic) {
      if (geoChartInstanceRef.current) {
        geoChartInstanceRef.current.destroy();
      }

      const ctx = geoChartRef.current.getContext('2d');
      
      geoChartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(data.geographic),
          datasets: [{
            label: 'Người dùng',
            data: Object.values(data.geographic),
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
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }

    // Device Chart
    if (deviceChartRef.current && data?.devices) {
      if (deviceChartInstanceRef.current) {
        deviceChartInstanceRef.current.destroy();
      }

      const ctx = deviceChartRef.current.getContext('2d');
      
      deviceChartInstanceRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(data.devices),
          datasets: [{
            data: Object.values(data.devices),
            backgroundColor: [
              '#3B82F6',
              '#10B981',
              '#F59E0B',
              '#EF4444',
              '#8B5CF6'
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
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.parsed / total) * 100).toFixed(1);
                  return `${context.label}: ${context.parsed} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (geoChartInstanceRef.current) {
        geoChartInstanceRef.current.destroy();
      }
      if (deviceChartInstanceRef.current) {
        deviceChartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  if (!data?.engagement && !data?.geographic && !data?.devices) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Không có dữ liệu phân tích người dùng</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Engagement Metrics Cards */}
      {data?.engagement && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <div className="flex items-center">
              <Eye className="w-8 h-8 mr-3" />
              <div>
                <p className="text-blue-100 text-sm">Lượt xem trang</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('vi-VN').format(data.engagement.totalPageViews)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
            <div className="flex items-center">
              <Users className="w-8 h-8 mr-3" />
              <div>
                <p className="text-green-100 text-sm">Phiên làm việc</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('vi-VN').format(data.engagement.totalSessions)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
            <div className="flex items-center">
              <Clock className="w-8 h-8 mr-3" />
              <div>
                <p className="text-yellow-100 text-sm">Tỷ lệ thoát</p>
                <p className="text-2xl font-bold">
                  {data.engagement.bounceRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 mr-3" />
              <div>
                <p className="text-purple-100 text-sm">Tỷ lệ chuyển đổi</p>
                <p className="text-2xl font-bold">
                  {data.engagement.conversionRate}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Geographic Distribution */}
        {data?.geographic && Object.keys(data.geographic).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Phân bố địa lý
            </h3>
            <div className="h-80 bg-gray-50 rounded-lg p-4">
              <canvas ref={geoChartRef}></canvas>
            </div>
          </div>
        )}

        {/* Device Analytics */}
        {data?.devices && Object.keys(data.devices).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-green-600" />
              Phân tích thiết bị
            </h3>
            <div className="h-80 bg-gray-50 rounded-lg p-4">
              <canvas ref={deviceChartRef}></canvas>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Engagement Table */}
      {data?.engagement && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            Thống kê chi tiết tương tác người dùng
          </h3>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chỉ số
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá trị
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Tổng phiên làm việc
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat('vi-VN').format(data.engagement.totalSessions)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Số lượng phiên truy cập trong khoảng thời gian được chọn
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Tổng lượt xem trang
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat('vi-VN').format(data.engagement.totalPageViews)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Tổng số trang được xem bởi tất cả người dùng
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Thời gian phiên trung bình
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.engagement.avgSessionDuration} phút
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Thời gian trung bình người dùng dành cho mỗi phiên
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Tỷ lệ thoát
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${parseFloat(data.engagement.bounceRate) > 70 
                        ? 'bg-red-100 text-red-800' 
                        : parseFloat(data.engagement.bounceRate) > 40 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }
                    `}>
                      {data.engagement.bounceRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Tỷ lệ người dùng rời khỏi trang web sau khi chỉ xem một trang
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Tỷ lệ chuyển đổi
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${parseFloat(data.engagement.conversionRate) > 5 
                        ? 'bg-green-100 text-green-800' 
                        : parseFloat(data.engagement.conversionRate) > 2 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }
                    `}>
                      {data.engagement.conversionRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Tỷ lệ người dùng thực hiện hành động mong muốn (mua hàng, đăng ký)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Geographic and Device Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Geographic Details */}
        {data?.geographic && Object.keys(data.geographic).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Chi tiết phân bố địa lý
            </h3>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khu vực
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tỷ lệ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(data.geographic)
                    .sort(([,a], [,b]) => b - a)
                    .map(([region, count]) => {
                      const total = Object.values(data.geographic).reduce((a, b) => a + b, 0);
                      const percentage = ((count / total) * 100).toFixed(1);
                      
                      return (
                        <tr key={region} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {region}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Intl.NumberFormat('vi-VN').format(count)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Device Details */}
        {data?.devices && Object.keys(data.devices).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-green-600" />
              Chi tiết phân tích thiết bị
            </h3>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thiết bị
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tỷ lệ
                   </th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {Object.entries(data.devices)
                   .sort(([,a], [,b]) => b - a)
                   .map(([device, count]) => {
                     const total = Object.values(data.devices).reduce((a, b) => a + b, 0);
                     const percentage = ((count / total) * 100).toFixed(1);
                     
                     return (
                       <tr key={device} className="hover:bg-gray-50">
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                           <div className="flex items-center">
                             {device === 'Mobile' && <Smartphone className="w-4 h-4 mr-2 text-green-600" />}
                             {device === 'Desktop' && <Globe className="w-4 h-4 mr-2 text-blue-600" />}
                             {device === 'Tablet' && <Globe className="w-4 h-4 mr-2 text-purple-600" />}
                             {device}
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {new Intl.NumberFormat('vi-VN').format(count)}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           <div className="flex items-center">
                             <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                               <div 
                                 className="bg-blue-600 h-2 rounded-full" 
                                 style={{width: `${percentage}%`}}
                               ></div>
                             </div>
                             <span className="text-sm font-medium">{percentage}%</span>
                           </div>
                         </td>
                       </tr>
                     );
                   })
                 }
               </tbody>
             </table>
           </div>
         </div>
       )}
     </div>
   </div>
 );
};

export default UserAnalytics;