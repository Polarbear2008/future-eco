import React from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
}

/**
 * A component for displaying Lottie animations
 * 
 * @param animationData - The JSON animation data object
 * @param loop - Whether the animation should loop
 * @param autoplay - Whether the animation should play automatically
 * @param className - Additional CSS classes
 * @param style - Additional inline styles
 * @param width - Width of the animation
 * @param height - Height of the animation
 */
const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  loop = true,
  autoplay = true,
  className = '',
  style = {},
  width,
  height,
}) => {
  return (
    <div 
      className={`lottie-animation-container ${className}`} 
      style={{ 
        width: width || '100%', 
        height: height || '100%',
        ...style 
      }}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LottieAnimation;
