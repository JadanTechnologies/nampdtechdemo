
import React, { useState, useRef, useEffect } from 'react';

interface FileUploadProps {
  label: string;
  onFileChange: (file: File | null) => void;
  acceptedTypes: string;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onFileChange, acceptedTypes, required }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Simulate upload progress
    setIsUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setIsUploading(false);
                return 100;
            }
            return prev + 10;
        });
    }, 100);

    return () => {
        clearInterval(interval);
        URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    onFileChange(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
        <div className="space-y-1 text-center">
            {preview ? (
                <div className="relative group">
                    <img src={preview} alt="File preview" className="mx-auto h-24 w-auto rounded-md" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <button type="button" onClick={handleRemoveFile} className="text-white bg-red-500 rounded-full p-2 hover:bg-red-600">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : (
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
          <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
            <label htmlFor={label} className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary hover:text-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              <span>{file ? 'Replace file' : 'Upload a file'}</span>
              <input ref={fileInputRef} id={label} name={label} type="file" className="sr-only" onChange={handleFileChange} accept={acceptedTypes} />
            </label>
            {!file && <p className="pl-1">or drag and drop</p>}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 10MB</p>
          {file && <p className="text-xs text-gray-700 dark:text-gray-200 truncate">{file.name}</p>}
          {isUploading && progress < 100 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
