import React, { createContext, useContext, useState } from 'react';

type UserRole = 'ADMIN' | 'SUPER_ADMIN';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Mock user for development - replace with actual auth logic
    return {
      id: '1',
      name: 'John Admin',
      email: 'admin@university.com',
      role: 'SUPER_ADMIN',
      department: 'Computer Science',
    };
  });

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call
    const mockUser: User = {
      id: '1',
      name: 'John Admin',
      email,
      role: email.includes('super') ? 'SUPER_ADMIN' : 'ADMIN',
      department: 'Computer Science',
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};