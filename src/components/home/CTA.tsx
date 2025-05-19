
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { memo } from "react";

interface CTAProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bgColor?: string;
  textColor?: string;
}

const CTA = memo(({ 
  title, 
  description, 
  buttonText, 
  buttonLink,
  bgColor = "bg-eco-green",
  textColor = "text-white"
}: CTAProps) => {
  return (
    <section className={`${bgColor} ${textColor} py-20 relative overflow-hidden`}>
      {/* Simplified background elements - fewer animations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/20 blur-3xl"></div>
      </div>
      
      <div className="container-custom text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 transition-transform duration-700 animate-slide-up">
          {title}
        </h2>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {description}
        </p>
        <div className="relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-eco-green-light via-eco-sky to-eco-green opacity-70 rounded-lg blur-md group-hover:opacity-100 transition-all duration-500"></div>
          <Button 
            asChild 
            size="lg" 
            className="relative px-8 py-6 text-lg bg-white text-eco-green-dark hover:bg-eco-green-dark hover:text-white transition-all duration-500 shadow-xl animate-slide-up z-10"
            style={{ animationDelay: '400ms' }}
          >
            <Link to={buttonLink} className="flex items-center space-x-2">
              <span>{buttonText}</span>
              <svg 
                className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
});

CTA.displayName = 'CTA';

export default CTA;
