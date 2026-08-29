import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`bg-cyber-card backdrop-blur-xl border border-cyber-border rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
