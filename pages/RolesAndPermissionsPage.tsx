
import React, { useState, useEffect } from 'react';
import { Role, Permission, ALL_PERMISSIONS } from '../types';
import { getRoles, addRole, updateRole, deleteRole } from '../services/mockApi';
import Spinner from '../components/ui/Spinner';
import Toast from '../components/ui/Toast';

const RolesAndPermissionsPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const fetchRoles = async () => {
        setLoading(true);
        setRoles(await getRoles());
        setLoading(false);
    };

    useEffect(() => {
        fetchRoles();
    }, []);
    
    const openModalForCreate = () => {
        setEditingRole({ id: '', name: '', description: '', permissions: [] });
        setIsModalOpen(true);
    };
    
    const openModalForEdit = (role: Role) => {
        setEditingRole(role);
        setIsModalOpen(true);
    };
    
    const handleDelete = async (roleId: string) => {
        if(window.confirm('Are you sure you want to delete this role? This cannot be undone.')) {
            await deleteRole(roleId);
            setToastMessage('Role deleted successfully!');
            fetchRoles();
        }
    };

    const handleSave = async (role: Role) => {
        if (role.id) {
            await updateRole(role.id, role);
            setToastMessage('Role updated successfully!');
        } else {
            await addRole({ name: role.name, description: role.description, permissions: role.permissions });
            setToastMessage('Role created successfully!');
        }
        setIsModalOpen(false);
        setEditingRole(null);
        fetchRoles();
    };


    return (
        <div>
             {toastMessage && <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />}
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-dark dark:text-gray-100">Roles & Permissions</h1>
                 <button onClick={openModalForCreate} className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition">
                     Create New Role
                 </button>
            </div>
            {loading ? <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div> : (
                <div className="space-y-6">
                    {roles.map((role) => (
                        <div key={role.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-dark dark:text-gray-100">{role.name}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{role.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openModalForEdit(role)} className="text-sm text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(role.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                                </div>
                            </div>
                            <div className="border-t dark:border-gray-700 my-4"></div>
                            {role.permissions.length > 0 ? (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {role.permissions.map(permission => (
                                        <li key={permission} className="flex items-center text-sm">
                                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            <span className="text-gray-700 dark:text-gray-300 capitalize">{permission.replace(/_/g, ' ')}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">This role has no special permissions.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {isModalOpen && editingRole && (
                <RoleEditorModal 
                    role={editingRole} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSave} 
                />
            )}
        </div>
    );
};


// Role Editor Modal Component
interface RoleEditorModalProps {
    role: Role;
    onClose: () => void;
    onSave: (role: Role) => void;
}
const RoleEditorModal: React.FC<RoleEditorModalProps> = ({ role, onClose, onSave }) => {
    const [formData, setFormData] = useState<Role>(role);

    const handlePermissionChange = (permission: Permission, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            permissions: checked 
                ? [...prev.permissions, permission]
                : prev.permissions.filter(p => p !== permission)
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="p-6 border-b dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{role.id ? 'Edit Role' : 'Create New Role'}</h3>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role Name</label>
                            <input type="text" id="name" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} required className="mt-1 block w-full border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea id="description" value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} rows={2} className="mt-1 block w-full border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md shadow-sm" />
                        </div>
                        <div>
                             <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Permissions</h4>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                {ALL_PERMISSIONS.map(p => (
                                    <label key={p} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.permissions.includes(p)}
                                            onChange={(e) => handlePermissionChange(p, e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{p.replace(/_/g, ' ')}</span>
                                    </label>
                                ))}
                             </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-6 space-x-2 border-t dark:border-gray-700 mt-auto">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-dark dark:bg-gray-600 dark:text-gray-200 py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="bg-primary text-white py-2 px-6 rounded-md hover:bg-secondary">Save Role</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RolesAndPermissionsPage;
