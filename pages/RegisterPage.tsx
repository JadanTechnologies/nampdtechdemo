
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NIGERIAN_STATES } from '../constants';
import FileUpload from '../components/registration/FileUpload';
import { performOcrOnNin } from '../services/geminiService';
import { addMember } from '../services/mockApi';
import Spinner from '../components/ui/Spinner';
import { useGemini } from '../context/GeminiContext';

const steps = ['Personal Information', 'Business Details', 'Document Upload'];

const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    nin: '',
    phone: '',
    email: '',
    state: '',
    lga: '',
    businessName: '',
    businessAddress: '',
  });
  const [files, setFiles] = useState<{ passport: File | null; ninSlip: File | null; businessDoc: File | null }>({
    passport: null,
    ninSlip: null,
    businessDoc: null,
  });
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ocrError, setOcrError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const { ai, isGeminiAvailable } = useGemini();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: keyof typeof files, file: File | null) => {
    setFiles(prev => ({ ...prev, [name]: file }));
    if (name === 'ninSlip' && file) {
      handleOcr(file);
    }
  };

  const handleOcr = async (file: File) => {
    setIsOcrLoading(true);
    setOcrError('');
    if (!isGeminiAvailable) {
        setOcrError('OCR service is not configured. Please enter details manually.');
    }
    try {
      const result = await performOcrOnNin(file, ai);
      if (result && result.fullName && result.nin) {
        setFormData(prev => ({ ...prev, fullName: result.fullName, nin: result.nin }));
      } else {
        setOcrError('Could not extract information. Please enter manually.');
      }
    } catch (error) {
      setOcrError('An error occurred during scanning. Please enter manually.');
    } finally {
      setIsOcrLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
        await addMember({
            userId: `new-user-${Date.now()}`,
            ...formData,
            // In a real app, these would be URLs from a storage service
            passportPhotoUrl: files.passport ? URL.createObjectURL(files.passport) : undefined,
            ninSlipUrl: files.ninSlip ? URL.createObjectURL(files.ninSlip) : undefined,
            businessDocUrl: files.businessDoc ? URL.createObjectURL(files.businessDoc) : undefined,
        });
        // On success, show a confirmation message and redirect
        alert('Registration successful! Your application is now pending approval. You will be notified via email.');
        navigate('/login');
    } catch (error) {
        setSubmitError('Failed to submit registration. Please try again.');
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h3 className="text-xl font-semibold mb-4 text-dark">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div>
                <label htmlFor="nin" className="block text-sm font-medium text-gray-700">National Identity Number (NIN)</label>
                <input type="text" name="nin" value={formData.nin} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State of Residence</label>
                <select name="state" value={formData.state} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                  <option value="">Select State</option>
                  {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="lga" className="block text-sm font-medium text-gray-700">LGA of Residence</label>
                <input type="text" name="lga" value={formData.lga} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h3 className="text-xl font-semibold mb-4 text-dark">Business Details (Optional)</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700">Business Address</label>
                <input type="text" name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-xl font-semibold mb-4 text-dark">Document Upload</h3>
             {isOcrLoading && (
                <div className="flex items-center gap-2 p-3 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg" role="alert">
                    <Spinner size="sm"/>
                    <span className="font-medium">Scanning NIN slip...</span> This may take a moment.
                </div>
            )}
            {ocrError && <p className="text-red-500 text-sm mb-4">{ocrError}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FileUpload label="Passport Photograph" onFileChange={(f) => handleFileChange('passport', f)} acceptedTypes="image/jpeg,image/png" required />
              <FileUpload label="NIN Slip" onFileChange={(f) => handleFileChange('ninSlip', f)} acceptedTypes="image/jpeg,image/png" required />
              <FileUpload label="Business Document (CAC)" onFileChange={(f) => handleFileChange('businessDoc', f)} acceptedTypes="image/jpeg,image/png,application/pdf" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary">New Member Registration</h1>
            <p className="text-dark/70 mt-2">Join the National Association of Mobile Phone Technicians</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="mb-8">
            <ol className="flex items-center w-full">
              {steps.map((step, index) => (
                <li key={index} className={`flex w-full items-center ${index < steps.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:border-4 after:inline-block" : ""}`}>
                  <span className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {index + 1}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="min-h-[300px]">
            {renderStepContent()}
          </div>
            
          {submitError && <p className="text-red-500 text-center text-sm mt-4">{submitError}</p>}

          <div className="mt-8 flex justify-between">
            {currentStep > 0 ? (
              <button onClick={prevStep} className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 transition">Back</button>
            ) : <div></div>}
            
            {currentStep < steps.length - 1 ? (
              <button onClick={nextStep} className="bg-primary text-white py-2 px-6 rounded-md hover:bg-secondary transition">Next</button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition flex items-center gap-2">
                {isSubmitting ? <><Spinner size="sm" /> Submitting...</> : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
