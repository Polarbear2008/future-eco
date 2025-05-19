import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TrailDot {
  x: number;
  y: number;
  id: number;
}

interface MouseTrailProps {
  color?: string;
  size?: number;
  trailLength?: number;
  enabled?: boolean;
}

const MouseTrail: React.FC<MouseTrailProps> = ({
  color = 'rgba(72, 187, 120, 0.6)',
  size = 10,
  trailLength = 15,
  enabled = true
}) => {
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !isVisible) return;

    const timer = setTimeout(() => {
      setTrail(prevTrail => {
        const newTrail = [...prevTrail, { x: mousePosition.x, y: mousePosition.y, id: Date.now() }];
        if (newTrail.length > trailLength) {
          return newTrail.slice(newTrail.length - trailLength);
        }
        return newTrail;
      });
    }, 20);

    return () => clearTimeout(timer);
  }, [mousePosition, trailLength, isVisible, enabled]);

  if (!enabled || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trail.map((dot, index) => {
        const scale = 1 - index / (trailLength * 1.5);
        return (
          <motion.div
            key={dot.id}
            className="absolute rounded-full"
            style={{
              left: dot.x - size / 2,
              top: dot.y - size / 2,
              width: size,
              height: size,
              backgroundColor: color,
              opacity: scale,
              scale,
            }}
            initial={{ scale: 0 }}
            animate={{ scale }}
            transition={{ duration: 0.2 }}
          />
        );
      })}
    </div>
  );
};

export default MouseTrail;
