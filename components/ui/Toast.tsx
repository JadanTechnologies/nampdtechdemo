
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-dismiss after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const baseClasses = "fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center transition-transform transform animate-fade-in-down";
  const typeClasses = {
    success: 'bg-green-100 border border-green-400 text-green-700 dark:bg-green-900/50 dark:border-green-500/30 dark:text-green-300',
    error: 'bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-500/30 dark:text-red-300',
    info: 'bg-blue-100 border border-blue-400 text-blue-700 dark:bg-blue-900/50 dark:border-blue-500/30 dark:text-blue-300',
  };
  const iconPaths = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  }

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[type]} />
      </svg>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 -mr-2 p-1 text-lg font-semibold leading-none rounded-full hover:bg-black/10 dark:text-gray-300 dark:hover:bg-white/20 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
