
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  displayName?: string;
};

type AuthContextType = {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('gowera_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('gowera_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate authentication delay
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just create a user object
      // In a real app, you would validate credentials against a backend
      const user: User = {
        id: crypto.randomUUID(),
        email,
        displayName: email.split('@')[0]
      };
      
      setCurrentUser(user);
      localStorage.setItem('gowera_user', JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user (in a real app, this would interact with a backend)
      const user: User = {
        id: crypto.randomUUID(),
        email,
        displayName: displayName || email.split('@')[0]
      };
      
      setCurrentUser(user);
      localStorage.setItem('gowera_user', JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gowera_user');
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
