// components/insurance/EvidenceGallery.jsx
import React from 'react';
import { FileText, Image, FileCheck, Stethoscope, Plus } from 'lucide-react';

const EvidenceGallery = ({ claim, onImageClick }) => {
  const EvidenceSection = ({ title, urls, icon: Icon, altText }) => {
    if (!urls || urls.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Icon className="w-4 h-4 mr-2 text-blue-600" />
          {title}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {urls.map((url, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => onImageClick(url, `${title} ${index + 1}`)}
            >
              <img
                src={url}
                alt={`${altText} ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Image className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const hasAnyEvidence = 
    claim.customerIdCardFrontUrl ||
    claim.customerIdCardBackUrl ||
    (claim.medicalBillUrls && claim.medicalBillUrls.length > 0) ||
    (claim.testResultUrls && claim.testResultUrls.length > 0) ||
    (claim.doctorReportUrls && claim.doctorReportUrls.length > 0) ||
    (claim.otherEvidenceUrls && claim.otherEvidenceUrls.length > 0);

  if (!hasAnyEvidence) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Chưa có giấy tờ minh chứng nào</p>
      </div>
    );
  }

  return (
    <div>
      {/* ID Card */}
      {(claim.customerIdCardFrontUrl || claim.customerIdCardBackUrl) && (
        <EvidenceSection
          title="CCCD/CMND"
          urls={[
            claim.customerIdCardFrontUrl,
            claim.customerIdCardBackUrl
          ].filter(Boolean)}
          icon={FileText}
          altText="CCCD/CMND"
        />
      )}

      {/* Medical Bills */}
      <EvidenceSection
        title="Hóa đơn y tế"
        urls={claim.medicalBillUrls}
        icon={FileCheck}
        altText="Hóa đơn y tế"
      />

      {/* Test Results */}
      <EvidenceSection
        title="Kết quả xét nghiệm"
        urls={claim.testResultUrls}
        icon={FileCheck}
        altText="Kết quả xét nghiệm"
      />

      {/* Doctor Reports */}
      <EvidenceSection
        title="Báo cáo bác sĩ"
        urls={claim.doctorReportUrls}
        icon={Stethoscope}
        altText="Báo cáo bác sĩ"
      />

      {/* Other Evidence */}
      <EvidenceSection
        title="Minh chứng khác"
        urls={claim.otherEvidenceUrls}
        icon={Plus}
        altText="Minh chứng khác"
      />
    </div>
  );
};

export default EvidenceGallery;