import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Language } from '../types/finance';
import { useI18n } from './I18nContext';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'moliya_current_user';
const USERS_DB_KEY = 'moliya_users_db';

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'user_1',
  name: 'Akmalxon Akmalov',
  email: 'akmalovakmalhon04@gmail.com',
  language: 'uz',
  monthlyIncomeTarget: 18000000,
  currencyPreference: 'standard',
  notifications: true,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language, setLanguage } = useI18n();
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    // Default to logged-in demo user for immediate rich interactive experience
    return DEFAULT_DEMO_USER;
  });

  // Sync users database initialization
  useEffect(() => {
    const existing = localStorage.getItem(USERS_DB_KEY);
    if (!existing) {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify([DEFAULT_DEMO_USER]));
    }
  }, []);

  // When current user changes language in UI, keep profile in sync
  useEffect(() => {
    if (user && user.language !== language) {
      const updatedUser: UserProfile = { ...user, language };
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      // Update in users list
      try {
        const usersListRaw = localStorage.getItem(USERS_DB_KEY);
        if (usersListRaw) {
          const list: UserProfile[] = JSON.parse(usersListRaw);
          const idx = list.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
          if (idx !== -1) {
            list[idx] = updatedUser;
            localStorage.setItem(USERS_DB_KEY, JSON.stringify(list));
          }
        }
      } catch (e) {
        console.error('Failed to sync user language in db', e);
      }
    }
  }, [language, user]);

  const login = async (email: string): Promise<boolean> => {
    try {
      const usersListRaw = localStorage.getItem(USERS_DB_KEY);
      const list: UserProfile[] = usersListRaw ? JSON.parse(usersListRaw) : [DEFAULT_DEMO_USER];
      const found = list.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

      if (found) {
        setUser(found);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
        // Restore user's saved language preference!
        if (found.language && ['uz', 'ru', 'en'].includes(found.language)) {
          setLanguage(found.language);
        }
        return true;
      }

      // If user not found, create new on the fly with current language
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0],
        email: email.trim(),
        language: language,
        monthlyIncomeTarget: 15000000,
        currencyPreference: 'standard',
        notifications: true,
      };
      list.push(newUser);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(list));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    try {
      const usersListRaw = localStorage.getItem(USERS_DB_KEY);
      const list: UserProfile[] = usersListRaw ? JSON.parse(usersListRaw) : [DEFAULT_DEMO_USER];

      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        language: language, // Save current language to new user's profile
        monthlyIncomeTarget: 15000000,
        currencyPreference: 'standard',
        notifications: true,
      };

      const existingIdx = list.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (existingIdx >= 0) {
        list[existingIdx] = newUser;
      } else {
        list.push(newUser);
      }

      localStorage.setItem(USERS_DB_KEY, JSON.stringify(list));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));

    if (updates.language && updates.language !== language) {
      setLanguage(updates.language);
    }

    try {
      const usersListRaw = localStorage.getItem(USERS_DB_KEY);
      if (usersListRaw) {
        const list: UserProfile[] = JSON.parse(usersListRaw);
        const idx = list.findIndex((u) => u.id === user.id);
        if (idx !== -1) {
          list[idx] = updated;
          localStorage.setItem(USERS_DB_KEY, JSON.stringify(list));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
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
