import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Shield, Menu, X, LogOut, User as UserIcon, LayoutDashboard, Search, FileText, Info, GraduationCap } from 'lucide-react';

const NavLink = ({ to, children, isActive }) => (
  <Link to={to} className="relative px-3 py-2 text-sm font-medium transition-colors hover:text-white group">
    <span className={`relative z-10 ${isActive ? 'text-white' : 'text-cyber-muted group-hover:text-cyber-accent'}`}>
      {children}
    </span>
    {isActive && (
      <motion.div
        layoutId="navbar-indicator"
        className="absolute inset-0 bg-cyber-glass border border-cyber-border rounded-md"
        initial={false}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    )}
  </Link>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cyber-dark/80 backdrop-blur-xl border-b border-cyber-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent border-b border-transparent pt-2'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Shield className="h-8 w-8 text-cyber-accent group-hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.8)] transition-all" />
            <span className="font-bold text-xl tracking-wider text-white">
              ScamSentry <span className="text-cyber-accent">PK</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 bg-cyber-card/30 backdrop-blur-md border border-cyber-border rounded-xl px-2 py-1">
            <NavLink to="/" isActive={isActive('/')}>Home</NavLink>
            <NavLink to="/report" isActive={isActive('/report')}>Scam Detector</NavLink>
            
            {user ? (
              <>
                <NavLink to="/my-reports" isActive={isActive('/my-reports')}>Dashboard</NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" isActive={isActive('/admin')}>Admin</NavLink>
                )}
              </>
            ) : null}
          </div>

          {/* Desktop Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
               <div className="flex items-center space-x-4 pl-4">
                 <div className="flex items-center space-x-2 text-cyber-text text-sm bg-cyber-card border border-cyber-border px-3 py-1.5 rounded-lg">
                   <UserIcon className="h-4 w-4 text-cyber-accent" />
                   <span className="font-semibold text-slate-200 max-w-[120px] truncate">{user.name}</span>
                 </div>
                 <button
                   onClick={handleLogout}
                   className="flex items-center space-x-1 text-sm font-medium text-cyber-muted hover:text-cyber-red transition duration-200 p-2 hover:bg-cyber-red/10 rounded-md"
                 >
                   <LogOut className="h-5 w-5" />
                 </button>
               </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-cyber-text hover:text-cyber-accent transition duration-200 px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-cyber-dark bg-white hover:bg-cyber-accent hover:text-white px-5 py-2 rounded-lg transition-all duration-300 font-bold hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-cyber-text hover:text-white focus:outline-none p-2 bg-cyber-card border border-cyber-border rounded-md"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-cyber-dark/95 backdrop-blur-xl border-b border-cyber-border px-4 pt-2 pb-6 space-y-2 absolute top-full left-0 right-0 shadow-2xl"
        >
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive('/') ? 'text-cyber-accent bg-cyber-glass border border-cyber-border' : 'text-cyber-muted'}`}
          >
            Home
          </Link>
          <Link
            to="/report"
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive('/report') ? 'text-cyber-accent bg-cyber-glass border border-cyber-border' : 'text-cyber-muted'}`}
          >
            Scam Detector
          </Link>
          {user ? (
            <>
              <Link
                to="/my-reports"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive('/my-reports') ? 'text-cyber-accent bg-cyber-glass border border-cyber-border' : 'text-cyber-muted'}`}
              >
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive('/admin') ? 'text-cyber-accent bg-cyber-glass border border-cyber-border' : 'text-cyber-muted'}`}
                >
                  Admin Panel
                </Link>
              )}
              <div className="border-t border-cyber-border mt-4 pt-4">
                <div className="flex items-center space-x-2 text-cyber-text mb-4 px-4">
                  <UserIcon className="h-5 w-5 text-cyber-accent" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-base font-medium text-cyber-red bg-cyber-red/10 border border-cyber-red/20"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-cyber-border mt-4 pt-4 flex flex-col space-y-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-3 rounded-lg text-base font-medium text-cyber-text bg-cyber-glass border border-cyber-border"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-3 rounded-lg text-base font-bold text-cyber-dark bg-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
