import { useEffect, useState } from 'react';

interface CursorTrailProps {
  color?: string;
  size?: number;
  trailLength?: number;
  fadeTime?: number;
}

interface TrailDot {
  x: number;
  y: number;
  id: number;
  opacity: number;
}

export function CursorTrail({
  color = '#4A7C59', // Updated to match eco-green DEFAULT color
  size = 10,
  trailLength = 12,
  fadeTime = 350,
}: CursorTrailProps) {
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show trail when mouse moves
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    // Hide trail when mouse leaves the window
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Show trail when mouse enters the window
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Add new dot to the trail
    const newDot = {
      x: mousePosition.x,
      y: mousePosition.y,
      id: Date.now(),
      opacity: 0.7, // Reduced initial opacity for subtlety
    };

    setTrail((prevTrail) => {
      // Add new dot and limit trail length
      const updatedTrail = [newDot, ...prevTrail].slice(0, trailLength);
      
      // Fade out dots over time
      return updatedTrail.map((dot, index) => ({
        ...dot,
        opacity: 0.7 - (index / trailLength) * 0.7, // More subtle opacity reduction
      }));
    });

    // Cleanup old dots
    const cleanupInterval = setInterval(() => {
      setTrail((prevTrail) => 
        prevTrail.filter((dot) => Date.now() - dot.id < fadeTime)
      );
    }, fadeTime / 2);

    return () => {
      clearInterval(cleanupInterval);
    };
  }, [mousePosition, isVisible, trailLength, fadeTime]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {trail.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full mix-blend-screen"
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            opacity: dot.opacity,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${size * 0.3}px ${color}`, // Reduced glow effect
            transition: 'opacity 150ms ease-out',
          }}
        />
      ))}
      
      {/* Main cursor dot */}
      <div
        className="absolute rounded-full mix-blend-screen"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          width: `${size * 1.3}px`, // Slightly smaller main dot
          height: `${size * 1.3}px`,
          backgroundColor: color,
          opacity: 0.8, // More subtle opacity
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 ${size * 0.6}px ${color}`, // Reduced glow
          zIndex: 60,
        }}
      />
    </div>
  );
}
