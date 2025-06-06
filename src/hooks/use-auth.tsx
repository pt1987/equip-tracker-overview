
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Track login state to prevent multiple redirects
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const fetchUserProfileData = async (userId: string, userEmail: string | null, userName: string | null = null) => {
    try {
      console.log("Fetching user profile for:", userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        console.log("User profile found:", data);
        const userRole = (data.role || 'user') as UserRole;
        
        const employeeData = await getEmployeeById(data.id);
        console.log("Employee data:", employeeData);
        
        const permissions = getRolePermissions(userRole);
        console.log("User permissions:", permissions);

        return {
          id: data.id,
          email: data.email,
          name: data.name,
          role: userRole,
          employeeData: employeeData,
          permissions: permissions
        };
      } else {
        console.log("Profile not found. Using auth data as fallback.");
        if (error) {
          console.error("Error fetching profile:", error);
        }
        
        const defaultRole = 'user' as UserRole;
        
        return {
          id: userId,
          email: userEmail || '',
          name: userName || null,
          role: defaultRole,
          employeeData: null,
          permissions: getRolePermissions(defaultRole)
        };
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      throw err;
    }
  };

  const refreshUserData = async () => {
    if (!session?.user) {
      console.log("No session found, cannot refresh user data");
      return;
    }
    
    try {
      console.log("Refreshing user data for:", session.user.id);
      setLoading(true);
      
      const userData = await fetchUserProfileData(
        session.user.id, 
        session.user.email,
        session.user.user_metadata?.name
      );
      
      console.log("Refreshed user data:", userData);
      setUser(userData);
    } catch (err) {
      console.error("Error refreshing user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log(`Auth state changed. Event: ${event}. Session: ${currentSession ? 'exists' : 'null'}`);
        
        if (!isMounted) return;
        
        // Only update state, don't navigate here to prevent loops
        setSession(currentSession);
        
        if (currentSession?.user) {
          console.log("User is authenticated. Fetching profile data.");
          
          // Update loading state immediately
          setLoading(true);
          
          // Defer Supabase calls with setTimeout to avoid deadlock
          setTimeout(async () => {
            if (!isMounted) return;
            
            try {
              const userData = await fetchUserProfileData(
                currentSession.user.id,
                currentSession.user.email,
                currentSession.user.user_metadata?.name
              );
              
              if (isMounted) {
                setUser(userData);
                setLoading(false);
                setAuthInitialized(true);
              }
            } catch (err) {
              console.error("Error in auth state change handler:", err);
              if (isMounted) {
                setLoading(false);
                setAuthInitialized(true);
              }
            }
          }, 0);
        } else {
          console.log("No authenticated user.");
          if (isMounted) {
            setUser(null);
            setLoading(false);
            setAuthInitialized(true);
          }
        }
      }
    );

    console.log("Checking for existing session");
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? 'Session exists' : 'No session');
      
      if (!isMounted) return;
      
      // Only update state, don't navigate here to prevent loops
      setSession(currentSession);
      
      if (currentSession?.user) {
        console.log("User is logged in, fetching profile data");
        
        // Update loading state immediately
        setLoading(true);
        
        // Defer Supabase calls with setTimeout to avoid deadlock
        setTimeout(async () => {
          if (!isMounted) return;
          
          try {
            const userData = await fetchUserProfileData(
              currentSession.user.id,
              currentSession.user.email,
              currentSession.user.user_metadata?.name
            );
            
            if (isMounted) {
              setUser(userData);
              setLoading(false);
              setAuthInitialized(true);
            }
          } catch (err) {
            console.error("Error in session check:", err);
            if (isMounted) {
              setLoading(false);
              setAuthInitialized(true);
            }
          }
        }, 0);
      } else {
        if (isMounted) {
          setLoading(false);
          setAuthInitialized(true);
        }
      }
    }).catch(error => {
      console.error("Error checking session:", error);
      if (isMounted) {
        setLoading(false);
        setAuthInitialized(true);
      }
    });

    const cleanup = setupInactivityTimeout();
    
    return () => {
      isMounted = false;
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
    setIsLoggingIn(true);
    
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
        setIsLoggingIn(false);
        return false;
      }

      console.log("Login successful, session:", data.session ? "exists" : "null");
      
      // Don't navigate here - let the auth state change handler do it
      // This prevents loops where login triggers navigation which triggers login
      
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Fehler bei der Anmeldung",
        description: error.message || "Bitte versuchen Sie es später erneut.",
      });
      setLoading(false);
      setIsLoggingIn(false);
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
    
    // We need to force a navigation to /login here
    // This ensures that the user sees the login screen
    navigate("/login", { replace: true });
  };

  const authContextValue = {
    user,
    session,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading,
    hasPermission,
    refreshUserData
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
    } : null,
    authInitialized,
    currentPath: location.pathname,
    isLoggingIn
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
  const location = useLocation();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  useEffect(() => {
    // Special debug for login page to see what's happening
    if (location.pathname === "/login") {
      console.log("On login page. Auth state:", { isAuthenticated, loading, redirectAttempted });
    }
    
    // Wait for loading to complete before making routing decisions
    if (!loading) {
      // If we're on the login page and authenticated, go to dashboard
      if (isAuthenticated && location.pathname === "/login" && !redirectAttempted) {
        console.log("User is authenticated on login page. Redirecting to dashboard.");
        setRedirectAttempted(true);
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);
      } 
      // If we're not on the login page and not authenticated, go to login
      else if (!isAuthenticated && location.pathname !== "/login" && !redirectAttempted) {
        console.log("Protected route accessed while not authenticated. Current path:", location.pathname);
        setRedirectAttempted(true);
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 100);
      }
    }
  }, [isAuthenticated, loading, navigate, location.pathname, redirectAttempted]);
  
  // Reset redirect flag when location changes
  useEffect(() => {
    setRedirectAttempted(false);
  }, [location.pathname]);
  
  if (loading) {
    console.log("Auth is still loading, showing loading spinner");
    return <div className="flex justify-center items-center h-screen">Laden...</div>;
  }
  
  // Simple rendering logic - show children if authenticated or on login page
  return (isAuthenticated || location.pathname === "/login") ? <>{children}</> : null;
};

// Add this function to the existing file to get the current user ID
export const getUserId = async (): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};
