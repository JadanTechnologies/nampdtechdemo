
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

export interface Branding {
  brandName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  cubeLogoUrl: string | null;
  contactEmail: string;
  contactPhone: string;
  address: string;
  showLogoInHeader: boolean;
}

interface BrandingContextType {
  branding: Branding;
  updateBranding: (newBranding: Branding) => void;
  loading: boolean;
}

const defaultBranding: Branding = {
    brandName: 'NAMPDTech',
    logoUrl: null,
    faviconUrl: null,
    cubeLogoUrl: null,
    contactEmail: 'info@nampdtech.org',
    contactPhone: '+234 123 456 7890',
    address: '123 Tech Road, Ikeja, Lagos, Nigeria',
    showLogoInHeader: false,
};

export const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<Branding>(defaultBranding);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedBranding = localStorage.getItem('nampdtech-branding');
      if (storedBranding) {
        setBranding(JSON.parse(storedBranding));
      } else {
        localStorage.setItem('nampdtech-branding', JSON.stringify(defaultBranding));
      }
    } catch (error) {
      console.error("Failed to parse branding from localStorage", error);
      localStorage.setItem('nampdtech-branding', JSON.stringify(defaultBranding));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBranding = (newBranding: Branding) => {
    setBranding(newBranding);
    localStorage.setItem('nampdtech-branding', JSON.stringify(newBranding));
  };

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, loading }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};