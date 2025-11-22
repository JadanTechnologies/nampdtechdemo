import React, { useState, useEffect } from 'react';
import { MemberApplication } from '../../types';
import { NIGERIAN_STATES } from '../../constants';
import { NIGERIAN_STATES_AND_LGAS } from '../../data/locations';
import Spinner from '../ui/Spinner';

interface EditMemberModalProps {
    member: MemberApplication;
    onClose: () => void;
    onSave: (updatedMember: MemberApplication) => Promise<void>;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ member, onClose, onSave }) => {
    const [formData, setFormData] = useState<MemberApplication>(member);
    const [isSaving, setIsSaving] = useState(false);
    const [lgas, setLgas] = useState<string[]>([]);

    useEffect(() => {
        if (formData.state) {
            setLgas(NIGERIAN_STATES_AND_LGAS[formData.state] || []);
        }
    }, [formData.state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    const inputClasses = "mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-secondary focus:border-secondary transition";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="p-6 border-b dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Edit Member: {member.fullName}</h3>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={inputClasses} required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClasses} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClasses} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">NIN</label>
                                <input type="text" name="nin" value={formData.nin} disabled className={`${inputClasses} bg-gray-100 dark:bg-gray-700 cursor-not-allowed`} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                                <select name="state" value={formData.state} onChange={handleInputChange} className={inputClasses} required>
                                    {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">LGA</label>
                                <select name="lga" value={formData.lga} onChange={handleInputChange} className={inputClasses} disabled={!formData.state} required>
                                    <option value="">Select LGA</option>
                                    {lgas.map(lga => <option key={lga} value={lga}>{lga}</option>)}
                                </select>
                            </div>
                             <div className="md:col-span-2"><hr className="dark:border-gray-700"/></div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Name</label>
                                <input type="text" name="businessName" value={formData.businessName || ''} onChange={handleInputChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Address</label>
                                <input type="text" name="businessAddress" value={formData.businessAddress || ''} onChange={handleInputChange} className={inputClasses} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-6 space-x-2 border-t dark:border-gray-700 mt-auto">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-dark dark:bg-gray-600 dark:text-gray-200 py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
                        <button type="submit" disabled={isSaving} className="bg-primary text-white py-2 px-6 rounded-md hover:bg-secondary transition inline-flex items-center gap-2">
                            {isSaving ? <><Spinner size="sm"/> Saving...</> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMemberModal;
