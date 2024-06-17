import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  const initialToken = localStorage.getItem('pred-token') || null;
  const [token, setToken] = useState<string | null>(initialToken);

  const login = (token: string) => {
    setToken(token);
    localStorage.setItem('pred-token', token);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('pred-token');
    location.replace('/')
    
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
