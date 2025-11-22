import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';
import { getMemberById, updateMember } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // FIX: The login function signature was updated to match the implementation. It expects one argument (email), not two.
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateUserMemberDetails: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('nampdtech-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('nampdtech-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setLoading(true);
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      localStorage.setItem('nampdtech-user', JSON.stringify(foundUser));
      setUser(foundUser);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nampdtech-user');
  };

  const updateUserMemberDetails = async () => {
    if (user && user.memberDetails) {
        const updatedMemberDetails = await getMemberById(user.memberDetails.id);
        if (updatedMemberDetails) {
            const updatedUser = { ...user, memberDetails: updatedMemberDetails };
            setUser(updatedUser);
            localStorage.setItem('nampdtech-user', JSON.stringify(updatedUser));
        }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserMemberDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
