import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  initializeUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initializeUserData = async () => {
    try {
      if (!user) return;
      
      // Qui puoi aggiungere le chiamate API iniziali necessarie
      // Per esempio:
      // await fetchUserProfile();
      // await fetchUserPreferences();
      
      // Imposta eventuali stati globali necessari
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Errore durante l\'inizializzazione dei dati:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.session) {
        setUser(data.session.user);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', data.session.access_token);
        await initializeUserData();
      }

      return { data, error: null };
    } catch (error) {
      console.error('Errore login:', error);
      return { data: null, error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Errore logout:', error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
          localStorage.setItem('authToken', session.access_token);
          await initializeUserData();
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Errore sessione:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', session.access_token);
        await initializeUserData();
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      isLoading,
      initializeUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
}; 