import React from 'react';
import Lottie from 'lottie-react';

type AnimationType = 'json' | 'gif' | 'video' | 'lottieUrl';

interface CustomLoaderProps {
  animationPath: string;
  animationType: AnimationType;
  className?: string;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
}

/**
 * A custom loader component that displays your animation
 * 
 * @param animationPath - Path to your animation file (relative to public folder) or external URL
 * @param animationType - Type of animation ('json', 'gif', 'video', or 'lottieUrl')
 * @param className - Additional CSS classes
 * @param width - Width of the animation
 * @param height - Height of the animation
 * @param loop - Whether the animation should loop
 * @param autoplay - Whether the animation should play automatically
 */
const CustomLoader: React.FC<CustomLoaderProps> = ({
  animationPath,
  animationType,
  className = '',
  width = 200,
  height = 200,
  loop = true,
  autoplay = true
}) => {
  // For JSON animations, we need to dynamically import the file
  const [animationData, setAnimationData] = React.useState<any>(null);

  React.useEffect(() => {
    // Only fetch JSON data if the animation type is 'json'
    if (animationType === 'json') {
      fetch(animationPath)
        .then(response => response.json())
        .then(data => setAnimationData(data))
        .catch(error => console.error('Error loading animation:', error));
    }
  }, [animationPath, animationType]);

  return (
    <div 
      className={`custom-loader ${className}`}
      style={{ 
        width, 
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {animationType === 'json' && animationData && (
        <Lottie
          animationData={animationData}
          loop={loop}
          autoplay={autoplay}
          style={{ width: '100%', height: '100%' }}
        />
      )}
      
      {animationType === 'lottieUrl' && (
        <iframe 
          src={animationPath}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            overflow: 'hidden'
          }}
          title="Lottie Animation"
          allowFullScreen
        />
      )}
      
      {animationType === 'gif' && (
        <img 
          src={animationPath}
          alt="Loading animation"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      )}
      
      {animationType === 'video' && (
        <video
          autoPlay={autoplay}
          loop={loop}
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        >
          <source src={animationPath} type={`video/${animationPath.split('.').pop()}`} />
        </video>
      )}
    </div>
  );
};

export default CustomLoader;
