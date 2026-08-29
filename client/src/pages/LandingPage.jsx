import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  FileText, 
  Link as LinkIcon, 
  Image as PhotoIcon, 
  QrCode,
  Globe,
  AlertTriangle,
  Smartphone,
  CreditCard,
  Briefcase,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import ThreatGlobe from '../components/security/ThreatGlobe';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
  >
    <GlassCard className="h-full p-6 group">
      <div className="h-12 w-12 rounded-lg bg-cyber-dark border border-cyber-border flex items-center justify-center mb-4 group-hover:border-cyber-accent transition-colors">
        <Icon className="w-6 h-6 text-cyber-accent group-hover:scale-110 transition-transform" />
      </div>
      <h3 className="text-xl font-bold text-cyber-text mb-2 group-hover:text-cyber-accent transition-colors">{title}</h3>
      <p className="text-cyber-muted text-sm leading-relaxed">{description}</p>
    </GlassCard>
  </motion.div>
);

const ScamCategoryCard = ({ icon: Icon, title }) => (
  <GlassCard className="flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:border-cyber-accent transition-colors h-40">
    <Icon className="w-10 h-10 text-cyber-muted group-hover:text-cyber-accent mb-3 transition-colors group-hover:-translate-y-1 duration-300" />
    <span className="font-semibold text-sm text-cyber-text group-hover:text-white transition-colors">{title}</span>
  </GlassCard>
);

const LandingPage = () => {
  return (
    <div className="w-full relative z-10">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12 relative z-10">
          
          {/* Left Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-card border border-cyber-border text-xs md:text-sm text-cyber-accent mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-accent"></span>
              </span>
              AI-Powered Scam Intelligence for Pakistan
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-cyber-text tracking-tight mb-6 leading-tight"
            >
              Detect Scams <br className="hidden md:block"/>
              Before They <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent to-blue-500">Reach You.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-cyber-muted mb-10 max-w-xl leading-relaxed"
            >
              ScamSentry PK analyzes suspicious messages, links and scam patterns to help Pakistani users identify potential digital fraud.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link 
                to="/report" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyber-accent text-cyber-dark font-bold hover:bg-cyber-hover transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
              >
                <ShieldCheck className="w-5 h-5" />
                Analyze a Scam
              </Link>
              <Link 
                to="/report" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyber-card border border-cyber-border text-cyber-text hover:border-cyber-muted transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5" />
                Check Suspicious URL
              </Link>
            </motion.div>
          </div>

          {/* Right 3D Globe */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
            className="w-full lg:w-1/2 relative"
          >
            <Suspense fallback={<div className="w-full h-[400px] flex items-center justify-center text-cyber-accent/50 animate-pulse">Initializing Visualization...</div>}>
              <ThreatGlobe />
            </Suspense>
            
            {/* Overlay Elements */}
            <div className="absolute top-1/4 -left-4 md:-left-8 hidden lg:flex items-center gap-2 bg-cyber-card border border-cyber-border rounded-lg p-3 text-xs text-cyber-accent animate-float">
               <AlertTriangle className="w-4 h-4 text-cyber-red" /> High Risk Detected
            </div>
            <div className="absolute bottom-1/4 -right-4 md:-right-8 hidden lg:flex items-center gap-2 bg-cyber-card border border-cyber-border rounded-lg p-3 text-xs text-cyber-green animate-float" style={{ animationDelay: '2s' }}>
               <ShieldCheck className="w-4 h-4" /> Pattern Secured
            </div>
          </motion.div>

        </div>
      </section>

      {/* Live Threat Strip */}
      <section className="py-8 border-y border-cyber-border bg-cyber-card/40 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-cyber-border/50 text-center">
             <AnimatedCounter end={2481} title="Scam Patterns Analyzed" />
             <AnimatedCounter end={734} title="Suspicious URLs Detected" />
             <AnimatedCounter end={91} suffix="%" title="Detection Confidence" />
             <AnimatedCounter end={24} suffix="/7" title="Threat Intelligence" />
          </div>
          <div className="mt-6 text-center">
            <span className="text-[10px] text-cyber-muted uppercase tracking-widest bg-cyber-border/30 px-2 py-1 rounded">Demo Intelligence Data</span>
          </div>
        </div>
      </section>

      {/* Supported Inputs Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-cyber-text mb-4">Comprehensive Threat Analysis</h2>
            <p className="text-cyber-muted text-lg">
              Our platform supports multiple formats to help you accurately document and report suspicious activities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              delay={0}
              icon={FileText}
              title="Suspicious Text"
              description="Analyze SMS messages, WhatsApp forwards, or emails for common phishing patterns and social engineering tactics."
            />
            <FeatureCard 
              delay={0.1}
              icon={LinkIcon}
              title="Malicious URLs"
              description="Report potentially dangerous links. Our database tracks fraudulent domains and deceptive websites."
            />
            <FeatureCard 
              delay={0.2}
              icon={PhotoIcon}
              title="Screenshot Evidence"
              description="Upload visual evidence of fake profiles, fraudulent payment receipts, or deceptive advertisements."
            />
            <FeatureCard 
              delay={0.3}
              icon={QrCode}
              title="Deceptive QR Codes"
              description="Report malicious QR codes that redirect to phishing sites or attempt unauthorized transactions."
            />
          </div>
        </div>
      </section>

      {/* Scam Categories */}
      <section className="py-24 bg-cyber-card/30 border-t border-cyber-border relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="lg:w-1/3 sticky top-24">
              <h2 className="text-3xl md:text-4xl font-bold text-cyber-text mb-6">Threats in Pakistan</h2>
              <p className="text-cyber-muted text-lg mb-8 leading-relaxed">
                Scams in Pakistan are unique, from fake BISP messages to fraudulent mobile wallets. We focus on threats relevant to our region. Explore common scam categories we analyze.
              </p>
              <Link to="/report" className="inline-flex items-center gap-2 text-cyber-accent hover:text-white transition-colors font-semibold">
                Report an incident <span aria-hidden="true">→</span>
              </Link>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <ScamCategoryCard icon={Smartphone} title="WhatsApp Fraud" />
              <ScamCategoryCard icon={Briefcase} title="Fake Job Offers" />
              <ScamCategoryCard icon={CreditCard} title="Mobile Wallet Scams" />
              <ScamCategoryCard icon={ShieldCheck} title="OTP Theft" />
              <ScamCategoryCard icon={TrendingUp} title="Investment Scams" />
              <ScamCategoryCard icon={ShoppingCart} title="Online Shopping" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-cyber-accent/10 blur-[120px] rounded-full pointer-events-none"></div>
         <GlassCard className="container mx-auto px-6 md:px-12 py-16 text-center max-w-4xl relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Contribute?</h2>
            <p className="text-cyber-muted text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Join thousands of users in building a safer digital Pakistan. Create an account to track your reports and access premium threat intelligence features.
            </p>
            <Link 
              to="/register" 
              className="inline-flex px-10 py-4 rounded-xl bg-white text-cyber-dark font-bold text-lg hover:bg-cyber-accent hover:text-white transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]"
            >
              Create Free Account
            </Link>
         </GlassCard>
      </section>
    </div>
  );
};

export default LandingPage;
