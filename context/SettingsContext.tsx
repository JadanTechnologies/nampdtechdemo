
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

export interface PaymentGatewaySettings {
  paystackEnabled: boolean;
  monnifyEnabled: boolean;
  flutterwaveEnabled: boolean;
  manualPaymentInstructions: string;
}

export interface Settings {
  geminiApiKey: string;
  paymentGateways: PaymentGatewaySettings;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
  loading: boolean;
}

const defaultSettings: Settings = {
    geminiApiKey: '',
    paymentGateways: {
        paystackEnabled: true,
        monnifyEnabled: true,
        flutterwaveEnabled: true,
        manualPaymentInstructions: 'Please make a payment to the following account:\n\nBank: Zenith Bank\nAccount Number: 1234567890\nAccount Name: NAMPDTech\n\nAfter payment, please upload a screenshot of your receipt.',
    },
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('nampdtech-settings');
      if (storedSettings) {
        // Merge stored settings with defaults to handle new fields
        const parsedSettings = JSON.parse(storedSettings);
        setSettings({
            ...defaultSettings,
            ...parsedSettings,
            paymentGateways: {
                ...defaultSettings.paymentGateways,
                ...parsedSettings.paymentGateways
            }
        });
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

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('nampdtech-settings', JSON.stringify(newSettings));
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
