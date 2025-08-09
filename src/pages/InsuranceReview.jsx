// pages/InsuranceReview.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  User, 
  Store, 
  FileText, 
  Image, 
  MessageCircle,
  Mail,
  History,
  Settings
} from 'lucide-react';
import apiService from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ClaimStatusBadge from '../components/insurance/ClaimStatusBadge';
import SeverityBadge from '../components/insurance/SeverityBadge';
import EvidenceGallery from '../components/insurance/EvidenceGallery';
import CommunicationHistory from '../components/insurance/CommunicationHistory';
import ProcessClaimForm from '../components/insurance/ProcessClaimForm';
import ContactModal from '../components/insurance/ContactModal';
import ImageModal from '../components/common/ImageModal';

const InsuranceReview = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [contactModal, setContactModal] = useState({
    show: false,
    type: '',
    recipientId: null,
    recipientName: ''
  });
  const [imageModal, setImageModal] = useState({
    show: false,
    src: '',
    title: ''
  });

  useEffect(() => {
    loadClaimDetail();
  }, [claimId]);

  const loadClaimDetail = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/admin/insurance/claims/${claimId}`);
      
      if (response.success) {
        setClaim(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải chi tiết yêu cầu');
      console.error('Error loading claim detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessClaim = async (formData) => {
    try {
      setProcessing(true);
      const response = await apiService.put(`/admin/insurance/claims/${claimId}/process`, formData);
      
      if (response.success) {
        alert('Xử lý yêu cầu bồi thường thành công!');
        await loadClaimDetail(); // Reload to show updated data
      } else {
        alert('Có lỗi xảy ra: ' + response.message);
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi xử lý yêu cầu');
      console.error('Error processing claim:', err);
    } finally {
      setProcessing(false);
    }
  };

  const openContactModal = (type, recipientId, recipientName) => {
    setContactModal({
      show: true,
      type,
      recipientId,
      recipientName
    });
  };

  const closeContactModal = () => {
    setContactModal({
      show: false,
      type: '',
      recipientId: null,
      recipientName: ''
    });
  };

  const handleContactSubmit = async (formData) => {
    try {
      const response = await apiService.post('/admin/insurance/communication', {
        ...formData,
        claimId: parseInt(claimId)
      });
      
      if (response.success) {
        alert('Gửi email thành công!');
        closeContactModal();
        await loadClaimDetail(); // Reload to show new communication
      } else {
alert('Có lỗi xảy ra: ' + response.message);
     }
   } catch (err) {
     alert('Có lỗi xảy ra khi gửi email');
     console.error('Error sending communication:', err);
   }
 };

 const openImageModal = (src, title) => {
   setImageModal({
     show: true,
     src,
     title
   });
 };

 const closeImageModal = () => {
   setImageModal({
     show: false,
     src: '',
     title: ''
   });
 };

 if (loading) return <LoadingSpinner />;
 if (error) return <div className="text-red-600 text-center">{error}</div>;
 if (!claim) return <div className="text-center">Không tìm thấy yêu cầu</div>;

 return (
   <div className="space-y-6">
     {/* Header */}
     <div className="flex justify-between items-start">
       <div>
         <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
           <button 
             onClick={() => navigate('/dashboard')}
             className="hover:text-blue-600"
           >
             Dashboard
           </button>
           <span>/</span>
           <button 
             onClick={() => navigate('/insurance')}
             className="hover:text-blue-600"
           >
             Quản lý bảo hiểm
           </button>
           <span>/</span>
           <span className="text-gray-900">Chi tiết yêu cầu</span>
         </nav>
         
         <h1 className="text-2xl font-bold text-gray-900 flex items-center">
           <Shield className="w-8 h-8 mr-3 text-blue-600" />
           Chi tiết yêu cầu bảo hiểm
         </h1>
         <p className="text-gray-600 mt-1">
           Mã yêu cầu: <span className="font-semibold">{claim.claimCode}</span>
         </p>
       </div>
       
       <div className="flex space-x-3">
         <button
           onClick={() => navigate('/insurance')}
           className="btn btn-secondary flex items-center"
         >
           <ArrowLeft className="w-4 h-4 mr-2" />
           Quay lại danh sách
         </button>
         
         <div className="relative">
           <button className="btn btn-secondary flex items-center">
             <Settings className="w-4 h-4 mr-2" />
             Thao tác khác
           </button>
           {/* Dropdown menu would go here */}
         </div>
       </div>
     </div>

     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       {/* Main Content */}
       <div className="lg:col-span-2 space-y-6">
         {/* Claim Information */}
         <div className="bg-white rounded-lg shadow">
           <div className="px-6 py-4 border-b border-gray-200">
             <h2 className="text-lg font-semibold flex items-center">
               <FileText className="w-5 h-5 mr-2 text-blue-600" />
               Thông tin yêu cầu
             </h2>
           </div>
           <div className="p-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <h3 className="font-medium text-gray-900 mb-3">Thông tin khách hàng</h3>
                 <div className="space-y-2 text-sm">
                   <p><span className="font-medium">Tên:</span> {claim.customerName}</p>
                   <p><span className="font-medium">Email:</span> {claim.customerEmail}</p>
                   {claim.customerPhone && (
                     <p><span className="font-medium">Điện thoại:</span> {claim.customerPhone}</p>
                   )}
                 </div>
               </div>
               
               <div>
                 <h3 className="font-medium text-gray-900 mb-3">Thông tin Agency</h3>
                 <div className="space-y-2 text-sm">
                   <p><span className="font-medium">Tên:</span> {claim.agencyName}</p>
                   <p><span className="font-medium">Email:</span> {claim.agencyEmail}</p>
                 </div>
               </div>
             </div>
             
             <hr className="my-6" />
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <p className="mb-2">
                   <span className="font-medium">Sản phẩm:</span> {claim.productName}
                 </p>
                 <p className="mb-2">
                   <span className="font-medium">Mức độ nghiêm trọng:</span>{' '}
                   <SeverityBadge severity={claim.severityLevel} />
                 </p>
               </div>
               
               <div>
                 <p className="mb-2">
                   <span className="font-medium">Trạng thái:</span>{' '}
                   <ClaimStatusBadge status={claim.claimStatus} />
                 </p>
                 <p className="mb-2">
                   <span className="font-medium">Ngày tạo:</span>{' '}
                   {new Date(claim.submittedDate).toLocaleString('vi-VN')}
                 </p>
               </div>
             </div>
           </div>
         </div>

         {/* Claim Description */}
         <div className="bg-white rounded-lg shadow">
           <div className="px-6 py-4 border-b border-gray-200">
             <h2 className="text-lg font-semibold flex items-center">
               <FileText className="w-5 h-5 mr-2 text-blue-600" />
               Nội dung yêu cầu
             </h2>
           </div>
           <div className="p-6">
             <h3 className="font-medium text-gray-900 mb-2">{claim.claimTitle}</h3>
             <p className="text-gray-700 whitespace-pre-wrap">{claim.claimDescription}</p>
           </div>
         </div>

         {/* Evidence Documents */}
         <div className="bg-white rounded-lg shadow">
           <div className="px-6 py-4 border-b border-gray-200">
             <h2 className="text-lg font-semibold flex items-center">
               <Image className="w-5 h-5 mr-2 text-blue-600" />
               Giấy tờ minh chứng
             </h2>
           </div>
           <div className="p-6">
             <EvidenceGallery 
               claim={claim} 
               onImageClick={openImageModal}
             />
           </div>
         </div>

         {/* Communication History */}
         <div className="bg-white rounded-lg shadow">
           <div className="px-6 py-4 border-b border-gray-200">
             <h2 className="text-lg font-semibold flex items-center">
               <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
               Lịch sử liên lạc
             </h2>
           </div>
           <div className="p-6">
             <CommunicationHistory communications={claim.communications} />
           </div>
         </div>
       </div>

       {/* Action Panel */}
       <div className="space-y-6">
         {/* Process Actions */}
         <div className="bg-white rounded-lg shadow">
           <div className="px-6 py-4 border-b border-gray-200">
             <h2 className="text-lg font-semibold flex items-center">
               <Settings className="w-5 h-5 mr-2 text-blue-600" />
               Xử lý yêu cầu
             </h2>
           </div>
           <div className="p-6">
             <ProcessClaimForm
               claim={claim}
               onSubmit={handleProcessClaim}
               processing={processing}
             />
           </div>
         </div>

         {/* Contact Actions */}
         <div className="bg-white rounded-lg shadow">
           <div className="px-6 py-4 border-b border-gray-200">
             <h2 className="text-lg font-semibold flex items-center">
               <Mail className="w-5 h-5 mr-2 text-blue-600" />
               Liên lạc
             </h2>
           </div>
           <div className="p-6 space-y-3">
             <button
               onClick={() => openContactModal('ADMIN_TO_CUSTOMER', claim.customerId, claim.customerName)}
               className="w-full btn btn-outline-success flex items-center justify-center"
             >
               <User className="w-4 h-4 mr-2" />
               Liên hệ khách hàng
             </button>
             <button
               onClick={() => openContactModal('ADMIN_TO_AGENCY', claim.agencyId, claim.agencyName)}
               className="w-full btn btn-outline-info flex items-center justify-center"
             >
               <Store className="w-4 h-4 mr-2" />
               Liên hệ Agency
             </button>
           </div>
         </div>

         {/* Status Timeline */}
         <div className="bg-white rounded-lg shadow">
           <div className="px-6 py-4 border-b border-gray-200">
             <h2 className="text-lg font-semibold flex items-center">
               <History className="w-5 h-5 mr-2 text-blue-600" />
               Lịch sử xử lý
             </h2>
           </div>
           <div className="p-6">
             <div className="relative">
               <div className="absolute left-4 top-6 bottom-0 w-0.5 bg-gray-200"></div>
               
               <div className="relative flex items-start mb-6">
                 <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                   <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                 </div>
                 <div className="ml-4">
                   <p className="font-medium text-gray-900">Đã nộp</p>
                   <p className="text-sm text-gray-500">
                     {new Date(claim.submittedDate).toLocaleString('vi-VN')}
                   </p>
                 </div>
               </div>
               
               {claim.processedDate && (
                 <div className="relative flex items-start">
                   <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                     <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                   </div>
                   <div className="ml-4">
                     <p className="font-medium text-gray-900">Đã xử lý</p>
                     <p className="text-sm text-gray-500">
                       {new Date(claim.processedDate).toLocaleString('vi-VN')}
                     </p>
                     {claim.processedByName && (
                       <p className="text-xs text-gray-400">
                         Bởi: {claim.processedByName}
                       </p>
                     )}
                   </div>
                 </div>
               )}
             </div>
           </div>
         </div>
       </div>
     </div>

     {/* Contact Modal */}
     <ContactModal
       show={contactModal.show}
       onClose={closeContactModal}
       onSubmit={handleContactSubmit}
       type={contactModal.type}
       claimId={parseInt(claimId)}
       recipientId={contactModal.recipientId}
       recipientName={contactModal.recipientName}
       claimCode={claim.claimCode}
     />

     {/* Image Modal */}
     <ImageModal
       show={imageModal.show}
       onClose={closeImageModal}
       src={imageModal.src}
       title={imageModal.title}
     />
   </div>
 );
};

export default InsuranceReview;