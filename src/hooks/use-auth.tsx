
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { getEmployeeById } from "@/data/employees";
import { Employee, UserPermissions, UserRole } from "@/lib/types";
import { getRolePermissions } from "@/data/users";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole | null;
  employeeData: Employee | null;
  permissions: UserPermissions;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  session: Session | null;
  hasPermission: (permission: keyof UserPermissions) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log(`Auth state changed. Event: ${event}. Session: ${currentSession ? 'exists' : 'null'}`);
        setSession(currentSession);
        
        if (currentSession?.user) {
          console.log("User is authenticated. Fetching profile data.");
          
          // Important: Use setTimeout to avoid Supabase recursion issues
          setTimeout(async () => {
            try {
              const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();

              if (data && !error) {
                console.log("User profile found:", data);
                const userRole = (data.role || 'user') as UserRole;
                
                // Get employee data if any
                const employeeData = await getEmployeeById(data.id);
                console.log("Employee data:", employeeData);
                
                // Get permissions for this role
                const permissions = getRolePermissions(userRole) as UserPermissions;
                console.log("User permissions:", permissions);

                setUser({
                  id: data.id,
                  email: data.email,
                  name: data.name,
                  role: userRole,
                  employeeData: employeeData,
                  permissions: permissions
                });
              } else {
                console.log("Profile not found. Using auth data as fallback.");
                if (error) {
                  console.error("Error fetching profile:", error);
                }
                
                const defaultRole = 'user' as UserRole;
                
                setUser({
                  id: currentSession.user.id,
                  email: currentSession.user.email || '',
                  name: currentSession.user.user_metadata?.name || null,
                  role: defaultRole,
                  employeeData: null,
                  permissions: getRolePermissions(defaultRole) as UserPermissions
                });
              }
              setLoading(false);
            } catch (err) {
              console.error("Error in auth state change handler:", err);
              setLoading(false);
            }
          }, 0);
        } else {
          console.log("No authenticated user.");
          setUser(null);
          setLoading(false);
        }
      }
    );

    console.log("Checking for existing session");
    
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? 'Session exists' : 'No session');
      setSession(currentSession);
      
      if (currentSession?.user) {
        console.log("User is logged in, fetching profile data");
        
        setTimeout(async () => {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();

            if (data && !error) {
              console.log("User profile loaded:", data);
              const userRole = (data.role || 'user') as UserRole;
              
              // Get employee data if any
              const employeeData = await getEmployeeById(data.id);
              console.log("Employee data:", employeeData);
              
              // Get permissions for this role
              const permissions = getRolePermissions(userRole) as UserPermissions;
              console.log("User permissions:", permissions);

              setUser({
                id: data.id,
                email: data.email,
                name: data.name,
                role: userRole,
                employeeData: employeeData,
                permissions: permissions
              });
            } else {
              console.log("Using auth data for user profile");
              if (error) {
                console.error("Error fetching profile:", error);
              }
              
              const defaultRole = 'user' as UserRole;
              
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: currentSession.user.user_metadata?.name || null,
                role: defaultRole,
                employeeData: null,
                permissions: getRolePermissions(defaultRole) as UserPermissions
              });
            }
          } catch (err) {
            console.error("Error in session check:", err);
          } finally {
            setLoading(false);
          }
        }, 0);
      } else {
        setLoading(false);
      }
    }).catch(error => {
      console.error("Error checking session:", error);
      setLoading(false);
    });

    const cleanup = setupInactivityTimeout();
    
    return () => {
      console.log("Cleaning up auth listeners");
      subscription.unsubscribe();
      cleanup();
    };
  }, []);

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!user) return false;
    return user.permissions[permission];
  };

  const setupInactivityTimeout = () => {
    let inactivityTimer: number | null = null;
    
    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      
      inactivityTimer = window.setTimeout(() => {
        if (session) {
          logout();
          toast({
            title: "Session abgelaufen",
            description: "Sie wurden aufgrund von Inaktivität abgemeldet.",
          });
        }
      }, 15 * 60 * 1000); // 15 minutes
    };
    
    const resetInactivityTimer = () => {
      resetTimer();
    };
    
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keypress", resetInactivityTimer);
    
    resetTimer();
    
    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keypress", resetInactivityTimer);
    };
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Attempting login for:", email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: "Anmeldung fehlgeschlagen",
          description: error.message,
        });
        setLoading(false);
        return false;
      }

      console.log("Login successful, session:", data.session ? "exists" : "null");
      
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

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    console.log("Attempting signup for:", email);
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
        console.error("Signup error:", error);
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
        description: "Sie können sich jetzt anmelden.",
      });
      
      console.log("Signup successful");
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

  const logout = async () => {
    console.log("Logging out user");
    await supabase.auth.signOut();
    navigate("/login");
  };

  const authContextValue = {
    user,
    session,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading,
    hasPermission
  };
  
  console.log("Auth context current state:", {
    isAuthenticated: !!user,
    loading,
    hasSession: !!session,
    userInfo: user ? { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      permissions: user.permissions,
      hasEmployeeData: !!user.employeeData 
    } : null
  });

  return (
    <AuthContext.Provider value={authContextValue}>
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
      console.log("User not authenticated, redirecting to login");
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Laden...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : null;
};
