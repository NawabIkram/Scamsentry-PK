import React from 'react';

/**
 * Reusable color-coded badge for Scam Report status
 * @param {string} status - 'pending', 'processing', 'analyzed', or 'rejected'
 */
const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    processing: 'bg-cyber-accent/10 text-cyber-accent border-cyber-accent/20',
    analyzed: 'bg-cyber-green/10 text-cyber-green border-cyber-green/20',
    rejected: 'bg-cyber-red/10 text-cyber-red border-cyber-red/20'
  };

  const labels = {
    pending: 'Pending Review',
    processing: 'Processing',
    analyzed: 'Analyzed',
    rejected: 'Rejected'
  };

  const currentStyle = styles[status] || styles.pending;
  const currentLabel = labels[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${currentStyle}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current"></span>
      {currentLabel}
    </span>
  );
};

export default StatusBadge;
