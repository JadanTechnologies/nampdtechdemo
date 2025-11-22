import React, { useState, useEffect } from 'react';
import { useSettings, Settings } from '../context/SettingsContext';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, form: 'branding' | 'settings') => {
      const { name, value } = e.target;
      const keys = name.split('.');
      
      const setForm = form === 'branding' ? setBrandingForm : setSettingsForm as any;

      if (keys.length === 2) {
          const [parent, child] = keys;
          setForm((prev: any) => ({
              ...prev,
              [parent]: { ...prev[parent], [child]: value }
          }));
      } else {
          setForm((prev: any) => ({...prev, [name]: value }));
      }
  }
  
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>, form: 'branding' | 'settings') => {
    const { name, checked } = e.target;
    const keys = name.split('.');
    const setForm = form === 'branding' ? setBrandingForm : setSettingsForm as any;

     if (keys.length === 2) {
          const [parent, child] = keys;
          setForm((prev: any) => ({
              ...prev,
              [parent]: { ...prev[parent], [child]: checked }
          }));
      } else {
          setForm((prev: any) => ({...prev, [name]: checked }));
      }
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

  const handleSave = (e: React.FormEvent, form: 'branding' | 'settings', message: string) => {
      e.preventDefault();
      if (form === 'branding') {
          updateBranding(brandingForm);
      } else {
          updateSettings(settingsForm);
      }
      setToastMessage(message);
  }

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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Branding Settings */}
        <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-1">
          <h2 className="text-xl font-semibold text-dark mb-4 border-b pb-2">Branding</h2>
           <form onSubmit={(e) => handleSave(e, 'branding', 'Branding saved!')} className="space-y-4">
                <div>
                    <label htmlFor="brandName" className="block text-sm font-medium text-gray-700">Brand Name</label>
                    <input type="text" name="brandName" id="brandName" value={brandingForm.brandName} onChange={(e) => handleInputChange(e, 'branding')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                 <div>
                    <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">Main Logo</label>
                    {brandingForm.logoUrl && <img src={brandingForm.logoUrl} alt="logo preview" className="h-16 w-auto my-2 bg-gray-100 p-2 rounded"/>}
                    <input type="file" name="logoUrl" id="logoUrl" onChange={(e) => handleFileChange(e, 'logoUrl')} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                </div>
                 <div className="flex items-center justify-between">
                    <label htmlFor="showLogoInHeader" className="font-medium text-gray-700">Show Logo in Header</label>
                    <input type="checkbox" id="showLogoInHeader" name="showLogoInHeader" checked={brandingForm.showLogoInHeader} onChange={(e) => handleToggleChange(e, 'branding')} />
                </div>
                 <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
                    <input type="email" name="contactEmail" id="contactEmail" value={brandingForm.contactEmail} onChange={(e) => handleInputChange(e, 'branding')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                 <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">Save Branding</button>
           </form>
        </div>
        
        <div className="space-y-8 lg:col-span-2">
            {/* Maintenance Mode */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-dark mb-4 border-b pb-2">Maintenance Mode</h2>
                <form onSubmit={(e) => handleSave(e, 'settings', 'Maintenance settings saved!')} className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <label htmlFor="maintenanceMode.enabled" className="font-medium text-blue-800">Enable Maintenance Mode</label>
                        <input type="checkbox" id="maintenanceMode.enabled" name="maintenanceMode.enabled" checked={settingsForm.maintenanceMode.enabled} onChange={(e) => handleToggleChange(e, 'settings')} />
                    </div>
                     <div>
                        <label htmlFor="maintenanceMode.message" className="block text-sm font-medium text-gray-700">Maintenance Message</label>
                        <textarea name="maintenanceMode.message" id="maintenanceMode.message" value={settingsForm.maintenanceMode.message} onChange={(e) => handleInputChange(e, 'settings')} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    {/* Placeholder for scheduling - can be implemented with a library like react-datetime */}
                    <p className="text-sm text-gray-500 text-center">Scheduling feature coming soon.</p>
                    <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">Save Maintenance Settings</button>
                </form>
            </div>

            {/* API Integrations */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-dark mb-4 border-b pb-2">API Integrations</h2>
                <form onSubmit={(e) => handleSave(e, 'settings', 'API keys saved!')} className="space-y-4">
                    <h3 className="font-semibold text-gray-600">Twilio (SMS)</h3>
                     <div>
                        <label htmlFor="apiKeys.twilioSid" className="block text-sm font-medium text-gray-700">Account SID</label>
                        <input type="password" name="apiKeys.twilioSid" id="apiKeys.twilioSid" value={settingsForm.apiKeys.twilioSid} onChange={(e) => handleInputChange(e, 'settings')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="apiKeys.twilioAuthToken" className="block text-sm font-medium text-gray-700">Auth Token</label>
                        <input type="password" name="apiKeys.twilioAuthToken" id="apiKeys.twilioAuthToken" value={settingsForm.apiKeys.twilioAuthToken} onChange={(e) => handleInputChange(e, 'settings')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <hr/>
                    <h3 className="font-semibold text-gray-600">Resend (Email)</h3>
                     <div>
                        <label htmlFor="apiKeys.resendApiKey" className="block text-sm font-medium text-gray-700">API Key</label>
                        <input type="password" name="apiKeys.resendApiKey" id="apiKeys.resendApiKey" value={settingsForm.apiKeys.resendApiKey} onChange={(e) => handleInputChange(e, 'settings')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <hr/>
                     <h3 className="font-semibold text-gray-600">Firebase (Push Notifications)</h3>
                     <div>
                        <label htmlFor="apiKeys.firebaseApiKey" className="block text-sm font-medium text-gray-700">API Key</label>
                        <input type="password" name="apiKeys.firebaseApiKey" id="apiKeys.firebaseApiKey" value={settingsForm.apiKeys.firebaseApiKey} onChange={(e) => handleInputChange(e, 'settings')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">Save API Keys</button>
                </form>
            </div>

            {/* Payment Gateway Settings */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-dark mb-4 border-b pb-2">Payment Gateways</h2>
                <form onSubmit={(e) => handleSave(e, 'settings', 'Payment settings saved!')} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="font-medium text-gray-700">Enable Paystack</label>
                        <input type="checkbox" name="paymentGateways.paystackEnabled" checked={settingsForm.paymentGateways.paystackEnabled} onChange={(e) => handleToggleChange(e, 'settings')} />
                    </div>
                     <div>
                        <label htmlFor="manualInstructions" className="block text-sm font-medium text-gray-700">Manual Payment Instructions</label>
                        <textarea name="paymentGateways.manualPaymentInstructions" id="manualInstructions" value={settingsForm.paymentGateways.manualPaymentInstructions} onChange={(e) => handleInputChange(e, 'settings')} rows={5} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">Save Payment Settings</button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
