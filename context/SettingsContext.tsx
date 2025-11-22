import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { MaintenanceSettings, ApiKeySettings } from '../types';

export interface PaymentGatewaySettings {
  paystackEnabled: boolean;
  monnifyEnabled: boolean;
  flutterwaveEnabled: boolean;
  manualPaymentInstructions: string;
}

export interface Settings {
  paymentGateways: PaymentGatewaySettings;
  maintenanceMode: MaintenanceSettings;
  apiKeys: ApiKeySettings;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  loading: boolean;
}

const defaultSettings: Settings = {
    paymentGateways: {
        paystackEnabled: true,
        monnifyEnabled: false,
        flutterwaveEnabled: false,
        manualPaymentInstructions: 'Please make a payment to the following account:\n\nBank: Zenith Bank\nAccount Number: 1234567890\nAccount Name: NAMPDTech\n\nAfter payment, please upload a screenshot of your receipt.',
    },
    maintenanceMode: {
        enabled: false,
        message: 'Our portal is currently down for scheduled maintenance. We should be back shortly. Thank you for your patience.',
        scheduled: false,
        startTime: '',
        endTime: '',
    },
    apiKeys: {
        twilioSid: '',
        twilioAuthToken: '',
        resendApiKey: '',
        firebaseApiKey: '',
    }
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('nampdtech-settings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // Deep merge to prevent new default fields from being overwritten by old stored data
        setSettings(prev => ({
          ...prev,
          ...parsedSettings,
          paymentGateways: { ...prev.paymentGateways, ...parsedSettings.paymentGateways },
          maintenanceMode: { ...prev.maintenanceMode, ...parsedSettings.maintenanceMode },
          apiKeys: { ...prev.apiKeys, ...parsedSettings.apiKeys },
        }));
      } else {
        localStorage.setItem('nampdtech-settings', JSON.stringify(defaultSettings));
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
      localStorage.setItem('nampdtech-settings', JSON.stringify(defaultSettings));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
        const updated = {...prev, ...newSettings};
        localStorage.setItem('nampdtech-settings', JSON.stringify(updated));
        return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
