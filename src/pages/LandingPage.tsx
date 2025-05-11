
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MonitorSmartphone, 
  ShieldCheck, 
  BarChart3, 
  FileLineChart, 
  Users, 
  CheckCircle, 
  ChevronRight 
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import PageTransition from "@/components/layout/PageTransition";

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => {
  return (
    <Card className="border border-border h-full">
      <CardContent className="pt-6">
        <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);

  const features = [
    {
      icon: <MonitorSmartphone className="h-6 w-6 text-primary" />,
      title: "Asset Management",
      description: "Verwalten Sie Hardware, Software und andere Assets in einem zentralen System."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "ISO 27001 Konform",
      description: "Entspricht den Anforderungen des ISO 27001 Standards für Informationssicherheit."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "Umfassendes Reporting",
      description: "Generieren Sie detaillierte Berichte über Ihre Assets und deren Nutzung."
    },
    {
      icon: <FileLineChart className="h-6 w-6 text-primary" />,
      title: "Abschreibungsmanagement",
      description: "Verfolgen Sie Abschreibungen und den finanziellen Wert Ihrer Assets."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Mitarbeiterverwaltung",
      description: "Weisen Sie Assets Mitarbeitern zu und verwalten Sie Budgets."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Compliance",
      description: "Stellen Sie die Einhaltung von Richtlinien und Standards sicher."
    }
  ];

  const benefits = [
    "Zentrale Verwaltung aller IT-Assets",
    "Reduzierung von Kosten durch optimierte Asset-Nutzung",
    "Verbesserung der Compliance und Audit-Vorbereitung",
    "Automatisierung von Inventarprozessen",
    "Effiziente Budgetplanung und -kontrolle"
  ];

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20 pb-16 pt-16 md:pt-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Asset Tracker
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Professionelles Asset Management mit ISO 27001 Konformität. 
                Verwalten Sie alle Assets Ihres Unternehmens intelligent und sicher an einem Ort.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                  <Button 
                    size="lg" 
                    className="font-medium relative group"
                    onMouseEnter={() => setIsHoveringCTA(true)}
                    onMouseLeave={() => setIsHoveringCTA(false)}
                  >
                    {isAuthenticated ? "Zum Dashboard" : "Jetzt starten"}
                    <ChevronRight className={`ml-1 transition-transform duration-300 ${isHoveringCTA ? 'translate-x-1' : ''}`} />
                  </Button>
                </Link>
                
                {!isAuthenticated && (
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="font-medium">
                      Anmelden
                    </Button>
                  </Link>
                )}
              </motion.div>
              
              <motion.div
                className="mt-16 mb-10 bg-card rounded-xl shadow-lg max-w-5xl w-full overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="aspect-[16/9] relative bg-gradient-to-tr from-primary/10 to-secondary/10 flex items-center justify-center">
                  <p className="text-muted-foreground text-lg">Asset Management Dashboard</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Funktionen</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Unser Asset Management System bietet alle Tools, die Sie zur effektiven Verwaltung Ihrer Unternehmensressourcen benötigen.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center gap-10">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Vorteile unseres Asset Management Systems</h2>
                <p className="text-muted-foreground mb-8">
                  Optimieren Sie Ihr Asset Management und steigern Sie die Effizienz in Ihrem Unternehmen durch:
                </p>
                
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <div className="mt-10">
                  <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                    <Button>
                      {isAuthenticated ? "Zum Dashboard" : "Jetzt loslegen"}
                    </Button>
                  </Link>
                </div>
              </div>
              
              <motion.div 
                className="md:w-1/2 bg-card rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="aspect-[4/3] relative bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                  <p className="text-muted-foreground">Asset Management Statistiken</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Bereit, Ihr Asset Management zu verbessern?</h2>
              <p className="text-muted-foreground mb-10">
                Starten Sie noch heute mit unserem Asset Management System und profitieren Sie von einer verbesserten Verwaltung, erhöhter Sicherheit und optimierter Effizienz.
              </p>
              
              <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                <Button size="lg" className="font-medium">
                  {isAuthenticated ? "Zum Dashboard" : "Jetzt starten"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">© 2025 Asset Tracker. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
