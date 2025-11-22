import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { GoogleGenAI } from '@google/genai';

// Per guidelines, assume `process.env.API_KEY` is available in the execution context.
// This declaration helps TypeScript understand `process` in a browser-like environment.
declare const process: {
    env: {
        [key: string]: string | undefined;
    };
};

interface GeminiContextType {
  ai: GoogleGenAI | null;
  isGeminiAvailable: boolean;
}

export const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export const GeminiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  const [isGeminiAvailable, setIsGeminiAvailable] = useState(false);

  useEffect(() => {
    // Per guidelines, API key must be from process.env.API_KEY
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

    if (apiKey) {
      try {
        const genAI = new GoogleGenAI({ apiKey });
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
      console.warn("Gemini API key not found. OCR functionality will be disabled.");
    }
  }, []); // Run only once on mount

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