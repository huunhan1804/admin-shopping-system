import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  User,
  Store,
  AlertTriangle,
} from "lucide-react";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { useConfirmation } from "../hooks/useConfirmation";
import apiService from '../services/api';

const ApplicationReview = ({ applicationId }) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState({
    cccd: [],
    license: [],
    cert: [],
  });
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineReasonOptions, setDeclineReasonOptions] = useState([]);
  const { confirmationState, showConfirmation, closeConfirmation } =
    useConfirmation();

  useEffect(() => {
    loadApplicationDetail();
  }, [applicationId]);

  const loadApplicationDetail = async () => {
    setLoading(true);
    try {
      const data = await apiService.get(
        `/admin/users/agencies/applications/${applicationId}`
      );

      if (data.success) {
        setApplication(data.application);
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn đăng ký:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChecklistChange = (category, index, checked) => {
    setChecklist((prev) => ({
      ...prev,
      [category]: prev[category].includes(index)
        ? prev[category].filter((i) => i !== index)
        : [...prev[category], index],
    }));
  };

  const getTotalChecked = () => {
    return (
      checklist.cccd.length + checklist.license.length + checklist.cert.length
    );
  };

  const getTotalItems = () => {
    return 9; // 3 danh mục × 3 mục mỗi danh mục
  };

  const getProgress = () => {
    return (getTotalChecked() / getTotalItems()) * 100;
  };

  const isAllChecked = () => {
    return getTotalChecked() === getTotalItems();
  };

  const handleApprove = async () => {
    showConfirmation({
      title: "Phê duyệt đơn đăng ký",
      message: `Phê duyệt đơn đăng ký này?`,
      type: "info",
      confirmText: "Phê duyệt",
      onConfirm: async () => {
        try {
          const data = await apiService.post(
            `/admin/users/agencies/applications/${applicationId}/approve`
          );

          if (data.success) {
            alert("Phê duyệt đơn đăng ký thành công");
            window.location.href = "/users/agencies/applications";
          } else {
            alert("Lỗi: " + data.message);
          }
        } catch (error) {
          console.error("Lỗi khi phê duyệt đơn đăng ký:", error);
          alert("Lỗi khi phê duyệt đơn đăng ký");
        }
      },
    });
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      const data = await apiService.post(
        `/admin/users/agencies/applications/${applicationId}/decline`,
        { reason: declineReason },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      if (data.success) {
        alert("Từ chối đơn đăng ký thành công");
        window.location.href = "/users/agencies/applications";
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi khi từ chối đơn đăng ký:", error);
      alert("Lỗi khi từ chối đơn đăng ký");
    }
  };

  const handleDeclineReasonOptionChange = (option, checked) => {
    if (checked) {
      setDeclineReasonOptions((prev) => [...prev, option]);
    } else {
      setDeclineReasonOptions((prev) => prev.filter((o) => o !== option));
    }

    // Tự động tạo lý do từ chối
    const reasons = declineReasonOptions.filter((o) => o !== option);
    if (checked) reasons.push(option);

    if (reasons.length > 0) {
      setDeclineReason(
        "Đơn đăng ký bị từ chối vì các lý do sau:\n\n" +
          reasons.map((r) => `- ${r}`).join("\n") +
          "\n\nVui lòng chỉnh sửa và nộp lại hồ sơ.\n\nChi tiết: "
      );
    } else {
      setDeclineReason("");
    }
  };

  const showImageModal = (src, title) => {
    // Tạo modal để xem ảnh
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50";
    modal.innerHTML = `
            <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div class="mt-3">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">${title}</h3>
                    <div class="text-center">
                        <img src="${src}" class="max-w-full h-auto" alt="${title}">
                    </div>
                    <div class="mt-4 flex justify-end">
                        <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        `;
    document.body.appendChild(modal);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải chi tiết đơn đăng ký...</span>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">
          Không tìm thấy đơn đăng ký
        </h3>
        <button
          onClick={() =>
            (window.location.href = "/users/agencies/applications")
          }
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Quay lại danh sách đơn đăng ký
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Eye className="mr-2" />
          Xét duyệt đơn đăng ký Agency
        </h1>
        <button
          onClick={() =>
            (window.location.href = "/users/agencies/applications")
          }
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-600 mb-3">
                  Thông tin tài khoản
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Username:</span>{" "}
                    {application.username}
                  </div>
                  <div>
                    <span className="font-medium">Họ tên:</span>{" "}
                    {application.fullname}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {application.email}
                  </div>
                  <div>
                    <span className="font-medium">Số điện thoại:</span>{" "}
                    {application.phone}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-green-600 mb-3">
                  Thông tin Shop
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Tên shop:</span>{" "}
                    {application.shopName}
                  </div>
                  <div>
                    <span className="font-medium">Email shop:</span>{" "}
                    {application.shopEmail}
                  </div>
                  <div>
                    <span className="font-medium">Số điện thoại shop:</span>{" "}
                    {application.shopPhone}
                  </div>
                  <div>
                    <span className="font-medium">Mã số thuế:</span>{" "}
                    {application.taxNumber}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-purple-600 mb-3">
                Địa chỉ kinh doanh
              </h4>
              <p className="text-sm">{application.shopAddressDetail}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h4 className="font-medium text-orange-600 mb-3">
                  Thông tin người đại diện
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Họ tên:</span>{" "}
                    {application.fullNameApplicant}
                  </div>
                  <div>
                    <span className="font-medium">Ngày sinh:</span>{" "}
                    {new Date(
                      application.birthdateApplicant
                    ).toLocaleDateString("vi-VN")}
                  </div>
                  <div>
                    <span className="font-medium">Giới tính:</span>{" "}
                    {application.genderApplicant}
                  </div>
                  <div>
                    <span className="font-medium">Số CCCD:</span>{" "}
                    {application.idCardNumber}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-600 mb-3">
                  Thông tin đơn đăng ký
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Ngày nộp:</span>{" "}
                    {new Date(application.submittedDate).toLocaleString(
                      "vi-VN"
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Trạng thái:</span>
                    <span className="ml-2 px-2 py-1 text-xs rounded bg-yellow-500 text-white">
                      {application.statusName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Giấy tờ đính kèm
            </h3>

            {/* ID Card */}
            <div className="mb-6">
              <h4 className="font-medium mb-3 flex items-center">
                <span
                  className={`w-3 h-3 rounded-full mr-2 ${
                    checklist.cccd.length === 3
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                ></span>
                <User className="w-4 h-4 mr-1" />
                CCCD / Căn cước công dân
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.idCardFrontImageUrl && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Mặt trước</p>
                    <img
                      src={application.idCardFrontImageUrl}
                      alt="CCCD mặt trước"
                      className="w-full h-48 object-cover rounded border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() =>
                        showImageModal(
                          application.idCardFrontImageUrl,
                          "CCCD mặt trước"
                        )
                      }
                    />
                  </div>
                )}
                {application.idCardBackImageUrl && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Mặt sau</p>
                    <img
                      src={application.idCardBackImageUrl}
                      alt="CCCD mặt sau"
                      className="w-full h-48 object-cover rounded border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() =>
                        showImageModal(
                          application.idCardBackImageUrl,
                          "CCCD mặt sau"
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Business License */}
            {application.businessLicenseUrls && (
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center">
                  <span
                    className={`w-3 h-3 rounded-full mr-2 ${
                      checklist.license.length === 3
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></span>
                  <FileText className="w-4 h-4 mr-1" />
                  Giấy phép kinh doanh
                </h4>
                <div className="flex items-center p-4 border rounded-lg">
                  <i className="fas fa-file-pdf text-4xl text-red-500 mr-4"></i>
                  <div>
                    <a
                      href={application.businessLicenseUrls}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Xem giấy phép kinh doanh
                    </a>
                    <p className="text-sm text-gray-600">
                      Click để xem chi tiết giấy phép
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Certificates */}
            {application.professionalCertUrls && (
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center">
                  <span
                    className={`w-3 h-3 rounded-full mr-2 ${
                      checklist.cert.length === 3
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></span>
                  <i className="fas fa-user-md mr-1"></i>
                  Chứng chỉ hành nghề y dược
                </h4>
                <div className="flex items-center p-4 border rounded-lg">
                  <i className="fas fa-file-pdf text-4xl text-green-500 mr-4"></i>
                  <div>
                    <a
                      href={application.professionalCertUrls}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Xem chứng chỉ hành nghề
                    </a>
                    <p className="text-sm text-gray-600">
                      Click để xem chi tiết chứng chỉ
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Review Checklist */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Danh sách kiểm tra
            </h3>

            {/* ID Card Checklist */}
            <div className="mb-6">
              <h4 className="font-medium text-blue-600 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Kiểm tra CCCD
              </h4>
              <div className="space-y-2">
                {[
                "Hình ảnh rõ nét, không bị mờ",
                 "Thông tin đầy đủ và trùng khớp",
                 "CCCD còn hiệu lực (chưa hết hạn)",
               ].map((item, index) => (
                 <label key={index} className="flex items-center">
                   <input
                     type="checkbox"
                     checked={checklist.cccd.includes(index)}
                     onChange={(e) =>
                       handleChecklistChange("cccd", index, e.target.checked)
                     }
                     className="mr-2"
                   />
                   <span className="text-sm">{item}</span>
                 </label>
               ))}
             </div>
           </div>

           {/* Business License Checklist */}
           <div className="mb-6">
             <h4 className="font-medium text-green-600 mb-3 flex items-center">
               <FileText className="w-4 h-4 mr-2" />
               Kiểm tra giấy phép kinh doanh
             </h4>
             <div className="space-y-2">
               {[
                 "Giấy phép còn hiệu lực",
                 "Phạm vi kinh doanh phù hợp với ngành dược",
                 "Thông tin trùng khớp với đăng ký",
               ].map((item, index) => (
                 <label key={index} className="flex items-center">
                   <input
                     type="checkbox"
                     checked={checklist.license.includes(index)}
                     onChange={(e) =>
                       handleChecklistChange(
                         "license",
                         index,
                         e.target.checked
                       )
                     }
                     className="mr-2"
                   />
                   <span className="text-sm">{item}</span>
                 </label>
               ))}
             </div>
           </div>

           {/* Professional Certificate Checklist */}
           <div className="mb-6">
             <h4 className="font-medium text-purple-600 mb-3 flex items-center">
               <i className="fas fa-user-md w-4 h-4 mr-2"></i>
               Kiểm tra chứng chỉ y dược
             </h4>
             <div className="space-y-2">
               {[
                 "Chứng chỉ do cơ quan có thẩm quyền cấp",
                 "Chứng chỉ còn hiệu lực",
                 "Phù hợp với việc bán thực phẩm chức năng",
               ].map((item, index) => (
                 <label key={index} className="flex items-center">
                   <input
                     type="checkbox"
                     checked={checklist.cert.includes(index)}
                     onChange={(e) =>
                       handleChecklistChange("cert", index, e.target.checked)
                     }
                     className="mr-2"
                   />
                   <span className="text-sm">{item}</span>
                 </label>
               ))}
             </div>
           </div>

           {/* Progress Indicator */}
           <div className="mb-6">
             <div className="mb-2">
               <div
                 className={`w-full bg-gray-200 rounded-full h-2.5 ${
                   isAllChecked() ? "bg-green-200" : ""
                 }`}
               >
                 <div
                   className={`h-2.5 rounded-full transition-all duration-300 ${
                     isAllChecked() ? "bg-green-600" : "bg-blue-600"
                   }`}
                   style={{ width: `${getProgress()}%` }}
                 ></div>
               </div>
             </div>
             <div className="text-sm text-center">
               <span
                 className={`font-medium ${
                   isAllChecked() ? "text-green-600" : "text-blue-600"
                 }`}
               >
                 {getTotalChecked()}/{getTotalItems()}
               </span>
               <span className="text-gray-600 ml-1">Tiến độ xét duyệt</span>
             </div>

             <div className="mt-3 space-y-1 text-xs">
               <div className="flex items-center">
                 <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                 <span>Chờ kiểm tra</span>
               </div>
               <div className="flex items-center">
                 <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                 <span>Đã xác minh</span>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>

     {/* Action Buttons */}
     <div className="mt-8 bg-white p-6 rounded-lg shadow">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <button
           onClick={handleApprove}
           disabled={!isAllChecked()}
           className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
             isAllChecked()
               ? "bg-green-600 hover:bg-green-700 text-white"
               : "bg-gray-300 text-gray-500 cursor-not-allowed"
           }`}
         >
           <CheckCircle className="w-5 h-5 mr-2" />
           Phê duyệt đơn đăng ký
         </button>

         <button
           onClick={() => setShowDeclineModal(true)}
           className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center"
         >
           <XCircle className="w-5 h-5 mr-2" />
           Từ chối đơn đăng ký
         </button>
       </div>
     </div>

     {/* Decline Modal */}
     {showDeclineModal && (
       <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
         <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
           <div className="mt-3">
             <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
               <XCircle className="w-5 h-5 mr-2 text-red-600" />
               Từ chối đơn đăng ký
             </h3>

             <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
               <div className="flex">
                 <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
                 <div className="text-sm">
                   <strong>Lưu ý:</strong> Đơn đăng ký sẽ bị từ chối và
                   agency sẽ nhận được thông báo.
                 </div>
               </div>
             </div>

             <div className="mb-4">
               <label className="block text-sm font-medium mb-2">
                 Lý do từ chối:
               </label>
               <textarea
                 value={declineReason}
                 onChange={(e) => setDeclineReason(e.target.value)}
                 className="w-full border border-gray-300 rounded px-3 py-2"
                 rows="4"
                 placeholder="Mô tả chi tiết lý do từ chối đơn đăng ký..."
                 required
               />
             </div>

             <div className="mb-4">
               <label className="block text-sm font-medium mb-2">
                 Các lỗi phổ biến:
               </label>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                 {[
                   "CCCD không hợp lệ hoặc hết hạn",
                   "Giấy phép kinh doanh không phù hợp",
                   "Thiếu chứng chỉ hành nghề",
                   "Thông tin không khớp nhau",
                   "Hình ảnh không rõ nét",
                   "Hồ sơ không đầy đủ",
                 ].map((option, index) => (
                   <label key={index} className="flex items-center">
                     <input
                       type="checkbox"
                       onChange={(e) =>
                         handleDeclineReasonOptionChange(
                           option,
                           e.target.checked
                         )
                       }
                       className="mr-2"
                     />
                     <span className="text-sm">{option}</span>
                   </label>
                 ))}
               </div>
             </div>

             <div className="flex justify-end space-x-2">
               <button
                 onClick={() => {
                   setShowDeclineModal(false);
                   setDeclineReason("");
                   setDeclineReasonOptions([]);
                 }}
                 className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
               >
                 Hủy
               </button>
               <button
                 onClick={handleDecline}
                 disabled={!declineReason.trim()}
                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
               >
                 Từ chối đơn đăng ký
               </button>
             </div>
           </div>
         </div>
       </div>
     )}

     <ConfirmationModal
       isOpen={confirmationState.isOpen}
       onClose={closeConfirmation}
       onConfirm={confirmationState.onConfirm}
       title={confirmationState.title}
       message={confirmationState.message}
       type={confirmationState.type}
       confirmText={confirmationState.confirmText}
       cancelText={confirmationState.cancelText}
     />
   </div>
 );
};

export default ApplicationReview;