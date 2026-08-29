import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

const InitialLoader = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('INITIALIZING SYSTEMS');

  useEffect(() => {
    // Sequence of texts
    const sequence = [
      { text: 'ESTABLISHING SECURE CONNECTION...', time: 400 },
      { text: 'BYPASSING MAINFRAME...', time: 800 },
      { text: 'LOADING THREAT INTELLIGENCE...', time: 1200 },
      { text: 'SYSTEMS ONLINE', time: 1800 }
    ];

    sequence.forEach(({ text, time }) => {
      setTimeout(() => setText(text), time);
    });

    // End loader after 2.2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="initial-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cyber-dark overflow-hidden"
          >
            {/* Grid bg */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
            
            <div className="relative flex flex-col items-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-cyber-accent/30"
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                className="absolute inset-0 bg-cyber-accent/20 blur-xl rounded-full"
              />
              
              <Shield className="w-20 h-20 text-cyber-accent relative z-10" />
            </div>

            <div className="mt-8 relative h-10 flex items-center justify-center">
               <motion.p
                  key={text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-cyber-accent font-mono text-sm tracking-[0.3em] font-bold absolute whitespace-nowrap"
               >
                 {text}
               </motion.p>
            </div>
            
            <div className="mt-6 w-64 h-1 bg-cyber-card rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 1.8, ease: "circInOut" }}
                 className="h-full bg-cyber-accent"
               />
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
      {/* Do not render children until finished if we want strict blocking, but rendering them behind is better for LCP */}
      {children}
    </>
  );
};

export default InitialLoader;
