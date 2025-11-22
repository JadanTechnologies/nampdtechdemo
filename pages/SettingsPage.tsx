
import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { UserRole } from '../types';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    enableRegistrations: true,
    maintenanceMode: false,
    registrationFee: 10000,
  });

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: checked }));
  };
  
  const adminUsers = MOCK_USERS.filter(u => u.role !== UserRole.MEMBER);

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Platform Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Configuration */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-dark mb-4 border-b pb-2">System Configuration</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="enableRegistrations" className="font-medium text-gray-700">Enable New Registrations</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="enableRegistrations" name="enableRegistrations" className="sr-only peer" checked={settings.enableRegistrations} onChange={handleToggleChange} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="maintenanceMode" className="font-medium text-gray-700">Enable Maintenance Mode</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="maintenanceMode" name="maintenanceMode" className="sr-only peer" checked={settings.maintenanceMode} onChange={handleToggleChange} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div>
              <label htmlFor="registrationFee" className="block text-sm font-medium text-gray-700">Registration Fee (₦)</label>
              <input type="number" name="registrationFee" id="registrationFee" value={settings.registrationFee} onChange={(e) => setSettings(prev => ({...prev, registrationFee: parseInt(e.target.value)}))} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
             <button className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">Save Configuration</button>
          </div>
        </div>
        
        {/* Manage Admins */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-dark mb-4 border-b pb-2">Manage Admins</h2>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Role</th>
                  <th scope="col" className="px-6 py-3">State</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map(user => (
                   <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{user.email}</td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td className="px-6 py-4">{user.state || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <button className="font-medium text-red-600 hover:underline">Remove</button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
           <button className="mt-4 w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary transition">Add New Admin</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
