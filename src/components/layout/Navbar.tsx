import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  scrolled: boolean;
}

const Navbar = ({ scrolled }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        scrolled 
          ? "bg-white shadow-md py-2" 
          : "bg-white/80 backdrop-blur-sm py-2" 
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Section - Left aligned */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center group">
            <div className="relative overflow-hidden rounded-full">
              <img 
                src="/logo.png" 
                alt="Eco Future Logo" 
                className="h-10 w-auto transition-all duration-300 transform group-hover:scale-110"
              />
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold text-eco-green-dark">Ecofuture</span>
              <span className="block text-xs tracking-wider font-medium text-eco-green-dark/70">small steps · big impact</span>
            </div>
          </Link>
        </div>
        
        {/* Navigation - Centered */}
        <div className="hidden md:flex justify-center">
          <nav className="flex space-x-1">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/projects", label: "Projects" },
              { to: "/blog", label: "Blog" },
              { to: "/get-involved", label: "Get Involved" },
              { to: "/contact", label: "Contact" }
            ].map(({ to, label }) => (
              <NavLink 
                key={to}
                to={to} 
                className={({ isActive }) => 
                  cn(
                    "px-4 py-2 text-base font-medium transition-all duration-200 rounded-md mx-1",
                    isActive 
                      ? "text-eco-green bg-eco-green/10 font-semibold" 
                      : "text-eco-green-dark hover:text-eco-green hover:bg-eco-green/5"
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* CTA Button - Right aligned */}
        <div className="hidden md:block">
          <Button 
            asChild
            className="bg-eco-green hover:bg-eco-green-dark text-white shadow-md hover:shadow-lg font-semibold transition-all duration-300"
          >
            <a href="https://t.me/ecofuturebot" target="_blank" rel="noopener noreferrer">Donate Now</a>
          </Button>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "p-2 rounded-md transition-colors",
              scrolled 
                ? "text-eco-green-dark hover:bg-eco-green/10" 
                : "text-eco-green-dark hover:bg-eco-green/10"
            )}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={cn(
        "md:hidden transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pt-2 pb-6 space-y-2 bg-white/95 backdrop-blur-sm shadow-lg border-t border-eco-green/10">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/projects", label: "Projects" },
            { to: "/blog", label: "Blog" },
            { to: "/get-involved", label: "Get Involved" },
            { to: "/contact", label: "Contact" }
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "block px-4 py-3 text-base font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-eco-green/10 text-eco-green"
                    : "text-eco-green-dark hover:bg-eco-green/5 hover:text-eco-green"
                )
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-200">
            <Button asChild className="w-full bg-eco-green hover:bg-eco-green-dark text-white shadow-md">
              <a href="https://t.me/ecofuturebot" target="_blank" rel="noopener noreferrer">Donate Now</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
