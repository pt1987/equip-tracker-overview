
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
  Send,
  Sparkles,
  Star,
  Globe
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import PageTransition from "@/components/layout/PageTransition";
import { toast } from "@/components/ui/use-toast";
import { useLandingPageImage } from "@/hooks/use-landing-page-image";

const FeatureCard = ({ 
  icon, 
  title, 
  description,
  delay = 0,
  gradient
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay?: number;
  gradient: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="h-full group"
    >
      <Card className="border-0 h-full bg-white/60 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        <CardContent className="pt-8 pb-6 px-6 relative z-10">
          <div className={`mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
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
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Fetch images from storage using our hooks
  const { image: dashboardImage } = useLandingPageImage('dashboard');
  const { image: licenseImage } = useLandingPageImage('license');
  const { image: bookingImage } = useLandingPageImage('booking');
  const { image: licenseDetailImage } = useLandingPageImage('licenseDetail');

  // Define image URLs with fallbacks
  const IMAGES = {
    dashboard: dashboardImage?.url || "/images/dashboard.jpg",
    license: licenseImage?.url || "/images/license.jpg",
    booking: bookingImage?.url || "/images/booking.jpg",
    licenseDetail: licenseDetailImage?.url || "/images/license-detail.jpg"
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrolled(position > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
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
      icon: <MonitorSmartphone className="h-7 w-7" />,
      title: "Asset Management",
      description: "Verwalten Sie Hardware, Software und andere Assets in einem zentralen, intelligenten System.",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      icon: <ShieldCheck className="h-7 w-7" />,
      title: "ISO 27001 Konform",
      description: "Entspricht den höchsten Anforderungen des ISO 27001 Standards für Informationssicherheit.",
      gradient: "from-emerald-500 to-green-400"
    },
    {
      icon: <BarChart3 className="h-7 w-7" />,
      title: "Umfassendes Reporting",
      description: "Generieren Sie detaillierte, interaktive Berichte über Ihre Assets und deren Nutzung.",
      gradient: "from-purple-500 to-pink-400"
    },
    {
      icon: <KeyRound className="h-7 w-7" />,
      title: "Lizenzmanagement",
      description: "Intelligente Verwaltung von Software-Lizenzen mit automatischer Zuweisungsoptimierung.",
      gradient: "from-orange-500 to-red-400"
    },
    {
      icon: <Calendar className="h-7 w-7" />,
      title: "Asset Buchungssystem",
      description: "Effiziente Planung und Verwaltung gemeinsam genutzter Ressourcen mit Kalenderintegration.",
      gradient: "from-indigo-500 to-blue-400"
    },
    {
      icon: <AlertCircle className="h-7 w-7" />,
      title: "Schadensmanagement",
      description: "Proaktive Dokumentation und Verfolgung von Asset-Schäden für optimale Wartungsplanung.",
      gradient: "from-yellow-500 to-amber-400"
    },
    {
      icon: <FileLineChart className="h-7 w-7" />,
      title: "Abschreibungsmanagement",
      description: "Automatische Verfolgung von Abschreibungen und Realtime-Bewertung Ihrer Assets.",
      gradient: "from-teal-500 to-cyan-400"
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: "Mitarbeiterverwaltung",
      description: "Zentrale Verwaltung von Asset-Zuweisungen und intelligente Budgetverteilung.",
      gradient: "from-rose-500 to-pink-400"
    },
    {
      icon: <CheckCircle className="h-7 w-7" />,
      title: "Compliance Monitoring",
      description: "Automatische Überwachung und Sicherstellung der Einhaltung aller relevanten Standards.",
      gradient: "from-violet-500 to-purple-400"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Modern Navigation */}
        <motion.nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrolled 
              ? 'bg-white/80 backdrop-blur-2xl shadow-lg border-b border-white/20' 
              : 'bg-transparent'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Asset Tracker
              </span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isAuthenticated ? "Dashboard" : "Anmelden"}
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 20,
                ease: "linear"
              }}
            />
            <motion.div 
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 25,
                ease: "linear"
              }}
            />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          </div>

          <div className="container mx-auto px-6 z-10 py-32">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              {/* Left Content */}
              <motion.div
                className="lg:w-1/2 text-center lg:text-left"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 mb-8"
                >
                  <Star className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-semibold text-blue-700">ISO 27001 Zertifiziert</span>
                </motion.div>
                
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Die Zukunft des
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Asset Managements
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
                  Revolutionieren Sie Ihr Unternehmen mit unserer intelligenten Asset Management Plattform. 
                  <span className="block mt-2 text-gray-500">
                    Sicher, effizient und zukunftsorientiert.
                  </span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 mb-16">
                  <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-14 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                      onMouseEnter={() => setIsHoveringCTA(true)}
                      onMouseLeave={() => setIsHoveringCTA(false)}
                    >
                      {isAuthenticated ? "Zum Dashboard" : "Kostenlos starten"}
                      <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHoveringCTA ? 'translate-x-1' : ''}`} />
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="font-semibold h-14 px-8 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all duration-300 w-full sm:w-auto"
                    onClick={scrollToFeatures}
                  >
                    Funktionen entdecken
                    <ArrowDown className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">Unternehmen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side Image */}
              <motion.div
                className="lg:w-1/2 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                style={{ y }}
              >
                <div className="relative">
                  {/* Floating Cards */}
                  <motion.div
                    className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 z-20"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Assets Online</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 z-20"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Weltweit verfügbar</span>
                    </div>
                  </motion.div>

                  {/* Main Image Container */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-gradient-to-br from-blue-100 to-purple-100">
                    <img 
                      src={IMAGES.dashboard} 
                      alt="Dashboard Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                        e.currentTarget.className = "p-8 bg-gradient-to-br from-blue-100 to-purple-100";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 mb-6">
                  <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-semibold text-blue-700">Funktionen</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  Alles was Sie brauchen
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Unser Asset Management System vereint modernste Technologie mit intuitiver Bedienung 
                  für maximale Effizienz in Ihrem Unternehmen.
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  gradient={feature.gradient}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-32 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-16">
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                  <span className="text-sm font-semibold text-white">Vorteile</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
                  Warum Asset Tracker die richtige Wahl ist
                </h2>
                
                <p className="text-xl text-blue-100 mb-12 leading-relaxed">
                  Transformieren Sie Ihr Asset Management und erleben Sie eine neue Dimension 
                  der Effizienz und Kontrolle.
                </p>
                
                <ul className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-2 rounded-xl mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-lg text-blue-100 group-hover:text-white transition-colors duration-300">
                        {benefit}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                className="lg:w-1/2 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-3xl"></div>
                  <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm">
                    <img 
                      src={IMAGES.license} 
                      alt="License Management" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                        e.currentTarget.className = "p-8 bg-white/10";
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Bleiben Sie auf dem neuesten Stand
                  </h2>
                  <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                    Erhalten Sie exklusive Updates über neue Features, Best Practices und Branchentrends.
                  </p>
                  
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder="Ihre E-Mail-Adresse"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-blue-100 h-12 flex-1 rounded-xl backdrop-blur-sm"
                      required
                    />
                    <Button 
                      type="submit" 
                      className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-8 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Abonnieren
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 mb-8">
                <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-semibold text-blue-700">Bereit zum Start?</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Starten Sie Ihre digitale Transformation
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Schließen Sie sich Hunderten von Unternehmen an, die bereits von unserem 
                Asset Management System profitieren. Der Einstieg ist kostenlos und dauert nur wenige Minuten.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-16 px-12 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg w-full sm:w-auto"
                  >
                    {isAuthenticated ? "Zum Dashboard" : "Jetzt kostenlos starten"}
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-semibold h-16 px-12 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition-all duration-300 text-lg w-full sm:w-auto"
                  onClick={() => window.open('mailto:info@assettracker.com', '_blank')}
                >
                  Kontakt aufnehmen
                  <Mail className="ml-3 h-6 w-6" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-16 border-t border-gray-200 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div 
                className="flex items-center space-x-3 mb-6 md:mb-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Asset Tracker
                </span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-gray-600"
              >
                <p>© 2025 Asset Tracker. Alle Rechte vorbehalten.</p>
              </motion.div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
