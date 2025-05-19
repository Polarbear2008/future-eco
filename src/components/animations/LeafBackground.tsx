import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LeafProps {
  size: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
}

const Leaf: React.FC<LeafProps> = ({ size, x, delay, duration, rotation }) => {
  return (
    <motion.div
      className="absolute top-0 text-eco-green opacity-20"
      initial={{ y: -100, x, rotate: 0 }}
      animate={{
        y: '100vh',
        rotate: rotation,
        x: [x, x + 50, x - 50, x + 20, x],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
      style={{ fontSize: size }}
    >
      🍃
    </motion.div>
  );
};

interface LeafBackgroundProps {
  count?: number;
  className?: string;
}

const LeafBackground: React.FC<LeafBackgroundProps> = ({ 
  count = 10,
  className = ''
}) => {
  const [leaves, setLeaves] = useState<React.ReactNode[]>([]);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Set window width
    setWindowWidth(window.innerWidth);
    
    // Create leaves
    const newLeaves = Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 20 + 10; // 10-30px
      const x = Math.random() * window.innerWidth;
      const delay = Math.random() * 5; // 0-5s delay
      const duration = Math.random() * 10 + 15; // 15-25s duration
      const rotation = Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1); // Random rotation
      
      return (
        <Leaf
          key={i}
          size={size}
          x={x}
          delay={delay}
          duration={duration}
          rotation={rotation}
        />
      );
    });
    
    setLeaves(newLeaves);
    
    // Handle resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [count, windowWidth]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {leaves}
    </div>
  );
};

export default LeafBackground;
