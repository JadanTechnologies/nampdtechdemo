
import React, { useState, useEffect, useMemo } from 'react';
import { useSettings, Settings } from '../context/SettingsContext';
import { useBranding, Branding } from '../context/BrandingContext';
import Toast from '../components/ui/Toast';
import { NIGERIAN_STATES } from '../constants';
import { MemberApplication } from '../types';
import { getMembers, updateMember } from '../services/mockApi';
import Spinner from '../components/ui/Spinner';

const SettingsPage: React.FC = () => {
  const { branding, updateBranding } = useBranding();
  const { settings, updateSettings } = useSettings();
  
  const [brandingForm, setBrandingForm] = useState<Branding>(branding);
  const [settingsForm, setSettingsForm] = useState<Settings>(settings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [members, setMembers] = useState<MemberApplication[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  
  useEffect(() => {
    setBrandingForm(branding);
  }, [branding]);
  
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

   useEffect(() => {
        const fetchMembers = async () => {
            setMembersLoading(true);
            const allMembers = await getMembers();
            setMembers(allMembers.filter(m => m.status !== 'Deleted'));
            setMembersLoading(false);
        };
        fetchMembers();
    }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, form: 'branding' | 'settings') => {
      const { name, value } = e.target;
      const keys = name.split('.');
      
      const setForm = form === 'branding' ? setBrandingForm : setSettingsForm as any;

      setForm((prev: any) => {
          if (keys.length === 2) {
              const [parent, child] = keys;
              return {
                  ...prev,
                  [parent]: { ...prev[parent], [child]: value }
              };
          }
          return {...prev, [name]: value };
      });
  }
  
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>, form: 'branding' | 'settings') => {
    const { name, checked } = e.target;
    const keys = name.split('.');
    const setForm = form === 'branding' ? setBrandingForm : setSettingsForm as any;

    setForm((prev: any) => {
        if (keys.length === 2) {
            const [parent, child] = keys;
            return { ...prev, [parent]: { ...prev[parent], [child]: checked } };
        }
        return { ...prev, [name]: checked };
    });
  };

   const handleStateToggle = (state: string, checked: boolean) => {
        setSettingsForm(prev => {
            const currentStates = prev.communityHub.enabledStates;
            const newStates = checked
                ? [...currentStates, state]
                : currentStates.filter(s => s !== state);
            return {
                ...prev,
                communityHub: {
                    ...prev.communityHub,
                    enabledStates: newStates
                }
            };
        });
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
  
   const handleForumStatusChange = async (memberId: string, newStatus: 'active' | 'muted' | 'banned') => {
        const originalMembers = [...members];
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, forumStatus: newStatus } : m));
        try {
            await updateMember(memberId, { forumStatus: newStatus });
            setToastMessage('User forum status updated successfully.');
        } catch (error) {
            console.error('Failed to update forum status', error);
            setToastMessage('Failed to update status. Please try again.');
            setMembers(originalMembers);
        }
    };

    const filteredMembers = useMemo(() => members.filter(m => 
        m.fullName.toLowerCase().includes(memberSearchTerm.toLowerCase()) || 
        m.email.toLowerCase().includes(memberSearchTerm.toLowerCase())
    ), [members, memberSearchTerm]);

  const inputClasses = "mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white";

  return (
    <div>
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type="success" 
          onClose={() => setToastMessage(null)} 
        />
      )}
      <h1 className="text-3xl font-bold text-dark dark:text-gray-100 mb-6">Platform Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Branding Settings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg lg:col-span-1">
          <h2 className="text-xl font-semibold text-dark dark:text-gray-100 mb-4 border-b dark:border-gray-700 pb-2">Branding</h2>
           <form onSubmit={(e) => handleSave(e, 'branding', 'Branding saved!')} className="space-y-4">
                <div>
                    <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand Name</label>
                    <input type="text" name="brandName" id="brandName" value={brandingForm.brandName} onChange={(e) => handleInputChange(e, 'branding')} className={inputClasses} />
                </div>
                 <div>
                    <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Main Logo</label>
                    {brandingForm.logoUrl && <img src={brandingForm.logoUrl} alt="logo preview" className="h-16 w-auto my-2 bg-gray-100 dark:bg-gray-700 p-2 rounded"/>}
                    <input type="file" name="logoUrl" id="logoUrl" onChange={(e) => handleFileChange(e, 'logoUrl')} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                </div>
                 <div className="flex items-center justify-between">
                    <label htmlFor="showLogoInHeader" className="font-medium text-gray-700 dark:text-gray-300">Show Logo in Header</label>
                    <input type="checkbox" id="showLogoInHeader" name="showLogoInHeader" checked={brandingForm.showLogoInHeader} onChange={(e) => handleToggleChange(e, 'branding')} />
                </div>
                 <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                    <input type="email" name="contactEmail" id="contactEmail" value={brandingForm.contactEmail} onChange={(e) => handleInputChange(e, 'branding')} className={inputClasses} />
                </div>
                 <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">Save Branding</button>
           </form>
        </div>
        
        <div className="space-y-8 lg:col-span-2">
            {/* Maintenance Mode */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-dark dark:text-gray-100 mb-4 border-b dark:border-gray-700 pb-2">Maintenance Mode</h2>
                <form onSubmit={(e) => handleSave(e, 'settings', 'Maintenance settings saved!')} className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-500/30">
                        <label htmlFor="maintenanceMode.enabled" className="font-medium text-blue-800 dark:text-blue-300">Enable Maintenance Mode</label>
                        <input type="checkbox" id="maintenanceMode.enabled" name="maintenanceMode.enabled" checked={settingsForm.maintenanceMode.enabled} onChange={(e) => handleToggleChange(e, 'settings')} />
                    </div>
                     <div>
                        <label htmlFor="maintenanceMode.message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Message</label>
                        <textarea name="maintenanceMode.message" id="maintenanceMode.message" value={settingsForm.maintenanceMode.message} onChange={(e) => handleInputChange(e, 'settings')} rows={3} className={inputClasses} />
                    </div>
                    {/* Placeholder for scheduling - can be implemented with a library like react-datetime */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Scheduling feature coming soon.</p>
                    <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">Save Maintenance Settings</button>
                </form>
            </div>
            
             {/* Community Hub Settings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-dark dark:text-gray-100 mb-4 border-b dark:border-gray-700 pb-2">Community Hub</h2>
                <form onSubmit={(e) => handleSave(e, 'settings', 'Community Hub settings saved!')} className="space-y-4">
                     <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-500/30">
                        <label htmlFor="communityHub.enabled" className="font-medium text-blue-800 dark:text-blue-300">Enable Community Hub</label>
                        <input type="checkbox" id="communityHub.enabled" name="communityHub.enabled" checked={settingsForm.communityHub.enabled} onChange={(e) => handleToggleChange(e, 'settings')} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enabled States</label>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border dark:border-gray-600 rounded-md">
                            {NIGERIAN_STATES.map(state => (
                                <label key={state} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <input 
                                        type="checkbox" 
                                        checked={settingsForm.communityHub.enabledStates.includes(state)}
                                        onChange={(e) => handleStateToggle(state, e.target.checked)}
                                    />
                                    {state}
                                </label>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">Save Community Settings</button>
                </form>
            </div>

            {/* Community Hub User Management */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-dark dark:text-gray-100 mb-4 border-b dark:border-gray-700 pb-2">Community Hub User Management</h2>
                <div className="mb-4">
                    <input 
                        type="text"
                        placeholder="Search for a member by name or email..."
                        value={memberSearchTerm}
                        onChange={e => setMemberSearchTerm(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md ${inputClasses}`}
                    />
                </div>
                {membersLoading ? <div className="flex justify-center"><Spinner /></div> : (
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Member</th>
                                    <th scope="col" className="px-6 py-3">State</th>
                                    <th scope="col" className="px-6 py-3">Forum Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {filteredMembers.map(member => (
                                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{member.fullName}</td>
                                        <td className="px-6 py-4">{member.state}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={member.forumStatus}
                                                onChange={(e) => handleForumStatusChange(member.id, e.target.value as 'active' | 'muted' | 'banned')}
                                                className={`border-gray-300 rounded-md shadow-sm text-xs p-1 capitalize dark:bg-gray-600 dark:border-gray-500 ${
                                                    member.forumStatus === 'banned' ? 'bg-red-100 text-red-800 dark:text-red-300' :
                                                    member.forumStatus === 'muted' ? 'bg-yellow-100 text-yellow-800 dark:text-yellow-300' :
                                                    'bg-green-100 text-green-800 dark:text-green-300'
                                                }`}
                                            >
                                                <option value="active">Active</option>
                                                <option value="muted">Muted</option>
                                                <option value="banned">Banned</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredMembers.length === 0 && <p className="text-center py-4 text-gray-500 dark:text-gray-400">No members found.</p>}
                    </div>
                )}
            </div>

            {/* API Integrations */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-dark dark:text-gray-100 mb-4 border-b dark:border-gray-700 pb-2">API Keys & Integrations</h2>
                <form onSubmit={(e) => handleSave(e, 'settings', 'API keys saved!')} className="space-y-6">
                    {/* Communication */}
                    <fieldset className="border-t dark:border-gray-700 pt-4">
                        <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Communication</legend>
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-600 dark:text-gray-400">Twilio (SMS)</h3>
                             <div>
                                <label htmlFor="apiKeys.twilioSid" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account SID</label>
                                <input type="password" name="apiKeys.twilioSid" id="apiKeys.twilioSid" value={settingsForm.apiKeys.twilioSid} onChange={(e) => handleInputChange(e, 'settings')} className={inputClasses} />
                            </div>
                             <div>
                                <label htmlFor="apiKeys.twilioAuthToken" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Auth Token</label>
                                <input type="password" name="apiKeys.twilioAuthToken" id="apiKeys.twilioAuthToken" value={settingsForm.apiKeys.twilioAuthToken} onChange={(e) => handleInputChange(e, 'settings')} className={inputClasses} />
                            </div>
                            <h3 className="font-medium text-gray-600 dark:text-gray-400">Resend (Email)</h3>
                             <div>
                                <label htmlFor="apiKeys.resendApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">API Key</label>
                                <input type="password" name="apiKeys.resendApiKey" id="apiKeys.resendApiKey" value={settingsForm.apiKeys.resendApiKey} onChange={(e) => handleInputChange(e, 'settings')} className={inputClasses} />
                            </div>
                        </div>
                    </fieldset>
                    
                    {/* Conference */}
                    <fieldset className="border-t dark:border-gray-700 pt-4">
                         <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Conference Provider</legend>
                         <div className="flex gap-4 mb-4 text-gray-700 dark:text-gray-300">
                            {(['agora', 'zego', 'none'] as const).map(provider => (
                                <label key={provider} className="flex items-center gap-2">
                                    <input type="radio" name="conference.provider" value={provider} checked={settingsForm.conference.provider === provider} onChange={(e) => handleInputChange(e, 'settings')} />
                                    <span className="capitalize">{provider}</span>
                                </label>
                            ))}
                         </div>
                         {settingsForm.conference.provider === 'agora' && (
                             <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                                <h3 className="font-medium text-gray-600 dark:text-gray-400">Agora Keys</h3>
                                <div>
                                    <label htmlFor="apiKeys.agoraAppId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">App ID</label>
                                    <input type="password" name="apiKeys.agoraAppId" id="apiKeys.agoraAppId" value={settingsForm.apiKeys.agoraAppId} onChange={(e) => handleInputChange(e, 'settings')} className={inputClasses} />
                                </div>
                                <div>
                                    <label htmlFor="apiKeys.agoraAppCert" className="block text-sm font-medium text-gray-700 dark:text-gray-300">App Certificate</label>
                                    <input type="password" name="apiKeys.agoraAppCert" id="apiKeys.agoraAppCert" value={settingsForm.apiKeys.agoraAppCert} onChange={(e) => handleInputChange(e, 'settings')} className={inputClasses} />
                                </div>
                             </div>
                         )}
                         {settingsForm.conference.provider === 'zego' && (
                             <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                                <h3 className="font-medium text-gray-600 dark:text-gray-400">ZegoCloud Keys</h3>
                                <div>
                                    <label htmlFor="apiKeys.zegoAppId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">App ID</label>
                                    <input type="password" name="apiKeys.zegoAppId" id="apiKeys.zegoAppId" value={settingsForm.apiKeys.zegoAppId} onChange={(e) => handleInputChange(e, 'settings')} className={inputClasses} />
                                </div>
                                <div>
                                    <label htmlFor="apiKeys.zegoServerSecret" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Server Secret</label>
                                    <input type="password" name="apiKeys.zegoServerSecret" id="apiKeys.zegoServerSecret" value={settingsForm.apiKeys.zegoServerSecret} onChange={(e) => handleInputChange(e, 'settings')} className={inputClasses} />
                                </div>
                             </div>
                         )}
                    </fieldset>

                    {/* Payment Gateways */}
                    <fieldset className="border-t dark:border-gray-700 pt-4">
                        <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Payment Gateways</legend>
                        <div className="space-y-4">
                            {/* Paystack */}
                            <div className="space-y-2 p-4 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                                <h3 className="font-medium text-gray-600 dark:text-gray-400">Paystack</h3>
                                <div>
                                    <label htmlFor="apiKeys.paystackPublicKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Public Key</label>
                                    <input type="password" name="apiKeys.paystackPublicKey" id="apiKeys.paystackPublicKey" value={settingsForm.apiKeys.paystackPublicKey} onChange={(e) => handleInputChange(e, 'settings')} className={inputClasses} />
                                </div>
                                 <div>
                                    <label htmlFor="apiKeys.paystackSecretKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Secret Key</label>
                                    <input type="password" name="apiKeys.paystackSecretKey" id="apiKeys.paystackSecretKey" value={settingsForm.apiKeys.paystackSecretKey} onChange={(e) => handleInputChange(e, 'settings')} className={inputClasses} />
                                </div>
                            </div>
                             {/* Flutterwave */}
                             <div className="space-y-2 p-4 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                                <h3 className="font-medium text-gray-600 dark:text-gray-400">Flutterwave</h3>
                                <div>
                                    <label htmlFor="apiKeys.flutterwavePublicKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Public Key</label>
                                    <input type="password" name="apiKeys.flutterwavePublicKey" id="apiKeys.flutterwavePublicKey" value={settingsForm.apiKeys.flutterwavePublicKey} onChange={(e) => handleInputChange(e, 'settings')} className={inputClasses} />
                                </div>
                                 <div>
                                    <label htmlFor="apiKeys.flutterwaveSecretKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Secret Key</label>
                                    <input type="password" name="apiKeys.flutterwaveSecretKey" id="apiKeys.flutterwaveSecretKey" value={settingsForm.apiKeys.flutterwaveSecretKey} onChange={(e) => handleInputChange(e, 'settings')} className={inputClasses} />
                                </div>
                            </div>
                            {/* Monnify */}
                             <div className="space-y-2 p-4 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                                <h3 className="font-medium text-gray-600 dark:text-gray-400">Monnify</h3>
                                <div>
                                    <label htmlFor="apiKeys.monnifyApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">API Key</label>
                                    <input type="password" name="apiKeys.monnifyApiKey" id="apiKeys.monnifyApiKey" value={settingsForm.apiKeys.monnifyApiKey} onChange={(e) => handleInputChange(e, 'settings')} className={inputClasses} />
                                </div>
                                 <div>
                                    <label htmlFor="apiKeys.monnifyContractCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contract Code</label>
                                    <input type="password" name="apiKeys.monnifyContractCode" id="apiKeys.monnifyContractCode" value={settingsForm.apiKeys.monnifyContractCode} onChange={(e) => handleInputChange(e, 'settings')} className={inputClasses} />
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    
                    <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">Save API Keys</button>
                </form>
            </div>


            {/* Payment Gateway Settings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-dark dark:text-gray-100 mb-4 border-b dark:border-gray-700 pb-2">Payment Gateway Settings</h2>
                <form onSubmit={(e) => handleSave(e, 'settings', 'Payment settings saved!')} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Enable Paystack</label>
                        <input type="checkbox" name="paymentGateways.paystackEnabled" checked={settingsForm.paymentGateways.paystackEnabled} onChange={(e) => handleToggleChange(e, 'settings')} />
                    </div>
                     <div className="flex items-center justify-between">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Enable Flutterwave</label>
                        <input type="checkbox" name="paymentGateways.flutterwaveEnabled" checked={settingsForm.paymentGateways.flutterwaveEnabled} onChange={(e) => handleToggleChange(e, 'settings')} />
                    </div>
                     <div className="flex items-center justify-between">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Enable Monnify</label>
                        <input type="checkbox" name="paymentGateways.monnifyEnabled" checked={settingsForm.paymentGateways.monnifyEnabled} onChange={(e) => handleToggleChange(e, 'settings')} />
                    </div>
                     <div>
                        <label htmlFor="manualInstructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manual Payment Instructions</label>
                        <textarea name="paymentGateways.manualPaymentInstructions" id="manualInstructions" value={settingsForm.paymentGateways.manualPaymentInstructions} onChange={(e) => handleInputChange(e, 'settings')} rows={5} className={inputClasses} />
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
