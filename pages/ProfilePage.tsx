
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import { NIGERIAN_STATES } from '../constants';
import { updateMember } from '../services/mockApi';

const ProfilePage: React.FC = () => {
  const { user, updateUserMemberDetails } = useAuth();
  
  const [formData, setFormData] = useState(user?.memberDetails || null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!formData) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
  };
  
  const handleSave = async () => {
      if(!formData) return;
      setIsSaving(true);
      await updateMember(formData.id, formData);
      await updateUserMemberDetails();
      setIsSaving(false);
      setIsEditing(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">My Profile</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-dark">Personal & Business Information</h2>
            {!isEditing && <button onClick={() => setIsEditing(true)} className="bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary transition text-sm">Edit Profile</button>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 disabled:cursor-not-allowed" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500">NIN</label>
                <input type="text" name="nin" value={formData.nin} disabled className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 disabled:cursor-not-allowed" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 disabled:cursor-not-allowed" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500">State</label>
                <select name="state" value={formData.state} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 disabled:cursor-not-allowed">
                    {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500">LGA</label>
                <input type="text" name="lga" value={formData.lga} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 disabled:cursor-not-allowed" />
            </div>
            <div className="md:col-span-2"><hr/></div>
            <div>
                <label className="block text-sm font-medium text-gray-500">Business Name</label>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 disabled:cursor-not-allowed" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500">Business Address</label>
                <input type="text" name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 disabled:cursor-not-allowed" />
            </div>
        </div>
        {isEditing && (
            <div className="mt-8 flex justify-end gap-4">
                <button onClick={() => { setIsEditing(false); setFormData(user?.memberDetails || null); }} className="bg-gray-200 text-dark py-2 px-6 rounded-md hover:bg-gray-300 transition">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="bg-primary text-white py-2 px-6 rounded-md hover:bg-secondary transition inline-flex items-center gap-2">
                    {isSaving ? <><Spinner size="sm"/> Saving...</> : 'Save Changes'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
