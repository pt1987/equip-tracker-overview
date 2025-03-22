
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import PageTransition from "@/components/layout/PageTransition";

// Password reset form schema
const formSchema = z.object({
  email: z.string().email({ message: "Ungültige E-Mail-Adresse." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      console.log("Password reset requested for:", data.email);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      
      toast({
        title: "Anfrage gesendet",
        description: "Falls ein Konto mit dieser E-Mail existiert, erhalten Sie eine E-Mail mit weiteren Anweisungen.",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bitte versuchen Sie es später erneut.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Passwort zurücksetzen</CardTitle>
            <CardDescription className="text-center">
              Geben Sie Ihre E-Mail-Adresse ein, um einen Link zum Zurücksetzen Ihres Passworts zu erhalten
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Senden...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="mr-2 h-4 w-4" /> Link senden
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 w-12 h-12 flex items-center justify-center mx-auto">
                  <Mail className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-lg font-medium">E-Mail gesendet</h3>
                <p className="text-sm text-muted-foreground">
                  Wir haben Ihnen eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts gesendet. 
                  Bitte überprüfen Sie Ihren Posteingang und ggf. Ihren Spam-Ordner.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => setIsSubmitted(false)}
                >
                  Erneut senden
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full flex items-center" 
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zum Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
}
