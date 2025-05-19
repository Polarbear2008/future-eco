
import { useState, useEffect, useRef, ReactNode } from "react";

interface StatsCounterProps {
  end: number;
  title: string;
  icon: ReactNode;
}

const StatsCounter = ({ end, title, icon }: StatsCounterProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px 100px 0px' }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    
    // Use requestAnimationFrame for smoother animation
    const duration = 2000; // Slightly shorter animation for better performance
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function for smoother start and end
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easedProgress * end);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, end]);

  return (
    <div ref={counterRef} className="text-center transform transition-all duration-700 hover:scale-105">
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-inner-glow">
          {icon}
        </div>
      </div>
      <div className="relative">
        <div className="text-5xl font-bold mb-2 flex items-center justify-center">
          <span className="counter-number">{count}</span>
          <span className="ml-1 text-4xl">+</span>
        </div>
        <div className="absolute -inset-1 -z-10 bg-gradient-to-r from-eco-green/0 via-eco-green/20 to-eco-green/0 blur opacity-30"></div>
      </div>
      <div className="text-xl font-medium mt-2">{title}</div>
    </div>
  );
};

export default StatsCounter;
