import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';
import { getMemberById } from '../services/mockApi';
import { createToken, decodeToken, isTokenExpired } from '../utils/jwt';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateUserMemberDetails: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const token = localStorage.getItem('nampdtech-token');
      if (token && !isTokenExpired(token)) {
        const decodedUser = decodeToken(token);
        setUser(decodedUser);
      } else if (token) {
        // If token exists but is expired, remove it
        localStorage.removeItem('nampdtech-token');
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to process token from localStorage", error);
      localStorage.removeItem('nampdtech-token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setLoading(true);
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      const token = createToken(foundUser);
      localStorage.setItem('nampdtech-token', token);
      setUser(foundUser);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nampdtech-token');
  };

  const updateUserMemberDetails = async () => {
    if (user && user.memberDetails) {
        const updatedMemberDetails = await getMemberById(user.memberDetails.id);
        if (updatedMemberDetails) {
            const updatedUser: User = { ...user, memberDetails: updatedMemberDetails };
            
            // Re-issue a new token with the updated details
            const newToken = createToken(updatedUser);
            localStorage.setItem('nampdtech-token', newToken);

            // Update the user state
            setUser(updatedUser);
        }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserMemberDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
