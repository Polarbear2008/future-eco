import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  type?: 'circular' | 'dots' | 'eco';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = '#48bb78',
  type = 'eco',
  className = '',
}) => {
  if (type === 'circular') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <motion.div
          className="rounded-full border-t-transparent"
          style={{
            width: size,
            height: size,
            borderWidth: size / 10,
            borderColor: color,
            borderTopColor: 'transparent',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: size / 3,
              height: size / 3,
              backgroundColor: color,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
  }

  // Eco-themed loading spinner (leaf growing)
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div style={{ width: size, height: size }} className="relative">
        {/* Leaf stem */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: size / 10,
            height: 0,
            backgroundColor: color,
            borderRadius: size / 20,
          }}
          animate={{ height: size / 2 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeOut',
          }}
        />
        
        {/* Leaf left */}
        <motion.div
          className="absolute bottom-1/2 left-1/2 origin-bottom-right"
          style={{
            width: size / 2,
            height: size / 3,
            backgroundColor: color,
            borderRadius: '100% 0 100% 0',
            opacity: 0,
          }}
          animate={{ 
            opacity: 1,
            rotate: [-45, -30],
            scale: [0, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeOut',
            delay: 0.3,
          }}
        />
        
        {/* Leaf right */}
        <motion.div
          className="absolute bottom-1/2 left-1/2 origin-bottom-left"
          style={{
            width: size / 2,
            height: size / 3,
            backgroundColor: color,
            borderRadius: '0 100% 0 100%',
            opacity: 0,
          }}
          animate={{ 
            opacity: 1,
            rotate: [45, 30],
            scale: [0, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeOut',
            delay: 0.5,
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
