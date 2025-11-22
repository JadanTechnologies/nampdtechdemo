
import React, { useState } from 'react';
import { MemberApplication } from '../../types';

interface DigitalIdCardProps {
  member: MemberApplication;
}

const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ member }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const verificationUrl = `${window.location.origin}${window.location.pathname}#/verify?id=${member.id}`;

  return (
    <div 
        className="w-[350px] h-[550px] perspective-1000 cursor-pointer" 
        onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front of the Card */}
        <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-4 border-primary dark:border-accent">
            <div className="bg-primary h-28 flex items-center justify-center text-white p-4">
                <h1 className="text-xl font-bold text-center">Nampdtech Member</h1>
            </div>
            <div className="flex flex-col items-center p-6 -mt-16">
                <img src={member.passportPhotoUrl || `https://i.pravatar.cc/150?u=${member.id}`} alt="Member passport" className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700 shadow-lg object-cover" />
                <h2 className="text-2xl font-bold text-dark dark:text-gray-100 mt-4">{member.fullName}</h2>
                <p className="text-primary font-semibold">Active Member</p>
                <div className="text-left w-full mt-6 space-y-3 text-sm text-dark dark:text-gray-300">
                    <p><strong>Member ID:</strong> {member.id.toUpperCase()}</p>
                    <p><strong>State:</strong> {member.state}</p>
                    <p><strong>Joined:</strong> {new Date(member.registrationDate).toLocaleDateString()}</p>
                </div>
            </div>
             <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400">
                National Association of Mobile Phone Technicians
             </div>
        </div>

        {/* Back of the Card */}
        <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-2xl rotate-y-180 border-4 border-primary dark:border-accent p-6 flex flex-col justify-between">
            <div>
                <h3 className="font-bold text-primary mb-4 text-center">Official Membership ID</h3>
                <div className="text-sm space-y-2 text-dark dark:text-gray-300">
                    <p><strong>Full Name:</strong><br/>{member.fullName}</p>
                    <p><strong>NIN:</strong><br/>{member.nin}</p>
                    <p><strong>Email:</strong><br/>{member.email}</p>
                    <p><strong>Phone:</strong><br/>{member.phone}</p>
                </div>
            </div>
            <div className="flex flex-col items-center">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verificationUrl)}`} alt="QR Code" className="w-32 h-32 bg-white p-1 rounded" />
                 <p className="text-xs text-gray-500 mt-2 text-center">Scan to verify membership</p>
            </div>
            <div className="text-xs text-gray-400 text-center border-t dark:border-gray-700 pt-2 mt-2">
                This card is the property of Nampdtech and must be returned upon request.
            </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalIdCard;
