import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import reportService from '../services/reportService';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import GlassCard from '../components/ui/GlassCard';
import {
  ArrowLeft,
  MessageSquare,
  Link2,
  Image,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Fingerprint,
  Activity,
  Clock,
  Cpu,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Globe,
  Layers,
  ExternalLink
} from 'lucide-react';

const ReportDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [similarReports, setSimilarReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await reportService.getReportById(id);
      if (res.success) {
        setReport(res.data);
      }

      // Fetch Similar Reports
      const simRes = await reportService.getSimilarReports(id);
      if (simRes.success) {
        setSimilarReports(simRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unauthorized or failed to load report details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await reportService.analyzeReport(id);
      if (res.success) {
        setReport(res.data);
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

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
  const ai = report.aiAnalysis || {};
  const sb = report.safeBrowsing || {};
  const riskScore = typeof ai.riskScore === 'number' ? ai.riskScore : 65;

  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-cyber-red', bg: 'bg-cyber-red', border: 'border-cyber-red/40', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' };
    if (score >= 60) return { text: 'text-amber-400', bg: 'bg-amber-400', border: 'border-amber-400/40', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]' };
    if (score >= 40) return { text: 'text-yellow-400', bg: 'bg-yellow-400', border: 'border-yellow-400/40', glow: 'shadow-[0_0_20px_rgba(250,204,21,0.2)]' };
    return { text: 'text-emerald-400', bg: 'bg-emerald-400', border: 'border-emerald-400/40', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.2)]' };
  };

  const scoreTheme = getScoreColor(riskScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full relative z-10">
      
      {/* Navigation */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6 flex justify-between items-center">
        <Link
          to="/my-reports"
          className="inline-flex items-center space-x-2 text-sm text-cyber-muted hover:text-white bg-cyber-card/50 border border-cyber-border px-4 py-2 rounded-lg transition-all hover:bg-cyber-card"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>

        {/* AI Re-Analyze Trigger */}
        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-cyber-accent hover:text-white bg-cyber-accent/10 border border-cyber-accent/30 hover:border-cyber-accent px-4 py-2 rounded-lg transition-all hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
          <span>{analyzing ? 'Analyzing...' : 'Re-Run AI & Safety Check'}</span>
        </button>
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
                    {report.isDuplicate && (
                      <span className="text-[10px] uppercase font-bold text-cyber-red bg-cyber-red/10 border border-cyber-red/30 px-2 py-0.5 rounded">
                        Duplicate Pattern
                      </span>
                    )}
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
                <Fingerprint className="w-4 h-4 mr-2 text-cyber-accent" /> Threat Context
              </h3>
              <div className="text-sm text-slate-300 leading-relaxed bg-cyber-dark/60 border border-cyber-border/40 p-5 rounded-xl shadow-inner">
                {report.description}
              </div>
            </div>

            {/* Submitted Payload */}
            <div className="mb-8 relative z-10">
              <h3 className="text-xs font-semibold text-cyber-muted uppercase tracking-widest mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-cyber-accent" /> Raw Payload Data
              </h3>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {report.reportType === 'text' && (
                  <div className="bg-[#090C15] border border-cyber-border rounded-xl p-5 font-mono text-sm text-cyber-red break-words whitespace-pre-wrap shadow-inner relative group">
                    <div className="absolute top-2 right-3 text-[10px] text-cyber-red/50 uppercase">Extracted Payload</div>
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
                    <img
                      src={report.evidenceImage?.url}
                      alt="Scam Evidence Asset"
                      className="rounded-lg w-full max-h-[500px] object-contain"
                    />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Google Safe Browsing Result Panel */}
            {sb && sb.checkedAt && (
              <div className="mb-8 relative z-10 border-t border-cyber-border/40 pt-6">
                <h3 className="text-xs font-semibold text-cyber-muted uppercase tracking-widest mb-3 flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-cyber-accent" /> Google Safe Browsing Intelligence
                </h3>
                <div className={`p-4 rounded-xl border flex items-center justify-between ${sb.isMalicious ? 'bg-cyber-red/10 border-cyber-red/40 text-cyber-red' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'}`}>
                  <div className="flex items-center space-x-3">
                    {sb.isMalicious ? <ShieldAlert className="w-6 h-6 flex-shrink-0" /> : <ShieldCheck className="w-6 h-6 flex-shrink-0" />}
                    <div>
                      <div className="font-bold text-sm">
                        {sb.isMalicious ? 'Flagged as Malicious / Phishing Site' : 'No Threat Matches in Safe Browsing Database'}
                      </div>
                      <div className="text-[11px] opacity-80 font-mono">
                        Flags: {sb.threatTypes && sb.threatTypes.length > 0 ? sb.threatTypes.join(', ') : 'Clean Domain'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">
                    Checked {new Date(sb.checkedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {/* AI Threat Tactics */}
            {ai.tactics && ai.tactics.length > 0 && (
              <div className="mb-6 relative z-10 border-t border-cyber-border/40 pt-6">
                <h3 className="text-xs font-semibold text-cyber-muted uppercase tracking-widest mb-3 flex items-center">
                  <Cpu className="w-4 h-4 mr-2 text-cyber-accent" /> Attack Vectors & Tactics Detected
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ai.tactics.map((tactic, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-3 py-1.5 rounded-md bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 shadow-inner flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3" />
                      {tactic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Indicators of Compromise (IOCs) */}
            {ai.indicatorsOfCompromise && ai.indicatorsOfCompromise.length > 0 && (
              <div className="relative z-10 border-t border-cyber-border/40 pt-6">
                <h3 className="text-xs font-semibold text-cyber-muted uppercase tracking-widest mb-3 flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-2 text-cyber-red" /> Indicators of Compromise (IOCs)
                </h3>
                <div className="space-y-2">
                  {ai.indicatorsOfCompromise.map((ioc, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-mono bg-cyber-dark/80 border border-cyber-red/30 text-slate-200 p-3 rounded-lg flex items-center justify-between shadow-inner"
                    >
                      <span>{ioc}</span>
                      <span className="text-[10px] text-cyber-red uppercase tracking-wider font-bold bg-cyber-red/10 px-2 py-0.5 rounded border border-cyber-red/20">
                        Flagged
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </GlassCard>

          {/* Similar Scam Reports Matching Panel (Module 3 Feature) */}
          {similarReports.length > 0 && (
            <GlassCard className="p-6">
              <h3 className="text-xs font-semibold text-cyber-muted uppercase tracking-widest mb-4 flex items-center">
                <Layers className="w-4 h-4 mr-2 text-cyber-accent" /> Similar Scam Campaign Matches
              </h3>
              <div className="space-y-3">
                {similarReports.map((item, idx) => (
                  <div key={idx} className="bg-cyber-dark/60 border border-cyber-border/40 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-mono bg-cyber-accent/10 text-cyber-accent px-2 py-0.5 rounded border border-cyber-accent/20 font-bold">
                          {item.similarityPercentage}% Match
                        </span>
                        {item.isDuplicateMatch && (
                          <span className="text-[10px] font-mono bg-cyber-red/10 text-cyber-red px-2 py-0.5 rounded border border-cyber-red/20 font-bold">
                            Duplicate Payload
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-white line-clamp-1">{item.report.title}</div>
                      <div className="text-xs text-cyber-muted line-clamp-1">{item.report.description}</div>
                    </div>
                    <Link
                      to={`/reports/${item.report._id}`}
                      className="p-2 text-cyber-accent hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

        </div>

        {/* Threat Intelligence / Summary Panel (1/3 width) */}
        <div className="space-y-6">

          {/* AI Risk Score Card */}
          <GlassCard className={`p-6 ${scoreTheme.border} ${scoreTheme.glow} relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-4 border-b border-cyber-border/40 pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-cyber-accent animate-pulse" />
                <h2 className="text-xs font-bold text-white uppercase tracking-widest">ScamSentry AI Risk Score</h2>
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${scoreTheme.border} ${scoreTheme.text} bg-cyber-dark`}>
                {ai.riskLevel || 'Analyzed'}
              </span>
            </div>

            {/* Meter Bar */}
            <div className="w-full bg-cyber-dark border border-cyber-border rounded-xl p-5 text-center mb-6">
              <div className="text-4xl font-black mb-1 text-white flex items-center justify-center gap-1">
                <span className={scoreTheme.text}>{riskScore}</span>
                <span className="text-lg text-cyber-muted font-normal">/ 100</span>
              </div>
              <div className="w-full h-2.5 bg-cyber-card rounded-full overflow-hidden mt-3 p-0.5 border border-cyber-border/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${riskScore}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className={`h-full rounded-full ${scoreTheme.bg}`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-cyber-muted font-mono mt-2">
                <span>0 (Safe)</span>
                <span>50 (Medium)</span>
                <span>100 (Critical)</span>
              </div>
            </div>

            {/* AI Executive Summary */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyber-accent flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI Summary
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-cyber-dark/50 border border-cyber-border/30 p-4 rounded-lg">
                {ai.summary || 'Threat analysis complete. Review extracted indicators above.'}
              </p>
            </div>
          </GlassCard>

          {/* Recommended User Actions Card */}
          {ai.recommendedActions && ai.recommendedActions.length > 0 && (
            <GlassCard className="p-6">
              <h2 className="text-xs font-bold text-cyber-muted mb-4 border-b border-cyber-border/50 pb-3 uppercase tracking-widest flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-emerald-400" /> Recommended Action Steps
              </h2>
              <div className="space-y-3">
                {ai.recommendedActions.map((action, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300 bg-cyber-dark/40 p-3 rounded-lg border border-cyber-border/30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{action}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Telemetry Data Card */}
          <GlassCard className="p-6">
            <h2 className="text-xs font-bold text-cyber-muted mb-4 border-b border-cyber-border/50 pb-3 uppercase tracking-widest flex items-center">
              <Clock className="w-4 h-4 mr-2 text-cyber-accent" /> Telemetry Data
            </h2>
            <div className="space-y-3 text-sm">
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

              <div className="flex flex-col gap-1.5 text-cyber-text bg-cyber-dark/40 p-3 rounded-lg border border-cyber-border/30">
                <span className="text-cyber-muted text-xs uppercase tracking-wider">Report Hash ID</span>
                <span className="font-mono text-[10px] text-cyber-accent bg-cyber-dark px-2 py-1.5 rounded border border-cyber-border select-all break-all">
                  {report._id}
                </span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};

export default ReportDetailsPage;
