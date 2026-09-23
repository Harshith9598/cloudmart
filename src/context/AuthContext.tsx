import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { mockUsers } from '@/services/mock-data';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  becomeSeller: (storeName: string, description: string) => Promise<void>;
  updateProfile: (firstName: string, lastName: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'cloudmart_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  const persist = useCallback((u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const found = mockUsers.find((u) => u.email === email);
    const u = found ?? {
      id: 'user-demo',
      email,
      firstName: email.split('@')[0],
      lastName: '',
      roles: ['CUSTOMER' as const],
      sellerProfile: null,
      createdAt: new Date().toISOString(),
    };
    persist(u);
  }, [persist]);

  const register = useCallback(async (email: string, _password: string, firstName: string, lastName: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const u: User = {
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      roles: ['CUSTOMER'],
      sellerProfile: null,
      createdAt: new Date().toISOString(),
    };
    persist(u);
  }, [persist]);

  const logout = useCallback(() => {
    persist(null);
  }, [persist]);

  const becomeSeller = useCallback(async (storeName: string, description: string) => {
    await new Promise((r) => setTimeout(r, 400));
    if (!user) return;
    const sellerProfile = {
      id: `seller-${Date.now()}`,
      userId: user.id,
      storeName,
      slug: storeName.toLowerCase().replace(/\s+/g, '-'),
      description,
      logoUrl: null,
      verified: false,
      rating: 0,
      totalSales: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = { ...user, roles: [...new Set([...user.roles, 'SELLER'])], sellerProfile };
    persist(updated);
  }, [user, persist]);

  const updateProfile = useCallback((firstName: string, lastName: string) => {
    if (!user) return;
    persist({ ...user, firstName, lastName });
  }, [user, persist]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, becomeSeller, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
