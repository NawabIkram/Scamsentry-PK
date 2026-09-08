import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import adminService from '../services/adminService';
import Loader from '../components/common/Loader';
import StatusBadge from '../components/common/StatusBadge';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import {
  Users,
  FileText,
  AlertCircle,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Database,
  CheckCircle,
  Flag,
  XCircle
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}>
    <GlassCard className="p-6 flex items-center justify-between relative overflow-hidden group">
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-[30px] opacity-20 transition-opacity group-hover:opacity-40 ${color}`}></div>
      <div className="relative z-10">
        <span className="text-xs uppercase font-bold tracking-widest text-cyber-muted mb-1 block">{title}</span>
        <h3 className="text-4xl font-black text-white mt-1">
          <AnimatedCounter end={value || 0} title="" />
        </h3>
      </div>
      <div className={`p-4 rounded-xl border relative z-10 backdrop-blur-md ${color.replace('bg-', 'bg-').replace('/10', '/10 text-').replace('border-', 'border-')}`}>
        <Icon className="h-8 w-8" style={{ color: color === 'bg-cyber-accent' ? '#38BDF8' : color === 'bg-cyber-green' ? '#10B981' : color === 'bg-yellow-500' ? '#EAB308' : '#FFF' }} />
      </div>
    </GlassCard>
  </motion.div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, reportsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getReports()
      ]);

      if (statsRes.success && reportsRes.success) {
        setStats(statsRes.data);
        setReports(reportsRes.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin dashboard records.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    setUpdatingId(reportId);
    try {
      const res = await adminService.updateReportStatus(reportId, newStatus);
      if (res.success) {
        setReports((prev) =>
          prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
        );
        // Refresh stats counter
        const statsRes = await adminService.getStats();
        if (statsRes.success) setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Failed to update report status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-transparent min-h-[calc(100vh-128px)] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full relative z-10">
      
      {/* Page Header */}
      <div className="border-b border-cyber-border/50 pb-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <ShieldAlert className="h-8 w-8 text-yellow-500 animate-pulse" />
            <span>Overwatch Command Center</span>
          </h1>
          <p className="text-cyber-muted text-sm mt-2 max-w-xl">
            Community moderation workflow and threat intelligence ledger. Access Level: Administrator.
          </p>
        </div>
        <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center space-x-2 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <Database className="w-4 h-4" />
          <span>Admin Moderation Active</span>
        </div>
      </div>

      {/* Errors */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="bg-cyber-red/10 border border-cyber-red/30 text-cyber-red px-4 py-3 rounded-xl flex items-center space-x-2 text-sm mb-8 shadow-lg shadow-cyber-red/5">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Counter Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Registered Agents" value={stats.users.total} icon={Users} color="bg-cyber-accent" delay={0.1} />
          <StatCard title="Total Threats Logged" value={stats.reports.total} icon={FileText} color="bg-cyber-green" delay={0.2} />
          <StatCard title="Verified Threat Intel" value={stats.reports.verified || 0} icon={CheckCircle} color="bg-emerald-500" delay={0.3} />
          <StatCard title="Flagged Scams" value={stats.reports.flagged || 0} icon={ShieldAlert} color="bg-cyber-red" delay={0.4} />
        </div>
      )}

      {/* Reports Table Area */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <GlassCard hover={false} className="overflow-hidden">
          <div className="p-5 md:p-6 border-b border-cyber-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-cyber-dark/40">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center">
              <Activity className="w-5 h-5 mr-2 text-cyber-accent" /> Community Moderation Feed
            </h2>
            <span className="text-xs bg-cyber-dark border border-cyber-border px-3 py-1.5 rounded-md text-cyber-accent font-mono font-semibold">
              {reports.length} Submissions Logged
            </span>
          </div>

          {reports.length === 0 ? (
            <div className="p-16 text-center">
               <div className="inline-flex p-4 bg-cyber-dark border border-cyber-border rounded-full text-cyber-muted mb-4 shadow-inner">
                 <ShieldCheck className="w-10 h-10" />
               </div>
               <p className="text-cyber-muted text-lg">No threat reports detected in network database.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#090C15] text-cyber-muted uppercase text-xs font-semibold tracking-wider">
                    <th className="p-5 border-b border-cyber-border/50 font-medium">Incident Details</th>
                    <th className="p-5 border-b border-cyber-border/50 font-medium">Vector</th>
                    <th className="p-5 border-b border-cyber-border/50 font-medium">Reporting Agent</th>
                    <th className="p-5 border-b border-cyber-border/50 font-medium">Status</th>
                    <th className="p-5 border-b border-cyber-border/50 font-medium text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border/30">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-cyber-accent/5 transition-colors group">
                      <td className="p-5">
                        <div className="font-bold text-white max-w-[200px] lg:max-w-xs truncate group-hover:text-cyber-accent transition-colors">{report.title}</div>
                        <div className="text-xs text-cyber-muted truncate max-w-[200px] lg:max-w-xs mt-1">{report.description}</div>
                      </td>
                      <td className="p-5">
                        <span className="inline-flex px-2 py-1 rounded bg-cyber-dark border border-cyber-border text-[10px] uppercase font-bold text-cyber-accent tracking-widest">
                          {report.reportType}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="text-white font-medium text-xs">{report.user?.name || 'UNKNOWN AGENT'}</div>
                        <div className="text-[10px] font-mono text-cyber-muted mt-1">{report.user?.email || 'CLASSIFIED'}</div>
                      </td>
                      <td className="p-5">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Moderation Buttons */}
                          <button
                            onClick={() => handleStatusUpdate(report._id, 'verified')}
                            disabled={updatingId === report._id}
                            title="Verify Report"
                            className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(report._id, 'flagged')}
                            disabled={updatingId === report._id}
                            title="Flag Scam Campaign"
                            className="p-1.5 rounded bg-cyber-red/10 border border-cyber-red/30 text-cyber-red hover:bg-cyber-red/20 transition-colors"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(report._id, 'rejected')}
                            disabled={updatingId === report._id}
                            title="Reject Submission"
                            className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to={`/reports/${report._id}`}
                            className="p-1.5 rounded bg-cyber-dark border border-cyber-border text-cyber-accent hover:border-cyber-accent transition-colors ml-1"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </motion.div>

    </div>
  );
};

export default AdminDashboardPage;
