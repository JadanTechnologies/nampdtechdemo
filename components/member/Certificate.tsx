import React from 'react';
import { MemberApplication } from '../../types';

interface CertificateProps {
  member: MemberApplication;
}

const Certificate: React.FC<CertificateProps> = ({ member }) => {
  return (
    <div className="w-full aspect-[11/8.5] border-8 border-primary bg-light p-8 flex flex-col relative overflow-hidden">
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-8xl font-black text-primary opacity-5 transform rotate-[-30deg]">Nampdtech</h1>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-dark" style={{ fontFamily: 'serif' }}>Certificate of Membership</h1>
          <p className="mt-4 text-lg text-gray-600">This is to certify that</p>
          <h2 className="mt-6 text-4xl font-semibold text-primary" style={{ fontFamily: 'cursive' }}>
            {member.fullName}
          </h2>
          <div className="w-48 h-1 bg-primary mx-auto my-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            having met all the requirements and been approved by the board, is hereby recognized as an active and registered member of the
          </p>
          <h3 className="mt-4 text-3xl font-bold text-dark">
            National Association of Mobile Phone Technicians (Nampdtech)
          </h3>
        </div>

        <div className="mt-auto flex justify-between items-end text-sm">
          <div className="text-center">
            <p className="font-semibold" style={{ fontFamily: 'cursive' }}>Mr. John Doe</p>
            <hr className="border-t-2 border-dark my-1" />
            <p className="font-bold">Chairman</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Date Issued: {new Date().toLocaleDateString()}</p>
            <p className="text-gray-600">Member ID: {member.id.toUpperCase()}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold" style={{ fontFamily: 'cursive' }}>Mrs. Jane Smith</p>
            <hr className="border-t-2 border-dark my-1" />
            <p className="font-bold">President</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;