import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CursorTrail } from "@/components/ui/cursor-trail";

const Layout = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize visibility after component is mounted
    setVisible(true);
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if ((currentScrollY > 50 && !scrolled) || (currentScrollY <= 50 && scrolled)) {
        setScrolled(currentScrollY > 50);
      }
    };

    // Setup IntersectionObserver for revealing elements on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains('animate-fade-in')) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px 100px 0px' }
    );

    // Limit the number of observed elements for better performance
    document.querySelectorAll('.reveal-on-scroll').forEach((el, index) => {
      if (index < 20) { // Only observe the first 20 elements
        observer.observe(el);
      }
    });

    // Throttle scroll event for better performance
    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    return () => {
      window.removeEventListener("scroll", scrollHandler);
      observer.disconnect();
    };
  }, [scrolled]);
  
  return (
    <div 
      ref={scrollRef}
      className={`flex flex-col min-h-screen transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <CursorTrail color="#4A7C59" size={10} trailLength={12} fadeTime={350} />
      <Navbar scrolled={scrolled} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`p-3 rounded-full bg-eco-green hover:bg-eco-green-dark text-white shadow-xl transition-all duration-500 transform hover:scale-110 ${
            scrolled 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
          aria-label="Scroll to top"
        >
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Eco Future" className="w-8 h-8" />
            <span className="text-sm font-medium"> {new Date().getFullYear()} Eco Future</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Layout;
