
import { useState, useEffect, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    text: "Volunteering with Ecofuture has been one of the most rewarding experiences of my life. The community tree planting events not only helped the environment but also brought our neighborhood closer together.",
    name: "Sarah Johnson",
    role: "Community Volunteer",
    image: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    id: 2,
    text: "As a partner organization, we've seen firsthand the positive impact Ecofuture has had on local ecosystems. Their commitment to science-based conservation approaches is truly commendable.",
    name: "Michael Thompson",
    role: "Conservation Partner",
    image: "https://randomuser.me/api/portraits/men/54.jpg"
  },
  {
    id: 3,
    text: "The environmental education program Ecofuture brought to our school transformed how our students think about sustainability. They now lead their own initiatives and inspire their families to make eco-friendly choices.",
    name: "Lisa Rodriguez",
    role: "School Principal",
    image: "https://randomuser.me/api/portraits/women/79.jpg"
  }
];

// Memoized testimonial component for better performance
const Testimonial = memo(({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div className="text-center">
    <p className="text-xl text-gray-700 mb-8 italic">
      "{testimonial.text}"
    </p>
    <div className="flex flex-col items-center">
      <img 
        src={testimonial.image} 
        alt={testimonial.name} 
        className="w-16 h-16 rounded-full mb-4"
        loading="lazy"
      />
      <h4 className="font-bold text-eco-green-dark">{testimonial.name}</h4>
      <p className="text-gray-500">{testimonial.role}</p>
    </div>
  </div>
));

Testimonial.displayName = 'Testimonial';

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const next = useCallback(() => {
    setCurrent((current) => (current + 1) % testimonials.length);
  }, []);
  
  const prev = useCallback(() => {
    setCurrent((current) => (current - 1 + testimonials.length) % testimonials.length);
  }, []);
  
  // Handle auto rotation with better performance
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next]);
  
  // Debounced interaction handler
  const handleInteraction = useCallback(() => {
    setIsAutoPlaying(false);
    // Restart auto-rotation after 10 seconds of inactivity
    const timer = setTimeout(() => setIsAutoPlaying(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute top-10 left-10 text-eco-earth opacity-20">
        <Quote size={100} />
      </div>
      
      <div className="bg-white p-10 md:p-16 rounded-lg shadow-lg relative z-10 min-h-[320px] flex flex-col justify-center">
        <div key={testimonials[current].id} className="animate-fade-in">
          <Testimonial testimonial={testimonials[current]} />
        </div>
      </div>
      
      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index);
              handleInteraction();
            }}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === current ? "bg-eco-green" : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4">
        <Button 
          onClick={() => {
            prev();
            handleInteraction();
          }}
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-eco-green hover:text-white transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} />
        </Button>
        <Button 
          onClick={() => {
            next();
            handleInteraction();
          }}
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-eco-green hover:text-white transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default TestimonialSlider;
