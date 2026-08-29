import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatusBadge from '../common/StatusBadge';
import { MessageSquare, Link2, Image, QrCode, Calendar, Eye, Trash2, ArrowRight } from 'lucide-react';
import Loader from '../common/Loader';
import GlassCard from '../ui/GlassCard';

const ReportCard = ({ report, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const icons = {
    text: MessageSquare,
    url: Link2,
    screenshot: Image,
    qr: QrCode
  };

  const IconComponent = icons[report.reportType] || MessageSquare;

  const handleDeleteClick = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this scam report? This will permanently delete the report and any associated images.')) {
      setIsDeleting(true);
      try {
        await onDelete(report._id);
      } catch (err) {
        console.error('Delete failed:', err);
        setIsDeleting(false); // only reset on fail, on success unmounts
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link to={`/reports/${report._id}`} className="block h-full">
        <GlassCard hover={true} className="flex flex-col justify-between h-full p-6 group">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-cyber-dark border border-cyber-border text-cyber-accent group-hover:bg-cyber-accent/10 transition-colors">
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="text-xs uppercase tracking-wider font-semibold text-cyber-muted group-hover:text-cyber-text transition-colors">
                  {report.reportType}
                </span>
              </div>
              <StatusBadge status={report.status} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-accent transition duration-300 line-clamp-1">
              {report.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-cyber-muted line-clamp-3 mb-6 group-hover:text-slate-300 transition-colors">
              {report.description}
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-cyber-border/40 pt-4 mt-auto flex items-center justify-between">
            {/* Date */}
            <div className="flex items-center space-x-2 text-xs text-cyber-muted bg-cyber-dark/50 px-3 py-1.5 rounded-full border border-cyber-border/50">
              <Calendar className="h-3.5 w-3.5 text-cyber-accent" />
              <span>{new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="z-10 flex items-center justify-center bg-cyber-red/10 hover:bg-cyber-red text-cyber-red hover:text-white p-2 rounded-md transition duration-300"
              >
                {isDeleting ? <Loader size="small" /> : <Trash2 className="h-4 w-4" />}
              </button>
              <div className="z-10 flex items-center justify-center bg-cyber-border group-hover:bg-cyber-accent text-cyber-text group-hover:text-cyber-dark p-2 rounded-md transition duration-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
};

export default ReportCard;
