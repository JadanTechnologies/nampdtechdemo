
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useSettings } from './SettingsContext';
import { GoogleGenAI } from '@google/genai';

interface GeminiContextType {
  ai: GoogleGenAI | null;
  isGeminiAvailable: boolean;
}

export const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export const GeminiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  const [isGeminiAvailable, setIsGeminiAvailable] = useState(false);

  useEffect(() => {
    if (settings.geminiApiKey) {
      try {
        const genAI = new GoogleGenAI({ apiKey: settings.geminiApiKey });
        setAi(genAI);
        setIsGeminiAvailable(true);
        console.log("Gemini AI client initialized successfully.");
      } catch (error) {
        console.error("Failed to initialize Gemini AI client:", error);
        setAi(null);
        setIsGeminiAvailable(false);
      }
    } else {
      setAi(null);
      setIsGeminiAvailable(false);
      console.warn("Gemini API key is not set. OCR functionality will be disabled.");
    }
  }, [settings.geminiApiKey]);

  return (
    <GeminiContext.Provider value={{ ai, isGeminiAvailable }}>
      {children}
    </GeminiContext.Provider>
  );
};

export const useGemini = () => {
  const context = useContext(GeminiContext);
  if (context === undefined) {
    throw new Error('useGemini must be used within a GeminiProvider');
  }
  return context;
};
