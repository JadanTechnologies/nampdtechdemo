import React, { useState, useEffect } from 'react';
import { useSettings, Settings } from '../context/SettingsContext';
import { MOCK_USERS } from '../constants';
import { UserRole } from '../types';
import { useBranding, Branding } from '../context/BrandingContext';
import Toast from '../components/ui/Toast';

const SettingsPage: React.FC = () => {
  const { branding, updateBranding } = useBranding();
  const { settings, updateSettings } = useSettings();
  
  const [brandingForm, setBrandingForm] = useState<Branding>(branding);
  const [settingsForm, setSettingsForm] = useState<Settings>(settings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  useEffect(() => {
    setBrandingForm(branding);
  }, [branding]);
  
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const handleBrandingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setBrandingForm(prev => ({...prev, [name]: value }));
  }
  
  const handleBrandingToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setBrandingForm(prev => ({...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof Branding) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setBrandingForm(prev => ({...prev, [fieldName]: reader.result as string}));
        };
        reader.readAsDataURL(file);
    }
  }

  const handleBrandingSave = (e: React.FormEvent) => {
      e.preventDefault();
      updateBranding(brandingForm);
      setToastMessage('Branding settings saved successfully!');
  }

  const handleSettingsInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const keys = name.split('.');
      if (keys.length === 2) {
          const [parent, child] = keys as [keyof Settings, string];
          setSettingsForm(prev => ({
              ...prev,
              [parent]: {
                  ...(prev as any)[parent],
                  [child]: value,
              }
          }));
      }
  }

  const handleSettingsToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      const keys = name.split('.');
      if (keys.length === 2) {
          const [parent, child] = keys as [keyof Settings, string];
          setSettingsForm(prev => ({
              ...prev,
              [parent]: {
                  ...(prev as any)[parent],
                  [child]: checked,
              }
          }));
      }
  }

  const handleSettingsSave = (e: React.FormEvent, message: string) => {
      e.preventDefault();
      updateSettings(settingsForm);
      setToastMessage(message);
  }
  
  const adminUsers = MOCK_USERS.filter(u => u.role !== UserRole.MEMBER);

  return (
    <div>
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type="success" 
          onClose={() => setToastMessage(null)} 
        />
      )}
      <h1 className="text-3xl font-bold text-dark mb-6">Platform Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        
        {/* Branding Settings */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-dark mb-4 border-b pb-2">Branding Settings</h2>
           <form onSubmit={handleBrandingSave} className="space-y-4">
                <div>
                    <label htmlFor="brandName" className="block text-sm font-medium text-gray-700">Brand Name</label>
                    <input type="text" name="brandName" id="brandName" value={brandingForm.brandName} onChange={handleBrandingInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                 <div>
                    <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">Main Logo</label>
                    {brandingForm.logoUrl && <img src={brandingForm.logoUrl} alt="logo preview" className="h-16 w-auto my-2 bg-gray-100 p-2 rounded"/>}
                    <input type="file" name="logoUrl" id="logoUrl" onChange={(e) => handleFileChange(e, 'logoUrl')} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                </div>
                 <div>
                    <label htmlFor="faviconUrl" className="block text-sm font-medium text-gray-700">Favicon</label>
                    {brandingForm.faviconUrl && <img src={brandingForm.faviconUrl} alt="favicon preview" className="h-8 w-8 my-2 bg-gray-100 p-1 rounded"/>}
                    <input type="file" name="faviconUrl" id="faviconUrl" onChange={(e) => handleFileChange(e, 'faviconUrl')} accept="image/x-icon,image/png,image/svg+xml" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                </div>
                 <div>
                    <label htmlFor="cubeLogoUrl" className="block text-sm font-medium text-gray-700">3D Cube Logo (Landing Page)</label>
                    {brandingForm.cubeLogoUrl && <img src={brandingForm.cubeLogoUrl} alt="cube logo preview" className="h-16 w-16 my-2 bg-gray-100 p-2 rounded"/>}
                    <input type="file" name="cubeLogoUrl" id="cubeLogoUrl" onChange={(e) => handleFileChange(e, 'cubeLogoUrl')} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                </div>
                 <div className="flex items-center justify-between">
                    <label htmlFor="showLogoInHeader" className="font-medium text-gray-700">Show Logo in Header</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="showLogoInHeader" name="showLogoInHeader" className="sr-only peer" checked={brandingForm.showLogoInHeader} onChange={handleBrandingToggleChange} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                 <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
                    <input type="email" name="contactEmail" id="contactEmail" value={brandingForm.contactEmail} onChange={handleBrandingInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                 <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
                    <input type="tel" name="contactPhone" id="contactPhone" value={brandingForm.contactPhone} onChange={handleBrandingInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea name="address" id="address" value={brandingForm.address} onChange={handleBrandingInputChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                 <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">Save Branding</button>
           </form>
        </div>
        
        <div className="space-y-8">
            {/* Payment Gateway Settings */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-dark mb-4 border-b pb-2">Payment Gateways</h2>
                <form onSubmit={(e) => handleSettingsSave(e, 'Payment settings saved!')} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="font-medium text-gray-700">Enable Paystack</label>
                        <input type="checkbox" name="paymentGateways.paystackEnabled" className="toggle" checked={settingsForm.paymentGateways.paystackEnabled} onChange={handleSettingsToggleChange} />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="font-medium text-gray-700">Enable Monnify</label>
                        <input type="checkbox" name="paymentGateways.monnifyEnabled" className="toggle" checked={settingsForm.paymentGateways.monnifyEnabled} onChange={handleSettingsToggleChange} />
                    </div>
                     <div className="flex items-center justify-between">
                        <label className="font-medium text-gray-700">Enable Flutterwave</label>
                        <input type="checkbox" name="paymentGateways.flutterwaveEnabled" className="toggle" checked={settingsForm.paymentGateways.flutterwaveEnabled} onChange={handleSettingsToggleChange} />
                    </div>
                    <div>
                        <label htmlFor="manualInstructions" className="block text-sm font-medium text-gray-700">Manual Payment Instructions</label>
                        <textarea name="paymentGateways.manualPaymentInstructions" id="manualInstructions" value={settingsForm.paymentGateways.manualPaymentInstructions} onChange={handleSettingsInputChange} rows={5} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">Save Payment Settings</button>
                </form>
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