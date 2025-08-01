// Mapping cho các trạng thái phê duyệt
export const approvalStatusLabels = {
  "PENDING": "Chờ duyệt",
  "APPROVED": "Đã phê duyệt", 
  "REJECTED": "Bị từ chối",
  "Chờ duyệt": "Chờ duyệt",
  "Đã phê duyệt": "Đã phê duyệt",
  "Bị từ chối": "Bị từ chối"
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