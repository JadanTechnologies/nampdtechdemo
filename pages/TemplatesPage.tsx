
import React, { useState, useEffect } from 'react';
import { Template } from '../types';
import { getTemplates, addTemplate, updateTemplate, deleteTemplate } from '../services/mockApi';
import Spinner from '../components/ui/Spinner';
import Toast from '../components/ui/Toast';

const TemplatesPage: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const fetchTemplates = async () => {
        setLoading(true);
        setTemplates(await getTemplates());
        setLoading(false);
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const openModalForCreate = () => {
        setEditingTemplate({ id: '', name: '', type: 'email', content: '' });
        setIsModalOpen(true);
    };

    const openModalForEdit = (template: Template) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };

    const handleDelete = async (templateId: string) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            await deleteTemplate(templateId);
            setToastMessage('Template deleted successfully!');
            fetchTemplates();
        }
    };

    const handleSave = async (template: Template) => {
        if (template.id) {
            await updateTemplate(template.id, template);
            setToastMessage('Template updated successfully!');
        } else {
            await addTemplate({ name: template.name, type: template.type, content: template.content });
            setToastMessage('Template created successfully!');
        }
        setIsModalOpen(false);
        setEditingTemplate(null);
        fetchTemplates();
    };

    return (
        <div>
            {toastMessage && <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark">Communication Templates</h1>
                <button onClick={openModalForCreate} className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">
                    Create New Template
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {loading ? <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div> : (
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Type</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.map(template => (
                                    <tr key={template.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{template.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${template.type === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                {template.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-4">
                                            <button onClick={() => openModalForEdit(template)} className="font-medium text-blue-600 hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(template.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {templates.length === 0 && <p className="text-center py-8 text-gray-500">No templates created yet.</p>}
                    </div>
                )}
            </div>
            {isModalOpen && editingTemplate && (
                <TemplateEditorModal
                    template={editingTemplate}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

interface TemplateEditorModalProps {
    template: Template;
    onClose: () => void;
    onSave: (template: Template) => void;
}

const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({ template, onClose, onSave }) => {
    const [formData, setFormData] = useState<Template>(template);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="p-6 border-b">
                        <h3 className="text-xl font-semibold text-gray-900">{template.id ? 'Edit Template' : 'Create New Template'}</h3>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name</label>
                            <input type="text" id="name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                         <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Template Type</label>
                            <select id="type" value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value as 'sms' | 'email' }))} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                <option value="email">Email</option>
                                <option value="sms">SMS</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                            <textarea id="content" value={formData.content} onChange={e => setFormData(p => ({ ...p, content: e.target.value }))} rows={10} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            <p className="text-xs text-gray-500 mt-1">Available placeholders: `{"{{fullName}}"}`, `{"{{email}}"}`, `{"{{memberId}}"}`.</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-6 space-x-2 border-t mt-auto">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-dark py-2 px-6 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-primary text-white py-2 px-6 rounded-md hover:bg-secondary">Save Template</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TemplatesPage;
