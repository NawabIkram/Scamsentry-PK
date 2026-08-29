import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative mt-auto border-t border-cyber-border/30 bg-cyber-dark/80 backdrop-blur-xl z-20">
      <div className="absolute inset-0 bg-gradient-to-t from-[#050914] to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Brand Logo & Notice */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center space-x-3 text-cyber-accent group">
              <div className="relative">
                <div className="absolute inset-0 rounded-full border border-cyber-accent/50 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                <Shield className="h-7 w-7 transition-transform group-hover:scale-110 group-hover:text-white" />
              </div>
              <span className="font-black text-xl tracking-widest text-white uppercase flex items-center gap-1">
                ScamSentry <span className="text-cyber-accent bg-cyber-accent/10 px-2 rounded ml-1 text-sm border border-cyber-accent/20">INTEL</span>
              </span>
            </Link>
            <p className="text-xs text-cyber-muted mt-4 max-w-sm leading-relaxed font-mono">
              AI-Powered Digital Scam Detection & Threat Intelligence Network. 
              <br className="hidden md:block" />
              <span className="text-cyber-accent/70 mt-1 block">Securing the digital frontier.</span>
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold text-cyber-muted uppercase tracking-widest">
            <Link to="/" className="hover:text-cyber-accent transition-colors duration-200">Terminal</Link>
            <Link to="/report" className="hover:text-cyber-accent transition-colors duration-200">Run Scan</Link>
            <Link to="/login" className="hover:text-cyber-accent transition-colors duration-200">Agent Login</Link>
            <Link to="/register" className="hover:text-cyber-accent transition-colors duration-200">Enlist</Link>
          </div>

        </div>

        <div className="border-t border-cyber-border/40 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-cyber-muted/60 gap-4 font-mono">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></span>
            SYS.ONLINE © {new Date().getFullYear()} ScamSentry
          </p>
          <div className="bg-cyber-dark border border-cyber-border px-3 py-1.5 rounded text-[10px] tracking-widest uppercase font-bold text-cyber-accent shadow-inner">
            Alpha Build • Phase 1
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
