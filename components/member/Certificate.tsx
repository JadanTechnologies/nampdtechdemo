
import React from 'react';
import { MemberApplication } from '../../types';
import { useBranding } from '../../context/BrandingContext';

interface CertificateProps {
  member: MemberApplication;
}

const Certificate: React.FC<CertificateProps> = ({ member }) => {
  const { branding } = useBranding();
  const verificationUrl = `${window.location.origin}${window.location.pathname}#/verify?id=${member.id}`;

  return (
    <div className="w-full aspect-[11/8.5] border-8 border-primary bg-light dark:bg-white p-8 flex flex-col relative overflow-hidden text-black">
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-8xl md:text-9xl font-black text-primary opacity-5 transform rotate-[-30deg] whitespace-nowrap">
          {branding.brandName}
        </h1>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
                {branding.logoUrl && <img src={branding.logoUrl} alt="Logo" className="h-20 w-20 object-contain" />}
                <div className="text-left">
                    <h1 className="text-5xl font-bold text-dark" style={{ fontFamily: 'serif' }}>Certificate of Membership</h1>
                     <h3 className="mt-2 text-3xl font-bold text-dark">
                        {branding.brandName}
                    </h3>
                </div>
            </div>
             <img src={member.passportPhotoUrl || `https://i.pravatar.cc/150?u=${member.id}`} alt="Member passport" className="w-36 h-36 rounded-md border-4 border-primary object-cover shadow-lg" />
        </div>

        <div className="text-center flex-grow flex flex-col justify-center">
          <p className="mt-4 text-lg text-gray-600">This is to certify that</p>
          <h2 className="mt-6 text-4xl font-semibold text-primary" style={{ fontFamily: 'cursive' }}>
            {member.fullName}
          </h2>
          <div className="w-48 h-1 bg-primary mx-auto my-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            having met all the requirements and been approved by the board, is hereby recognized as an active and registered member.
          </p>
        </div>

        <div className="flex justify-between items-end text-sm">
          <div className="text-center">
            <p className="font-semibold text-lg" style={{ fontFamily: 'cursive' }}>Mr. John Doe</p>
            <hr className="border-t-2 border-dark my-1" />
            <p className="font-bold">Chairman</p>
          </div>
           <div className="text-center">
             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verificationUrl)}`} alt="QR Code" className="w-24 h-24 mx-auto" />
             <p className="text-xs text-gray-600 mt-1">Scan to verify</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Date Issued: {new Date().toLocaleDateString()}</p>
            <p className="text-gray-600">Member ID: {member.id.toUpperCase()}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg" style={{ fontFamily: 'cursive' }}>Mrs. Jane Smith</p>
            <hr className="border-t-2 border-dark my-1" />
            <p className="font-bold">President</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
