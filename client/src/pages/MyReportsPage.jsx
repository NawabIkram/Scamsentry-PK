import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import reportService from '../services/reportService';
import ReportCard from '../components/reports/ReportCard';
import Loader from '../components/common/Loader';
import { ShieldCheck, Plus, FileText, AlertCircle, TrendingUp, ShieldAlert } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch reports on mount
  useEffect(() => {
    fetchUserReports();
  }, []);

  const fetchUserReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await reportService.getMyReports();
      if (res.success) {
        setReports(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch report history. Ensure server is online.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (id) => {
    try {
      const res = await reportService.deleteReport(id);
      if (res.success) {
        // Filter out deleted report
        setReports((prev) => prev.filter((report) => report._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report.');
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-transparent min-h-[calc(100vh-128px)] relative">
        <Loader size="large" />
      </div>
    );
  }

  // Calculate stats
  const activeThreats = reports.filter(r => r.status === 'pending' || r.status === 'in-progress').length;
  const verifiedThreats = reports.filter(r => r.status === 'resolved').length;
  const riskScore = Math.min(100, Math.floor((verifiedThreats / (reports.length || 1)) * 100) + 15);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full relative">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-cyber-border pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <FileText className="h-8 w-8 text-cyber-accent" />
            <span>Threat Intelligence Dashboard</span>
          </h1>
          <p className="text-cyber-muted text-sm mt-2 max-w-xl">
            Monitor the status of your submitted scam reports. High-risk patterns are flagged and broadcasted to the community network.
          </p>
        </div>
        
        {/* Create CTA */}
        <Link
          to="/report"
          className="flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold bg-white hover:bg-cyber-accent text-cyber-dark hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]"
        >
          <Plus className="h-4 w-4" />
          <span>New Scan</span>
        </Link>
      </div>

      {/* Stats row */}
      {reports.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <GlassCard className="p-6 flex items-center justify-between">
            <div>
              <p className="text-cyber-muted text-xs uppercase tracking-widest font-semibold mb-1">Total Submissions</p>
              <h3 className="text-3xl font-bold text-white">{reports.length}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-cyber-dark border border-cyber-border flex items-center justify-center">
              <FileText className="h-6 w-6 text-cyber-accent" />
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center justify-between">
            <div>
              <p className="text-cyber-muted text-xs uppercase tracking-widest font-semibold mb-1">Active Threats</p>
              <h3 className="text-3xl font-bold text-cyber-red">{activeThreats}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-cyber-dark border border-cyber-border flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-cyber-red" />
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center justify-between">
            <div>
              <p className="text-cyber-muted text-xs uppercase tracking-widest font-semibold mb-1">Profile Risk Score</p>
              <h3 className="text-3xl font-bold text-cyber-green">{riskScore}/100</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-cyber-dark border border-cyber-border flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-cyber-green" />
            </div>
          </GlassCard>
        </div>
      )}

      {/* Errors */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-cyber-red/10 border border-cyber-red/30 text-cyber-red px-4 py-3 rounded-lg flex items-center space-x-2 text-sm mb-6"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content List */}
      {reports.length === 0 ? (
        <GlassCard className="p-12 text-center max-w-xl mx-auto shadow-md relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyber-green/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <div className="inline-flex p-5 bg-cyber-dark border border-cyber-border rounded-full text-cyber-accent mb-6 shadow-inner">
              <ShieldCheck className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Threats Detected</h2>
            <p className="text-cyber-muted mb-8 text-lg">
              Your intelligence ledger is clean! You have not filed any suspicious messages, QR codes, links, or screenshots.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-cyber-accent hover:bg-cyber-hover text-cyber-dark font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:-translate-y-1"
            >
              <Plus className="h-4 w-4" />
              <span>Run First Scan</span>
            </Link>
          </div>
        </GlassCard>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {reports.map((report) => (
              <ReportCard
                key={report._id}
                report={report}
                onDelete={handleDeleteReport}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
};

export default MyReportsPage;
