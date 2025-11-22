
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Communication, MembershipStatus, UserRole } from '../../types';
import Spinner from '../ui/Spinner';
import { getCommunications } from '../../services/mockApi';

const MemberDashboard: React.FC = () => {
  const { user, updateUserMemberDetails } = useAuth();
  const [announcements, setAnnouncements] = useState<Communication[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Refresh user details on mount to get latest status
    updateUserMemberDetails();
    
    const fetchAnnouncements = async () => {
        if (!user) return;
        const allComms = await getCommunications();
        const userAnnouncements = allComms.filter(comm => comm.targetRoles.includes(user.role));
        setAnnouncements(userAnnouncements.slice(0, 3)); // Show latest 3
    }
    fetchAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user || !user.memberDetails) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div>;
  }

  const { memberDetails } = user;

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
                            onClick={() => navigate('/payments')}
                            className="bg-accent text-primary font-bold py-3 px-8 rounded-md hover:opacity-90 transition inline-flex items-center gap-2"
                        >
                           Make Payment (₦15,000)
                        </button>
                    }
                />;
      case MembershipStatus.PENDING_MANUAL_PAYMENT_CONFIRMATION:
         return <StatusCard status="Payment Under Review" message="We have received your payment submission. It is currently being reviewed by our administrators. You will be notified once it's confirmed." />;
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

      {announcements.length > 0 && (
          <div className="mt-8">
              <h2 className="text-2xl font-bold text-dark mb-4">Recent Announcements</h2>
              <div className="space-y-4">
                  {announcements.map(comm => (
                      <div key={comm.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-secondary">
                          <h3 className="font-bold text-dark">{comm.title}</h3>
                          <p className="text-sm text-gray-600">{comm.content}</p>
                          <p className="text-xs text-gray-400 mt-2">Posted on {new Date(comm.date).toLocaleDateString()}</p>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default MemberDashboard;