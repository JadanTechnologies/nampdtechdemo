
import React from 'react';
import Certificate from '../components/member/Certificate';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

const CertificatePage: React.FC = () => {
    const { user } = useAuth();

    if (!user || !user.memberDetails) {
        return <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div>;
    }

    const handlePrint = () => {
        window.print();
    }

    return (
        <div>
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #certificate-container, #certificate-container * {
                            visibility: visible;
                        }
                        #certificate-container {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                        }
                        .dark #certificate-container {
                           background-color: white !important;
                        }
                    }
                `}
            </style>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark dark:text-gray-100">Membership Certificate</h1>
                <button 
                    onClick={handlePrint} 
                    className="bg-primary text-white py-2 px-6 rounded-md hover:bg-secondary transition inline-flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                    </svg>
                    Print Certificate
                </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">This is your official certificate of membership. You can print this document for your records.</p>
            <div id="certificate-container" className="bg-white p-4 shadow-2xl">
                 <Certificate member={user.memberDetails} />
            </div>
        </div>
    );
};

export default CertificatePage;