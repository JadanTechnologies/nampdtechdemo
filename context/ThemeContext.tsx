import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
        const storedTheme = localStorage.getItem('nampdtech-theme');
        // Validate the stored theme
        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
            return storedTheme;
        }
    } catch (error) {
        console.error("Could not read theme preference from localStorage", error);
    }
    // Fallback to system preference if nothing is stored or value is invalid
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
        localStorage.setItem('nampdtech-theme', theme);
    } catch (error) {
        console.error("Could not save theme preference to localStorage", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
