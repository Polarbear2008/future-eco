import { motion } from 'framer-motion';
import React from 'react';

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'rotate' | 'border';
}

export const HoverCard = ({ 
  children, 
  className = '', 
  hoverEffect = 'lift' 
}: HoverCardProps) => {
  
  // Define different hover effects
  const hoverStyles = {
    lift: {
      rest: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
      hover: { 
        y: -8, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.3, ease: 'easeOut' }
      }
    },
    glow: {
      rest: { boxShadow: '0 0 0 0 rgba(72, 187, 120, 0)' },
      hover: { 
        boxShadow: '0 0 20px 5px rgba(72, 187, 120, 0.4)',
        transition: { duration: 0.3, ease: 'easeOut' }
      }
    },
    scale: {
      rest: { scale: 1 },
      hover: { 
        scale: 1.05,
        transition: { duration: 0.2, ease: 'easeOut' }
      }
    },
    rotate: {
      rest: { rotate: 0 },
      hover: { 
        rotate: 2,
        transition: { duration: 0.3, ease: 'easeOut' }
      }
    },
    border: {
      rest: { borderColor: 'rgba(72, 187, 120, 0.2)' },
      hover: { 
        borderColor: 'rgba(72, 187, 120, 1)',
        transition: { duration: 0.3, ease: 'easeOut' }
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial="rest"
      whileHover="hover"
      variants={hoverStyles[hoverEffect]}
    >
      {children}
    </motion.div>
  );
};

export default HoverCard;
