
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  AlertCircle,
  Mail,
  Send
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import PageTransition from "@/components/layout/PageTransition";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { toast } from "@/components/ui/use-toast";

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
  const [email, setEmail] = useState("");

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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Anmeldung erfolgreich",
        description: "Vielen Dank für Ihr Interesse an unseren Updates!",
      });
      setEmail("");
    }
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

        {/* Hero Section with animated gradient background and curved shapes */}
        <section 
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white"
        >
          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-[10%] right-[15%] w-96 h-96 rounded-full bg-blue-400/20 blur-3xl"
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
              className="absolute bottom-[20%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-purple-500/20 blur-3xl"
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
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
          </div>

          <div className="container mx-auto px-4 z-10 py-20">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
              {/* Left Content */}
              <motion.div
                className="lg:w-1/2 text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 inline-block mb-6">
                  ISO 27001 Konform
                </span>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                  Asset Tracker für moderne Unternehmen
                </h1>
                
                <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl">
                  Professionelles Asset Management mit ISO 27001 Konformität. 
                  <span className="block mt-2">Verwalten Sie alle Assets, Lizenzen und Buchungen Ihres Unternehmens intelligent und sicher.</span>
                </p>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-5 mb-10">
                  <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                    <Button 
                      size="lg" 
                      className="bg-white text-blue-700 hover:bg-blue-50 font-medium relative group text-md h-12 px-8"
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
                    className="font-medium h-12 px-8 border-white text-white hover:bg-white/20"
                    onClick={scrollToFeatures}
                  >
                    Mehr erfahren
                    <ArrowDown className="ml-2" />
                  </Button>
                </div>

                {/* Newsletter Subscription Form */}
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 mt-10 max-w-md mx-auto lg:mx-0">
                  <h3 className="text-xl font-semibold mb-2">Updates erhalten</h3>
                  <p className="text-blue-100 mb-4">Bleiben Sie auf dem neuesten Stand mit unseren Feature-Updates und News.</p>
                  
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="email"
                        placeholder="Ihre E-Mail-Adresse"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/20 border-white/20 text-white placeholder:text-blue-100/70 h-12"
                        required
                      />
                    </div>
                    <Button type="submit" className="bg-white text-blue-700 hover:bg-blue-50 h-12">
                      <Send className="h-4 w-4 mr-2" />
                      Abonnieren
                    </Button>
                  </form>
                </div>
              </motion.div>

              {/* Right Side Image with Blob Shape */}
              <motion.div
                className="lg:w-1/2 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <div className="relative">
                  {/* Blob shape container */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-blob-slow z-0"></div>
                  
                  {/* White outline */}
                  <div className="absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-2 border-white/30 transform scale-105 z-0"></div>
                  
                  {/* Image container */}
                  <div className="relative rounded-[38%_62%_68%_32%/38%_52%_58%_52%] overflow-hidden border-4 border-white/20 z-10 transform">
                    <ImageWithFallback 
                      src="/assets/dashboard-preview.jpg" 
                      alt="Dashboard Preview"
                      className="w-full h-full object-cover"
                      fallbackClassName="p-8 bg-muted/30"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
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
        
        {/* Benefits Section with curved design */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-[10%] right-[15%] w-96 h-96 rounded-full bg-blue-400/20 blur-3xl"
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
              className="absolute bottom-[20%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-purple-500/20 blur-3xl"
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

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-10">
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 mb-4 inline-block">
                  Vorteile
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Vorteile unseres Asset Management Systems</h2>
                <p className="text-blue-100 mb-8 text-lg">
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
                      <div className="bg-white/20 p-1 rounded-full mr-3 mt-0.5">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-lg">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <div className="mt-10">
                  <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                    <Button 
                      className="bg-white text-blue-700 hover:bg-blue-50 h-12 px-8"
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
                {/* Blob shape for image */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-[60%_40%_30%_70%/50%_60%_40%_50%] animate-blob-slow z-0"></div>
                
                {/* White outline */}
                <div className="absolute inset-0 rounded-[60%_40%_30%_70%/50%_60%_40%_50%] border-2 border-white/30 transform scale-105 z-0"></div>
                
                {/* Image inside blob */}
                <div className="relative rounded-[58%_42%_28%_72%/48%_58%_42%_52%] overflow-hidden border-4 border-white/20 z-10">
                  <ImageWithFallback 
                    src="/assets/license-management.jpg" 
                    alt="License Management" 
                    className="aspect-[4/3] object-cover w-full"
                    fallbackClassName="p-8 bg-muted/30"
                  />
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
                <ImageWithFallback 
                  src="/assets/booking-system.jpg" 
                  alt="Asset Booking System" 
                  className="w-full aspect-[16/9] object-cover"
                  fallbackClassName="p-8 bg-muted/30"
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
                <ImageWithFallback 
                  src="/assets/license-management-detail.jpg" 
                  alt="License Management Details" 
                  className="w-full aspect-[16/9] object-cover"
                  fallbackClassName="p-8 bg-muted/30"
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
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-[10%] right-[15%] w-96 h-96 rounded-full bg-blue-400/20 blur-3xl"
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
              className="absolute bottom-[20%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-purple-500/20 blur-3xl"
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
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 mb-4 inline-block">
                Bereit?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Verbessern Sie Ihr Asset Management</h2>
              <p className="text-blue-100 mb-10 text-lg">
                Starten Sie noch heute mit unserem Asset Management System und profitieren Sie von einer verbesserten Verwaltung, erhöhter Sicherheit und optimierter Effizienz.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-700 hover:bg-blue-50 font-medium h-12 px-8 w-full sm:w-auto"
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
                  className="border-white text-white hover:bg-white/20 font-medium h-12 px-8 w-full sm:w-auto"
                  onClick={() => window.open('mailto:info@assettracker.com', '_blank')}
                >
                  Kontakt aufnehmen
                  <Mail className="ml-2 h-5 w-5" />
                </Button>
              </div>
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
