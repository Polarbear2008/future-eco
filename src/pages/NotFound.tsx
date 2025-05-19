
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Sprout } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-eco-stone/30 pt-16">
      <div className="container-custom text-center py-20">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-eco-green/10 rounded-full flex items-center justify-center">
            <Sprout size={48} className="text-eco-green" />
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold mb-4 text-eco-green-dark">404</h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8">
          Oops! The page you're looking for seems to have wandered off.
        </p>
        <p className="text-gray-600 max-w-md mx-auto mb-10">
          It might be lost in the wilderness or perhaps it's been naturally recycled. Let's help you find your way back.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            variant="outline" 
            className="border-eco-green text-eco-green hover:bg-eco-green hover:text-white"
          >
            <Link to="/" className="inline-flex items-center">
              <ArrowLeft size={16} className="mr-2" /> Go Back
            </Link>
          </Button>
          <Button asChild className="bg-eco-green hover:bg-eco-green-dark text-white">
            <Link to="/" className="inline-flex items-center">
              <Home size={16} className="mr-2" /> Return to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
