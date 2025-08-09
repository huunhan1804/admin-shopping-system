// Mapping cho các trạng thái phê duyệt
export const approvalStatusLabels = {
  "PENDING": "Chờ duyệt",
  "APPROVED": "Đã phê duyệt", 
  "REJECTED": "Bị từ chối",
  "Chờ duyệt": "Chờ duyệt",
  "Đã phê duyệt": "Đã phê duyệt",
  "Bị từ chối": "Bị từ chối",
  "pending": "Chờ duyệt",
  "approved": "Đã phê duyệt", 
  "rejected": "Bị từ chối",
};

// Mapping cho trạng thái tài khoản
export const accountStatusLabels = {
  "ACTIVE": "Hoạt động",
  "INACTIVE": "Không hoạt động", 
  "SUSPENDED": "Tạm khóa",
  "BANNED": "Đã khóa",
  "PENDING": "Chờ xác nhận"
};

// Mapping cho cấp độ thành viên
export const membershipLevelLabels = {
  "BRONZE": "Đồng",
  "SILVER": "Bạc", 
  "GOLD": "Vàng",
  "PLATINUM": "Bạch kim",
  "DIAMOND": "Kim cương",
  "VIP": "VIP"
};

// Mapping cho loại người dùng
export const userTypeLabels = {
  "CUSTOMER": "Khách hàng",
  "AGENCY": "Agency",
  "ADMIN": "Quản trị viên",
  "STAFF": "Nhân viên"
};

// Mapping cho trạng thái đơn hàng
export const orderStatusLabels = {
  "PENDING": "Chờ xử lý",
  "CONFIRMED": "Đã xác nhận",
  "PROCESSING": "Đang xử lý", 
  "SHIPPING": "Đang giao hàng",
  "DELIVERED": "Đã giao hàng",
  "CANCELLED": "Đã hủy",
  "REFUNDED": "Đã hoàn tiền"
};

// Mapping cho phương thức thanh toán
export const paymentMethodLabels = {
  "CASH": "Tiền mặt",
  "BANK_TRANSFER": "Chuyển khoản",
  "CREDIT_CARD": "Thẻ tín dụng",
  "E_WALLET": "Ví điện tử",
  "COD": "Thanh toán khi nhận hàng"
};

// Mapping cho trạng thái yêu cầu bảo hiểm
export const insuranceStatusLabels = {
  "SUBMITTED": "Đã nộp",
  "UNDER_REVIEW": "Đang xem xét", 
  "PENDING_DOCUMENTS": "Chờ bổ sung giấy tờ",
  "APPROVED": "Đã chấp thuận",
  "REJECTED": "Từ chối",
  "CLOSED": "Đã đóng",
  "CANCELLED": "Đã hủy"
};

// Mapping cho mức độ nghiêm trọng
export const severityLevelLabels = {
  "LOW": "Thấp",
  "MEDIUM": "Trung bình",
  "HIGH": "Cao", 
  "CRITICAL": "Nghiêm trọng"
};

// Mapping cho loại bồi thường
export const compensationTypeLabels = {
  "CASH": "Tiền mặt",
  "VOUCHER": "Phiếu quà tặng",
  "PRODUCT_REPLACEMENT": "Thay thế sản phẩm",
  "REFUND": "Hoàn tiền",
  "STORE_CREDIT": "Tín dụng cửa hàng"
};

// Mapping cho trạng thái sản phẩm
export const productStatusLabels = {
  "PENDING": "Chờ duyệt",
  "APPROVED": "Đã duyệt", 
  "REJECTED": "Từ chối",
  "SUSPENDED": "Tạm ngưng",
  "UNDER_REVIEW": "Đang xem xét",
  "ACTIVE": "Hoạt động",
  "INACTIVE": "Không hoạt động"
};

export const roleLabels = {
  "admin": "Quản trị viên",
  "agency": "Đại lý",
  "customer": "Khách hàng",
  "staff": "Nhân viên"
};

export const genderLabels = {
  "MALE": "Nam",
  "FEMALE": "Nữ", 
  "OTHER": "Khác"
};

// Mapping cho loại liên lạc
export const communicationTypeLabels = {
  "ADMIN_TO_CUSTOMER": "Admin → Khách hàng",
  "ADMIN_TO_AGENCY": "Admin → Agency",
  "CUSTOMER_TO_ADMIN": "Khách hàng → Admin", 
  "AGENCY_TO_ADMIN": "Agency → Admin",
  "SYSTEM_NOTIFICATION": "Thông báo hệ thống"
};

// Hàm helper để convert options với label
export const mapOptionsWithLabels = (options, labelMapping) => {
  if (!options || !Array.isArray(options)) return [];
  
  return options.map(option => ({
    value: option,
    label: labelMapping[option] || option
  }));
};

// Hàm helper để lấy label từ value
export const getLabel = (value, labelMapping) => {
  return labelMapping[value] || value;
};

export const getStatusBadge = (status, type) => {
  const badgeConfigs = {
    approval: {
      "PENDING": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "clock" },
      "APPROVED": { color: "bg-green-100 text-green-800 border-green-200", icon: "check-circle" },
      "REJECTED": { color: "bg-red-100 text-red-800 border-red-200", icon: "x-circle" },
      "pending": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "clock" },
      "approved": { color: "bg-green-100 text-green-800 border-green-200", icon: "check-circle" },
      "rejected": { color: "bg-red-100 text-red-800 border-red-200", icon: "x-circle" }
    },
    account: {
      "ACTIVE": { color: "bg-green-100 text-green-800 border-green-200", icon: "check" },
      "SUSPENDED": { color: "bg-red-100 text-red-800 border-red-200", icon: "ban" },
      "INACTIVE": { color: "bg-gray-100 text-gray-800 border-gray-200", icon: "pause" },
      "PENDING": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "clock" },
      "active": { color: "bg-green-100 text-green-800 border-green-200", icon: "check" },
      "suspended": { color: "bg-red-100 text-red-800 border-red-200", icon: "ban" },
      "inactive": { color: "bg-gray-100 text-gray-800 border-gray-200", icon: "pause" },
      "pending": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "clock" }
    },
    insurance: {
      "SUBMITTED": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "clock" },
      "UNDER_REVIEW": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: "search" },
      "APPROVED": { color: "bg-green-100 text-green-800 border-green-200", icon: "check-circle" },
      "REJECTED": { color: "bg-red-100 text-red-800 border-red-200", icon: "x-circle" },
      "CLOSED": { color: "bg-gray-100 text-gray-800 border-gray-200", icon: "archive" },
      "submitted": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "clock" },
      "under_review": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: "search" },
      "approved": { color: "bg-green-100 text-green-800 border-green-200", icon: "check-circle" },
      "rejected": { color: "bg-red-100 text-red-800 border-red-200", icon: "x-circle" },
      "closed": { color: "bg-gray-100 text-gray-800 border-gray-200", icon: "archive" }
    }
  };
console.log('getStatusBadge called with:', status, type);
  const config = badgeConfigs[type]?.[status] || 
    { color: "bg-gray-100 text-gray-800 border-gray-200", icon: "help-circle" };
  
  return config;
};