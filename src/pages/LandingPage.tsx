
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MonitorSmartphone, 
  ShieldCheck, 
  BarChart3, 
  FileLineChart, 
  Users, 
  CheckCircle, 
  ChevronRight,
  ArrowRight,
  ArrowDown,
  KeyRound,
  Calendar,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import PageTransition from "@/components/layout/PageTransition";

const FeatureCard = ({ 
  icon, 
  title, 
  description,
  delay = 0
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="border border-border h-full bg-gradient-to-br from-background to-secondary/5 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="pt-6">
          <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10">
            {icon}
          </div>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      if (position > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

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
      icon: <KeyRound className="h-6 w-6 text-primary" />,
      title: "Lizenzmanagement",
      description: "Verwalten Sie Software-Lizenzen und weisen Sie diese Mitarbeitern zu."
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Asset Buchungssystem",
      description: "Planen und verwalten Sie die Nutzung von gemeinsam genutzten Ressourcen."
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-primary" />,
      title: "Schadensmanagement",
      description: "Dokumentieren und verfolgen Sie Schäden an Assets für bessere Wartungsplanung."
    },
    {
      icon: <FileLineChart className="h-6 w-6 text-primary" />,
      title: "Abschreibungsmanagement",
      description: "Verfolgen Sie Abschreibungen und den finanziellen Wert Ihrer Assets."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Mitarbeiterverwaltung",
      description: "Weisen Sie Assets und Lizenzen Mitarbeitern zu und verwalten Sie Budgets."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Compliance",
      description: "Stellen Sie die Einhaltung von Richtlinien und Standards sicher."
    }
  ];

  const benefits = [
    "Zentrale Verwaltung aller IT-Assets",
    "Lückenlose Lizenzverwaltung und -zuweisung",
    "Effizientes Ressourcenmanagement durch Buchungssystem",
    "Reduzierung von Kosten durch optimierte Asset-Nutzung",
    "Verbesserung der Compliance und Audit-Vorbereitung",
    "Automatisierung von Inventarprozessen",
    "Effiziente Budgetplanung und -kontrolle"
  ];

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Navigation bar with blur effect */}
        <motion.nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div 
              className="text-xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Asset Tracker
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                <Button variant="outline" className="font-medium">
                  {isAuthenticated ? "Dashboard" : "Anmelden"}
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.nav>

        {/* Hero Section with animated gradient background */}
        <section 
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
              animate={{ 
                x: [0, 30, 0],
                y: [0, -30, 0],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 8,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-secondary/10 blur-3xl"
              animate={{ 
                x: [0, -40, 0],
                y: [0, 40, 0],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 10,
                ease: "easeInOut" 
              }}
            />
          </div>

          <div className="container mx-auto px-4 pt-28 z-10">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="mb-5"
              >
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  ISO 27001 Konform
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Asset Tracker
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Professionelles Asset Management mit ISO 27001 Konformität. 
                <span className="block mt-2">Verwalten Sie alle Assets, Lizenzen und Buchungen Ihres Unternehmens intelligent und sicher.</span>
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-5"
              >
                <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                  <Button 
                    size="lg" 
                    className="font-medium relative group text-md h-12 px-8"
                    onMouseEnter={() => setIsHoveringCTA(true)}
                    onMouseLeave={() => setIsHoveringCTA(false)}
                  >
                    {isAuthenticated ? "Zum Dashboard" : "Jetzt starten"}
                    <ArrowRight className={`ml-2 transition-transform duration-300 ${isHoveringCTA ? 'translate-x-1' : ''}`} />
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-medium h-12 px-8"
                  onClick={scrollToFeatures}
                >
                  Mehr erfahren
                  <ArrowDown className="ml-2" />
                </Button>
              </motion.div>
              
              <motion.div
                className="mt-16 max-w-5xl w-full"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <div className="aspect-[16/9] relative bg-gradient-to-tr from-background to-secondary/5 rounded-xl shadow-2xl overflow-hidden border border-secondary/20">
                  <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                  <div className="w-full h-full bg-cover bg-center flex items-center justify-center">
                    <img 
                      src="/assets/dashboard-preview.jpg" 
                      alt="Dashboard Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                        target.classList.add("p-8", "bg-muted/30");
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
                    <div className="absolute bottom-8 left-8 right-8 z-10">
                      <h3 className="text-2xl font-bold mb-2">Asset Management Dashboard</h3>
                      <p className="text-muted-foreground">Behalten Sie den Überblick über alle Assets in Ihrem Unternehmen.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            onClick={scrollToFeatures}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown size={32} className="text-muted-foreground" />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section with animated cards */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4 inline-block">
                  Funktionen
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Alles was Sie brauchen</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Unser Asset Management System bietet alle Tools, die Sie zur effektiven Verwaltung Ihrer Unternehmensressourcen benötigen.
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Benefits Section with improved layout */}
        <section className="py-24 bg-gradient-to-br from-secondary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center gap-10">
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4 inline-block">
                  Vorteile
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Vorteile unseres Asset Management Systems</h2>
                <p className="text-muted-foreground mb-8 text-lg">
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
                      <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-lg">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <div className="mt-10">
                  <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                    <Button 
                      className="h-12 px-8"
                      onMouseEnter={() => setIsHoveringCTA(true)}
                      onMouseLeave={() => setIsHoveringCTA(false)}
                    >
                      {isAuthenticated ? "Zum Dashboard" : "Jetzt loslegen"}
                      <ArrowRight className={`ml-2 transition-transform duration-300 ${isHoveringCTA ? 'translate-x-1' : ''}`} />
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                className="md:w-1/2 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
                
                <div className="relative bg-card rounded-xl shadow-xl overflow-hidden border border-secondary/20 z-10">
                  <img 
                    src="/assets/license-management.jpg" 
                    alt="License Management" 
                    className="aspect-[4/3] object-cover w-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                      target.className = "aspect-[4/3] w-full p-8 bg-muted/30";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold mb-2">Neues Lizenzmanagement</h3>
                    <p className="text-muted-foreground">Verwalten Sie Software-Lizenzen und halten Sie den Überblick über Zuweisungen.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* New Features Showcase */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4 inline-block">
                  Neu
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Unsere neuesten Funktionen</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Entdecken Sie die neuesten Erweiterungen unseres Asset Management Systems.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="relative overflow-hidden rounded-xl border border-secondary/20 shadow-lg"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <img 
                  src="/assets/booking-system.jpg" 
                  alt="Asset Booking System" 
                  className="w-full aspect-[16/9] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                    target.className = "w-full aspect-[16/9] p-8 bg-muted/30";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent/10"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold mb-2">Asset Buchungssystem</h3>
                  <p className="text-base mb-4">
                    Optimieren Sie die Nutzung geteilter Ressourcen mit unserem neuen Buchungssystem. Planen Sie im Voraus und vermeiden Sie Konflikte bei der Ressourcennutzung.
                  </p>
                  <Link to={isAuthenticated ? "/asset-bookings" : "/login"}>
                    <Button variant="outline" className="bg-background/50 backdrop-blur-sm">
                      Mehr erfahren
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                className="relative overflow-hidden rounded-xl border border-secondary/20 shadow-lg"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <img 
                  src="/assets/license-management-detail.jpg" 
                  alt="License Management Details" 
                  className="w-full aspect-[16/9] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                    target.className = "w-full aspect-[16/9] p-8 bg-muted/30";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent/10"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold mb-2">Lizenzmanagement</h3>
                  <p className="text-base mb-4">
                    Behalten Sie den Überblick über alle Software-Lizenzen, deren Ablaufdaten und Zuweisungen zu Mitarbeitern. Optimieren Sie Ihre Lizenzkosten durch bessere Übersicht.
                  </p>
                  <Link to={isAuthenticated ? "/license-management" : "/login"}>
                    <Button variant="outline" className="bg-background/50 backdrop-blur-sm">
                      Mehr erfahren
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section with gradient background */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4 inline-block">
                Bereit?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Verbessern Sie Ihr Asset Management</h2>
              <p className="text-muted-foreground mb-10 text-lg">
                Starten Sie noch heute mit unserem Asset Management System und profitieren Sie von einer verbesserten Verwaltung, erhöhter Sicherheit und optimierter Effizienz.
              </p>
              
              <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                <Button 
                  size="lg" 
                  className="font-medium h-12 px-8"
                  onMouseEnter={() => setIsHoveringCTA(true)}
                  onMouseLeave={() => setIsHoveringCTA(false)}
                >
                  {isAuthenticated ? "Zum Dashboard" : "Jetzt starten"}
                  <ArrowRight className={`ml-2 transition-transform duration-300 ${isHoveringCTA ? 'translate-x-1' : ''}`} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Footer with improved styling */}
        <footer className="py-10 border-t border-border bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div 
                className="mb-4 md:mb-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-xl font-bold">Asset Tracker</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-muted-foreground text-sm">© 2025 Asset Tracker. Alle Rechte vorbehalten.</p>
              </motion.div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
