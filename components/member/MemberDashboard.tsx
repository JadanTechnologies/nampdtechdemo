
import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { MembershipStatus } from '../../types';
import Spinner from '../ui/Spinner';
import { addPayment, getPaymentsByMemberId } from '../../services/mockApi';
import { updateMember } from '../../services/mockApi';

const MemberDashboard: React.FC = () => {
  const { user, updateUserMemberDetails } = useAuth();
  const [isPaying, setIsPaying] = React.useState(false);

  useEffect(() => {
    // Refresh user details on mount to get latest status
    updateUserMemberDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || !user.memberDetails) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div>;
  }

  const { memberDetails } = user;
  
  const handlePayment = async () => {
    if (!memberDetails) return;
    setIsPaying(true);
    await addPayment(memberDetails, 'Registration Fee', 10000);
    await addPayment(memberDetails, 'Annual Dues', 5000);
    await updateMember(memberDetails.id, { status: MembershipStatus.ACTIVE });
    await updateUserMemberDetails();
    setIsPaying(false);
  }

  const StatusCard = ({ status, message, action }: { status: string, message: string, action?: React.ReactNode }) => (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <p className="text-sm text-gray-500 mb-2">Your Membership Status</p>
      <h2 className="text-3xl font-bold text-primary mb-4">{status}</h2>
      <p className="text-dark/80 mb-6 max-w-md mx-auto">{message}</p>
      {action}
    </div>
  );

  const renderContent = () => {
    switch (memberDetails.status) {
      case MembershipStatus.PENDING_CHAIRMAN:
        return <StatusCard status="Pending Chairman Approval" message="Your application has been submitted and is awaiting review by your local Chairman. You will be notified once a decision is made." />;
      case MembershipStatus.PENDING_STATE:
        return <StatusCard status="Pending State Admin Approval" message="Your application has been approved by the Chairman and is now with the State Admin for final verification. This may take a few business days." />;
      case MembershipStatus.PENDING_PAYMENT:
        return <StatusCard 
                    status="Awaiting Payment" 
                    message="Congratulations! Your application has been approved. Please complete your registration by paying the required fees."
                    action={
                        <button 
                            onClick={handlePayment}
                            disabled={isPaying}
                            className="bg-accent text-primary font-bold py-3 px-8 rounded-md hover:opacity-90 transition inline-flex items-center gap-2"
                        >
                            {isPaying ? <><Spinner size="sm"/> Processing...</> : 'Pay Registration Fee (₦15,000)'}
                        </button>
                    }
                />;
      case MembershipStatus.ACTIVE:
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">Welcome, {memberDetails.fullName}!</h2>
            <p className="text-dark/80 mb-6 max-w-md mx-auto">Your membership is active. Explore your portal features below.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/id-card" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">View Digital ID</Link>
              <Link to="/certificate" className="bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary transition">Get Certificate</Link>
              <Link to="/profile" className="bg-gray-200 text-dark py-2 px-4 rounded-md hover:bg-gray-300 transition">Manage Profile</Link>
            </div>
          </div>
        );
      case MembershipStatus.REJECTED:
        return <StatusCard status="Application Rejected" message="We regret to inform you that your application was not successful at this time. Please contact support for more information." />;
      default:
        return <div>Loading status...</div>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Member Dashboard</h1>
      {renderContent()}
    </div>
  );
};

export default MemberDashboard;
