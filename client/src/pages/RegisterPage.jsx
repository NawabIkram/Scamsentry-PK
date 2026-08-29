import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Shield, KeyRound, Mail, User, AlertTriangle, ArrowRight } from 'lucide-react';
import Loader from '../components/common/Loader';
import GlassCard from '../components/ui/GlassCard';

const RegisterPage = () => {
  const { user, register, loading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState('');

  // Clear errors on mount
  useEffect(() => {
    clearError();
    setValidationError('');
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/my-reports');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    const { name, email, password, confirmPassword } = formData;

    // Simple validations
    if (!name || !email || !password || !confirmPassword) {
      setValidationError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      navigate('/my-reports');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative w-full overflow-hidden">
      
      {/* Background glow effects specific to this page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-accent/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <GlassCard className="p-8 md:p-10 shadow-2xl relative overflow-hidden group">
          
          <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-cyber-accent/10 blur-[40px] rounded-full group-hover:bg-cyber-accent/20 transition-colors duration-700 pointer-events-none"></div>

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-cyber-dark border border-cyber-border mb-6 shadow-inner relative">
              <div className="absolute inset-0 rounded-full border border-cyber-accent/30 animate-[spin_4s_linear_infinite_reverse]"></div>
              <Shield className="h-10 w-10 text-cyber-accent drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Agent Enlistment</h2>
            <p className="mt-2 text-sm text-cyber-muted font-mono tracking-widest uppercase">
              Join ScamSentry Intelligence
            </p>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {(validationError || authError) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-cyber-red/10 border border-cyber-red/30 text-cyber-red px-4 py-3 rounded-lg flex items-start space-x-2 text-sm mb-6"
              >
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{validationError || authError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
            <div className="space-y-4">
              
              {/* Name Field */}
              <div className="group/field relative">
                <label htmlFor="name" className="block text-xs font-bold text-cyber-muted uppercase tracking-widest mb-2 transition-colors group-focus-within/field:text-cyber-accent">
                  Agent Identity (Name)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-cyber-muted transition-colors group-focus-within/field:text-cyber-accent" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    className="block w-full pl-11 pr-3 py-3 border border-cyber-border rounded-lg bg-cyber-dark/80 text-white placeholder-cyber-muted/50 focus:outline-none focus:ring-1 focus:ring-cyber-accent focus:border-cyber-accent focus:bg-cyber-dark text-sm transition-all"
                    placeholder="Muhammad Ali"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="group/field relative">
                <label htmlFor="email" className="block text-xs font-bold text-cyber-muted uppercase tracking-widest mb-2 transition-colors group-focus-within/field:text-cyber-accent">
                  Secure Comms (Email)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-cyber-muted transition-colors group-focus-within/field:text-cyber-accent" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="block w-full pl-11 pr-3 py-3 border border-cyber-border rounded-lg bg-cyber-dark/80 text-white placeholder-cyber-muted/50 focus:outline-none focus:ring-1 focus:ring-cyber-accent focus:border-cyber-accent focus:bg-cyber-dark text-sm transition-all"
                    placeholder="ali@domain.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group/field relative">
                <label htmlFor="password" className="block text-xs font-bold text-cyber-muted uppercase tracking-widest mb-2 transition-colors group-focus-within/field:text-cyber-accent">
                  Encryption Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-cyber-muted transition-colors group-focus-within/field:text-cyber-accent" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="block w-full pl-11 pr-3 py-3 border border-cyber-border rounded-lg bg-cyber-dark/80 text-white placeholder-cyber-muted/50 focus:outline-none focus:ring-1 focus:ring-cyber-accent focus:border-cyber-accent focus:bg-cyber-dark text-sm transition-all"
                    placeholder="•••••••• (Min 6 chars)"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="group/field relative">
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-cyber-muted uppercase tracking-widest mb-2 transition-colors group-focus-within/field:text-cyber-accent">
                  Verify Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-cyber-muted transition-colors group-focus-within/field:text-cyber-accent" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="block w-full pl-11 pr-3 py-3 border border-cyber-border rounded-lg bg-cyber-dark/80 text-white placeholder-cyber-muted/50 focus:outline-none focus:ring-1 focus:ring-cyber-accent focus:border-cyber-accent focus:bg-cyber-dark text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-cyber-dark bg-white hover:bg-cyber-accent hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] disabled:opacity-50 overflow-hidden relative"
              >
                {loading ? (
                  <Loader size="small" />
                ) : (
                  <>
                    <span className="relative z-10">Register Agent</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2 relative z-10" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-8 relative z-10">
            <p className="text-sm text-cyber-muted">
              Already enlisted?{' '}
              <Link to="/login" className="font-bold text-cyber-accent hover:text-white transition-colors duration-200">
                Authenticate here
              </Link>
            </p>
          </div>

        </GlassCard>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
