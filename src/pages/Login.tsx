import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Key, Lock, LogIn, Mail, UserPlus, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import PageTransition from "@/components/layout/PageTransition";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Login-Formular-Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Ungültige E-Mail-Adresse." }),
  password: z.string().min(8, { message: "Passwort muss mindestens 8 Zeichen lang sein." }),
});

// Registrierungs-Formular-Schema
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name muss mindestens 2 Zeichen lang sein." }),
  email: z.string().email({ message: "Ungültige E-Mail-Adresse." }),
  password: z.string().min(8, { message: "Passwort muss mindestens 8 Zeichen lang sein." }),
  passwordConfirm: z.string().min(8, { message: "Passwort muss mindestens 8 Zeichen lang sein." }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwörter stimmen nicht überein",
  path: ["passwordConfirm"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function Login() {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupPasswordConfirm, setShowSignupPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signup, isAuthenticated } = useAuth();

  // Weiterleitung zum Dashboard, falls bereits authentifiziert
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        toast({
          title: "Erfolgreich angemeldet",
          description: "Willkommen im Admin-Bereich.",
        });
        
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      const success = await signup(data.email, data.password, data.name);
      
      if (success) {
        toast({
          title: "Registrierung erfolgreich",
          description: "Sie können sich jetzt anmelden.",
        });
        
        setActiveTab("login");
        signupForm.reset();
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Asset Tracker</CardTitle>
            <CardDescription className="text-center">
              Melden Sie sich an oder erstellen Sie ein neues Konto
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Anmelden</TabsTrigger>
              <TabsTrigger value="signup">Registrieren</TabsTrigger>
            </TabsList>
            
            <CardContent className="pt-4">
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-Mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="name@example.com" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passwort</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type={showLoginPassword ? "text" : "password"} 
                                className="pl-10 pr-10" 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-10 w-10"
                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                              >
                                {showLoginPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {showLoginPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="text-sm text-right">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto" 
                        onClick={() => navigate("/reset-password")}
                        type="button"
                      >
                        Passwort vergessen?
                      </Button>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Anmelden...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <LogIn className="mr-2 h-4 w-4" /> Anmelden
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="Max Mustermann" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-Mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="name@example.com" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passwort</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type={showSignupPassword ? "text" : "password"} 
                                className="pl-10 pr-10" 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-10 w-10"
                                onClick={() => setShowSignupPassword(!showSignupPassword)}
                              >
                                {showSignupPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {showSignupPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="passwordConfirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passwort bestätigen</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type={showSignupPasswordConfirm ? "text" : "password"} 
                                className="pl-10 pr-10" 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-10 w-10"
                                onClick={() => setShowSignupPasswordConfirm(!showSignupPasswordConfirm)}
                              >
                                {showSignupPasswordConfirm ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {showSignupPasswordConfirm ? "Passwort verbergen" : "Passwort anzeigen"}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Registrieren...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <UserPlus className="mr-2 h-4 w-4" /> Konto erstellen
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </CardContent>
          </Tabs>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground mt-2">
              Sie können auch die vorhandenen Demo-Daten nutzen:<br />
              <strong>admin@example.com</strong> / <strong>password123</strong>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
}
