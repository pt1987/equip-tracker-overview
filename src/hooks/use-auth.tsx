
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialisiere Authentifizierungsstatus bei Komponenten-Mount
  useEffect(() => {
    // Zuerst Auth-State-Listener einrichten
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (data && !error) {
            setUser({
              id: data.id,
              email: data.email,
              name: data.name,
              role: data.role
            });
          } else {
            // Fallback, falls Profil nicht gefunden wird
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              name: currentSession.user.user_metadata?.name || null,
              role: 'user'
            });
          }
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Dann vorhandene Session prüfen
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Benutzerprofile abrufen
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data, error }) => {
            if (data && !error) {
              setUser({
                id: data.id,
                email: data.email,
                name: data.name,
                role: data.role
              });
            } else {
              // Fallback auf Auth-User-Daten
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: currentSession.user.user_metadata?.name || null,
                role: 'user'
              });
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    // Setze Inaktivitäts-Timeout auf
    const cleanup = setupInactivityTimeout();
    
    return () => {
      subscription.unsubscribe();
      cleanup();
    };
  }, []);

  // Funktion zum Handhaben von Inaktivitäts-Timeout
  const setupInactivityTimeout = () => {
    let inactivityTimer: number | null = null;
    
    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      
      // 15 Minuten Inaktivitäts-Timeout
      inactivityTimer = window.setTimeout(() => {
        if (session) {
          logout();
          toast({
            title: "Session abgelaufen",
            description: "Sie wurden aufgrund von Inaktivität abgemeldet.",
          });
        }
      }, 15 * 60 * 1000);
    };
    
    // Erstelle die Reset-Timer-Funktion
    const resetInactivityTimer = () => {
      resetTimer();
    };
    
    // Event-Listener einrichten
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keypress", resetInactivityTimer);
    
    // Initialer Timer-Setup
    resetTimer();
    
    // Cleanup-Funktion zurückgeben
    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keypress", resetInactivityTimer);
    };
  };

  // Login mit Supabase
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Anmeldung fehlgeschlagen",
          description: error.message,
        });
        setLoading(false);
        return false;
      }

      // Erfolgreiche Anmeldung wird durch onAuthStateChange verarbeitet
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Fehler bei der Anmeldung",
        description: error.message || "Bitte versuchen Sie es später erneut.",
      });
      setLoading(false);
      return false;
    }
  };

  // Registrierung mit Supabase
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Registrierung fehlgeschlagen",
          description: error.message,
        });
        setLoading(false);
        return false;
      }
      
      toast({
        title: "Registrierung erfolgreich",
        description: "Bitte überprüfen Sie Ihre E-Mails für den Bestätigungslink.",
      });
      
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Fehler bei der Registrierung",
        description: error.message || "Bitte versuchen Sie es später erneut.",
      });
      setLoading(false);
      return false;
    }
  };

  // Abmeldung mit Supabase
  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Laden...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : null;
};
