
import React, { useState, useEffect } from 'react';
import { UserRole, Template } from '../types';
import { addCommunication, getTemplates } from '../services/mockApi';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/ui/Toast';

const CommunicationPage: React.FC = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [targetRoles, setTargetRoles] = useState<UserRole[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            const fetchedTemplates = await getTemplates();
            setTemplates(fetchedTemplates.filter(t => t.type === 'email')); // Assuming announcements are emails
        }
        fetchTemplates();
    }, []);

    const handleRoleChange = (role: UserRole) => {
        setTargetRoles(prev => 
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };
    
    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = e.target.value;
        const selectedTemplate = templates.find(t => t.id === templateId);
        if (selectedTemplate) {
            setTitle(prev => prev || selectedTemplate.name); // Don't overwrite if title is already set
            setContent(selectedTemplate.content);
        } else {
            // Reset if "Select a template" is chosen
            setContent('');
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content || targetRoles.length === 0 || !user) {
            alert('Please fill all fields and select at least one target role.');
            return;
        }

        setIsSubmitting(true);
        await addCommunication({
            title,
            content,
            targetRoles,
            author: user.email,
        });
        
        setIsSubmitting(false);
        setTitle('');
        setContent('');
        setTargetRoles([]);
        setToastMessage('Announcement sent successfully!');
    };
    
    const allRoles = [UserRole.MEMBER, UserRole.CHAIRMAN, UserRole.STATE_ADMIN];

    return (
        <div>
             {toastMessage && (
                <Toast 
                message={toastMessage} 
                type="success" 
                onClose={() => setToastMessage(null)} 
                />
            )}
            <h1 className="text-3xl font-bold text-dark dark:text-gray-100 mb-6">Send Communication</h1>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <form onSubmit={handleSubmit}>
                     <div className="mb-6">
                        <label htmlFor="template" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Load from Template (Optional)
                        </label>
                        <select
                            id="template"
                            onChange={handleTemplateChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:ring-secondary focus:border-secondary transition"
                        >
                            <option value="">Select a template</option>
                            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Announcement Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:ring-secondary focus:border-secondary transition"
                            placeholder="e.g., Annual General Meeting"
                            required
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Message Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            className="w-full px-4 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:ring-secondary focus:border-secondary transition"
                            placeholder="Enter the full details of your announcement here..."
                            required
                        />
                         {/* FIX: Simplified the placeholder text expression to avoid potential parsing issues. */}
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">You can use placeholders like {'{{fullName}}'} or {'{{email}}'}.</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Target Audience (Select at least one)
                        </label>
                        <div className="flex flex-wrap gap-4">
                            {allRoles.map(role => (
                                <label key={role} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={targetRoles.includes(role)}
                                        onChange={() => handleRoleChange(role)}
                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">{role}s</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                         <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary text-white py-2 px-6 rounded-md hover:bg-secondary transition flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? <><Spinner size="sm" /> Sending...</> : 'Send Announcement'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommunicationPage;
