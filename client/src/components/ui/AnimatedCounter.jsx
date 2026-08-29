import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const AnimatedCounter = ({ end, duration = 2, prefix = "", suffix = "", title }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTime;
      let animationFrame;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);

        if (progress < 1) {
          setCount(Math.floor(end * progress));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="text-3xl lg:text-4xl font-bold text-cyber-text mb-2 tracking-tight flex items-baseline">
        <span className="text-cyber-accent mr-1">{prefix}</span>
        {count.toLocaleString()}
        <span className="text-cyber-accent ml-1">{suffix}</span>
      </div>
      <div className="text-sm text-cyber-muted uppercase tracking-wider font-semibold">{title}</div>
    </div>
  );
};

export default AnimatedCounter;
