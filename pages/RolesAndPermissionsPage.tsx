
import React from 'react';
import { UserRole, Permission } from '../types';

const rolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.SUPER_ADMIN]: ['manage_members', 'approve_applications', 'view_financials', 'manage_settings', 'send_communications', 'manage_roles'],
    [UserRole.STATE_ADMIN]: ['manage_members', 'approve_applications', 'view_financials'],
    [UserRole.CHAIRMAN]: ['manage_members', 'approve_applications'],
    [UserRole.MEMBER]: [],
};


const RolesAndPermissionsPage: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-dark">Roles & Permissions</h1>
                 <button className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition disabled:opacity-50" disabled>
                     Create New Role (Coming Soon)
                 </button>
            </div>
            <div className="space-y-6">
                {Object.entries(rolePermissions).map(([role, permissions]) => (
                    <div key={role} className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-dark mb-4 border-b pb-2">{role}</h2>
                        {permissions.length > 0 ? (
                             <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {permissions.map(permission => (
                                    <li key={permission} className="flex items-center text-sm">
                                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        <span className="text-gray-700">{permission.replace(/_/g, ' ')}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">This role has no special permissions.</p>
                        )}
                       
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RolesAndPermissionsPage;
