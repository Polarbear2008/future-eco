import React from 'react';
import { motion } from 'framer-motion';

interface MicroInteractionProps {
  children: React.ReactNode;
  type: 'button' | 'input' | 'success' | 'error' | 'custom';
  className?: string;
  customAnimation?: any;
}

const MicroInteraction: React.FC<MicroInteractionProps> = ({
  children,
  type,
  className = '',
  customAnimation,
}) => {
  // Button press animation
  const buttonAnimation = {
    tap: { scale: 0.95 },
  };

  // Input focus animation
  const inputAnimation = {
    focus: { 
      boxShadow: '0 0 0 2px rgba(72, 187, 120, 0.5)',
      borderColor: 'rgba(72, 187, 120, 1)',
    },
  };

  // Success animation
  const successAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "backOut",
      }
    },
  };

  // Error animation
  const errorAnimation = {
    initial: { x: 0 },
    animate: { 
      x: [0, -10, 10, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      }
    },
  };

  // Select the appropriate animation based on type
  const getAnimationProps = () => {
    switch (type) {
      case 'button':
        return {
          whileTap: buttonAnimation.tap,
        };
      case 'input':
        return {
          whileFocus: inputAnimation.focus,
        };
      case 'success':
        return {
          initial: successAnimation.initial,
          animate: successAnimation.animate,
        };
      case 'error':
        return {
          animate: errorAnimation.animate,
        };
      case 'custom':
        return customAnimation;
      default:
        return {};
    }
  };

  return (
    <motion.div className={className} {...getAnimationProps()}>
      {children}
    </motion.div>
  );
};

export default MicroInteraction;
