import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import reportService from '../services/reportService';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import GlassCard from '../components/ui/GlassCard';
import { ArrowLeft, MessageSquare, Link2, Image, QrCode, Calendar, Info, ShieldAlert, AlertTriangle, Fingerprint, Activity, Clock } from 'lucide-react';

const ReportDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await reportService.getReportById(id);
        if (res.success) {
          setReport(res.data);
          // Simulate a brief "analysis loading" state for the cool factor
          setTimeout(() => setAnalyzing(false), 800);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unauthorized or failed to load report details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-transparent min-h-[calc(100vh-128px)] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyber-accent/5 blur-[100px] rounded-full pointer-events-none z-0"></div>
        <Loader size="large" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center flex-grow">
        <GlassCard className="p-10 flex flex-col items-center border-cyber-red/30 relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-cyber-red"></div>
          <div className="inline-flex p-5 bg-cyber-red/10 border border-cyber-red/30 rounded-full text-cyber-red mb-6 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
          <p className="text-cyber-muted text-lg mb-8 max-w-md mx-auto">{error || 'Threat intelligence report not found or you lack clearance.'}</p>
          <Link
            to="/my-reports"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-cyber-dark border border-cyber-border hover:border-cyber-accent text-white font-semibold rounded-lg transition-all hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const icons = {
    text: MessageSquare,
    url: Link2,
    screenshot: Image,
    qr: QrCode
  };

  const IconComponent = icons[report.reportType] || MessageSquare;
  
  // Calculate a fake "Risk Score" based on ID and type for UI purposes until Phase 2
  const fakeRiskScore = Math.floor((parseInt(report._id.substring(18), 16) / 16777215) * 40) + 55;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full relative z-10">
      
      {/* Navigation */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
        <Link
          to="/my-reports"
          className="inline-flex items-center space-x-2 text-sm text-cyber-muted hover:text-white bg-cyber-card/50 border border-cyber-border px-4 py-2 rounded-lg transition-all hover:bg-cyber-card"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card Body */}
          <GlassCard className="p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-accent/5 blur-[80px] rounded-full pointer-events-none"></div>

            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-cyber-border/50 pb-6 mb-6 relative z-10">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-cyber-dark border border-cyber-border text-cyber-accent shadow-inner">
                  <IconComponent className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-xs uppercase font-bold tracking-widest text-cyber-accent bg-cyber-accent/10 px-2 py-0.5 rounded border border-cyber-accent/20">
                      {report.reportType} Vector
                    </span>
                    <StatusBadge status={report.status} />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                    {report.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Context/Description */}
            <div className="mb-8 relative z-10">
              <h3 className="text-xs font-semibold text-cyber-muted uppercase tracking-widest mb-3 flex items-center">
                <Fingerprint className="w-4 h-4 mr-2" /> Threat Context
              </h3>
              <div className="text-sm text-slate-300 leading-relaxed bg-cyber-dark/60 border border-cyber-border/40 p-5 rounded-xl shadow-inner">
                {report.description}
              </div>
            </div>

            {/* Submitted Payload (Dynamic based on type) */}
            <div className="mb-4 relative z-10">
              <h3 className="text-xs font-semibold text-cyber-muted uppercase tracking-widest mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2" /> Raw Payload Data
              </h3>

              {analyzing ? (
                <div className="bg-[#090C15] border border-cyber-border rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                   <Loader size="medium" />
                   <span className="mt-4 text-cyber-accent text-sm font-mono animate-pulse">Decrypting payload...</span>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {report.reportType === 'text' && (
                    <div className="bg-[#090C15] border border-cyber-border rounded-xl p-5 font-mono text-sm text-cyber-red break-words whitespace-pre-wrap shadow-inner relative group">
                      <div className="absolute top-2 right-3 text-[10px] text-cyber-red/50 uppercase">Extracted Text</div>
                      <div className="mt-2">{report.textContent}</div>
                    </div>
                  )}

                  {report.reportType === 'url' && (
                    <div className="bg-[#090C15] border border-cyber-border rounded-xl p-5 font-mono text-sm text-cyber-accent flex items-center space-x-3 shadow-inner overflow-hidden group">
                      <Link2 className="h-5 w-5 flex-shrink-0 text-cyber-accent/70" />
                      <a href={report.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:underline truncate block w-full">
                        {report.url}
                      </a>
                    </div>
                  )}

                  {(report.reportType === 'screenshot' || report.reportType === 'qr') && (
                    <div className="border border-cyber-border rounded-xl bg-[#090C15] p-2 overflow-hidden shadow-inner relative group">
                      <div className="absolute top-4 left-4 bg-cyber-dark/80 backdrop-blur-md px-3 py-1 rounded-md border border-cyber-border text-xs font-mono text-cyber-accent opacity-0 group-hover:opacity-100 transition-opacity">
                        Visual Evidence
                      </div>
                      <img
                        src={report.evidenceImage?.url}
                        alt="Scam Evidence Asset"
                        className="rounded-lg w-full max-h-[500px] object-contain"
                      />
                      <div className="p-3 bg-cyber-dark/50 border-t border-cyber-border mt-2 rounded-b-lg flex justify-between items-center">
                         <span className="text-xs text-cyber-muted font-mono">{report.evidenceImage?.publicId || 'image-asset'}</span>
                         <a
                           href={report.evidenceImage?.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-xs text-cyber-accent hover:text-white transition-colors font-semibold flex items-center gap-1"
                         >
                           Open Original <ArrowLeft className="w-3 h-3 rotate-135" />
                         </a>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

          </GlassCard>

        </div>

        {/* Threat Intelligence / Summary Panel (1/3 width) */}
        <div className="space-y-6">
          
          {/* Metadata Card */}
          <GlassCard className="p-6">
            <h2 className="text-xs font-bold text-cyber-muted mb-4 border-b border-cyber-border/50 pb-3 uppercase tracking-widest flex items-center">
              <Clock className="w-4 h-4 mr-2" /> Telemetry Data
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between text-cyber-text bg-cyber-dark/40 p-3 rounded-lg border border-cyber-border/30">
                <span className="text-cyber-muted text-xs uppercase tracking-wider">Status</span>
                <StatusBadge status={report.status} />
              </div>
              
              <div className="flex items-center justify-between text-cyber-text bg-cyber-dark/40 p-3 rounded-lg border border-cyber-border/30">
                <span className="text-cyber-muted text-xs uppercase tracking-wider">Captured</span>
                <span className="font-semibold text-white text-xs">
                  {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="flex flex-col gap-2 text-cyber-text bg-cyber-dark/40 p-3 rounded-lg border border-cyber-border/30">
                <span className="text-cyber-muted text-xs uppercase tracking-wider">Hash / ID</span>
                <span className="font-mono text-[10px] text-cyber-accent bg-cyber-dark px-2 py-1.5 rounded border border-cyber-border select-all break-all">
                  {report._id}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* AI Banner Notice */}
          <GlassCard className="p-6 border-cyber-accent/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-accent/10 blur-[40px] rounded-full"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-cyber-dark border border-cyber-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                <ShieldAlert className="h-6 w-6 text-cyber-accent" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Automated Analysis</h3>
              <p className="text-sm text-cyber-muted mb-4 leading-relaxed">
                Detailed AI threat analysis, pattern matching, and indicator extraction are currently scheduled for Phase 2 deployment.
              </p>
              
              <div className="w-full bg-cyber-dark border border-cyber-border rounded-lg p-4">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-xs uppercase tracking-wider text-cyber-muted font-semibold">Estimated Risk</span>
                    <span className={`text-xl font-black ${fakeRiskScore > 75 ? 'text-cyber-red' : 'text-cyber-accent'}`}>{fakeRiskScore}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-cyber-card rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${fakeRiskScore}%` }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      className={`h-full ${fakeRiskScore > 75 ? 'bg-cyber-red' : 'bg-cyber-accent'}`}
                    />
                 </div>
                 <div className="text-[10px] text-cyber-muted/50 text-right mt-2 font-mono">* Demo Data</div>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};

export default ReportDetailsPage;
