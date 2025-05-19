import { ArrowRight, TreePine, Users, Heart, Globe2, Leaf, Award, SparkleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ProjectCard from "@/components/projects/ProjectCard";
import BlogCard from "@/components/blog/BlogCard";
import StatsCounter from "@/components/home/StatsCounter";
import TestimonialSlider from "@/components/home/TestimonialSlider";
import CTA from "@/components/home/CTA";
import { 
  HoverCard as UIHoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { usePublic } from "@/contexts/PublicContext";

// Import our custom animation components
import { 
  AnimatedSection, 
  HoverCard, 
  MicroInteraction, 
  LoadingSpinner,
  CustomLoader
} from "@/components/animations";

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);
  
  // Get data from PublicContext
  const { featuredProjects, featuredBlogPosts, stats } = usePublic();

  useEffect(() => {
    // Simulate loading for demo purposes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    // More efficient cursor trail effect with throttling
    const handleMouseMove = (e: MouseEvent) => {
      // Only create a trail every 50ms to reduce DOM operations
      if (!ticking.current) {
        ticking.current = true;
        
        setTimeout(() => {
          const trail = document.createElement('div');
          trail.className = 'cursor-trail';
          trail.style.left = `${e.clientX}px`;
          trail.style.top = `${e.clientY}px`;
          document.body.appendChild(trail);
          
          setTimeout(() => {
            if (trail && trail.parentNode) {
              trail.parentNode.removeChild(trail);
            }
          }, 1000);
          
          ticking.current = false;
        }, 50);
      }
    };
    
    // Optimized parallax scroll effect using requestAnimationFrame
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Show loading spinner while content is loading
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <CustomLoader 
          animationPath="/animations/Animation - 1743225546141.json"
          animationType="json"
          width={400}
          height={400}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="h-[90vh] min-h-[600px] relative flex items-center">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80')",
            backgroundPosition: "center 30%",
            transform: `translate3d(0, 0, 0) scale(${1 + scrollY * 0.0003})`,
            transition: 'transform 0.1s ease-out',
          }}
        ></div>
        
        {/* Animated particles with hardware acceleration */}
        <div className="absolute inset-0 z-10 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-eco-green-light blur-xl animate-float will-change-transform" 
               style={{transform: 'translate3d(0, 0, 0)'}}></div>
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-eco-sky blur-xl animate-float-delayed will-change-transform"
               style={{transform: 'translate3d(0, 0, 0)'}}></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-eco-green blur-xl will-change-transform" 
               style={{animationDelay: "1s", animationDuration: "7s", transform: 'translate3d(0, 0, 0)'}}></div>
        </div>
        
        <div className="container-custom relative z-20 text-white mt-16">
          <AnimatedSection animation="fadeIn" className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-lg">
              <span className="block text-gradient-white">Shaping a</span>
              <span className="block gradient-text">Greener Future</span>
              <span className="block">Together</span>
            </h1>
            
            <AnimatedSection animation="slideUp" delay={0.3} className="mb-10">
              <p className="text-xl md:text-2xl text-white/90">
                Join Ecofuture in our mission to create sustainable communities 
                and protect our planet for future generations.
              </p>
            </AnimatedSection>
            
            <AnimatedSection animation="slideUp" delay={0.6} className="flex flex-wrap gap-4">
              <UIHoverCard>
                <HoverCardTrigger asChild>
                  <MicroInteraction type="button">
                    <Button asChild size="lg" className="group bg-eco-green hover:bg-eco-green-dark text-white text-lg py-6 px-8 rounded-lg shadow-eco">
                      <Link to="/get-involved" className="flex items-center">
                        Join Us
                        <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </MicroInteraction>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4">
                  <div className="flex flex-col space-y-2">
                    <h4 className="text-lg font-semibold">Make a Difference Today</h4>
                    <p className="text-sm text-muted-foreground">Join our community of environmentalists and help us protect the planet for future generations.</p>
                  </div>
                </HoverCardContent>
              </UIHoverCard>
              
              <UIHoverCard>
                <HoverCardTrigger asChild>
                  <MicroInteraction type="button">
                    <Button asChild size="lg" variant="outline" className="group bg-white/20 backdrop-blur-sm text-white border-white/40 hover:bg-white/30 text-lg py-6 px-8 rounded-lg">
                      <Link to="/projects" className="flex items-center">
                        Our Projects
                        <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </MicroInteraction>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4">
                  <div className="flex flex-col space-y-2">
                    <h4 className="text-lg font-semibold">Explore Our Impact</h4>
                    <p className="text-sm text-muted-foreground">Discover the environmental projects we're working on and how they're making a difference.</p>
                  </div>
                </HoverCardContent>
              </UIHoverCard>
            </AnimatedSection>
          </AnimatedSection>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/60 flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse-subtle"></div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-eco-stone/30 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-eco-green/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-20 w-80 h-80 rounded-full bg-eco-sky/5 blur-3xl"></div>
        
        <div className="container-custom relative">
          <AnimatedSection animation="fadeIn" className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-eco-green/10 text-eco-green-dark rounded-full text-sm font-semibold mb-3">Our Mission</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-eco-green-dark">
              Creating a <span className="text-gradient">Sustainable World</span>
            </h2>
            <p className="text-xl text-gray-700">
              Ecofuture is dedicated to creating a sustainable world through community engagement,
              education, and innovative environmental initiatives. We believe that everyone has
              the power to make a positive impact on our planet.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection animation="slideUp" delay={0.1}>
              <HoverCard hoverEffect="glow" className="glass-card p-8 text-center h-full">
                <div className="w-16 h-16 bg-eco-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-eco-lg transform transition-transform duration-500 hover:scale-110">
                  <TreePine size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-eco-green-dark">Environmental Protection</h3>
                <p className="text-gray-600">
                  Preserving natural habitats and biodiversity through conservation efforts and sustainable practices.
                </p>
              </HoverCard>
            </AnimatedSection>
            
            <AnimatedSection animation="slideUp" delay={0.3}>
              <HoverCard hoverEffect="glow" className="glass-card p-8 text-center h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-eco-earth to-eco-earth-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-eco-lg transform transition-transform duration-500 hover:scale-110">
                  <Users size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-eco-earth-dark">Community Engagement</h3>
                <p className="text-gray-600">
                  Empowering local communities through education, resources, and collaborative initiatives.
                </p>
              </HoverCard>
            </AnimatedSection>
            
            <AnimatedSection animation="slideUp" delay={0.5}>
              <HoverCard hoverEffect="glow" className="glass-card p-8 text-center h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-eco-sky to-eco-sky-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-eco-lg transform transition-transform duration-500 hover:scale-110">
                  <Globe2 size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-eco-sky-dark">Global Sustainability</h3>
                <p className="text-gray-600">
                  Creating long-term solutions for climate change through innovative approaches and partnerships.
                </p>
              </HoverCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="gradient-bg-animate text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-eco-green mix-blend-multiply"></div>
        <div className="relative z-10 container-custom">
          <AnimatedSection animation="fadeIn" className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-white/10 text-white rounded-full text-sm font-semibold mb-3 backdrop-blur-sm">Our Impact</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Making a Difference</h2>
            <p className="text-xl max-w-3xl mx-auto opacity-90">Our efforts are creating measurable impact around the world</p>
          </AnimatedSection>
          
          <AnimatedSection animation="staggered" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatsCounter end={stats.totalProjects * 20 || 500} title="Trees Planted" icon={<TreePine size={28} />} />
            <StatsCounter end={stats.totalProjects * 40 || 1000} title="Volunteers" icon={<Users size={28} />} />
            <StatsCounter end={stats.totalProjects || 25} title="Projects" icon={<Globe2 size={28} />} />
            <StatsCounter end={stats.activeProjects || 15} title="Active Communities" icon={<Heart size={28} />} />
          </AnimatedSection>
        </div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full bg-white/5"></div>
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-white/5"></div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 nature-pattern relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
        <div className="container-custom">
          <AnimatedSection animation="fadeIn" className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-eco-green/10 text-eco-green-dark rounded-full text-sm font-semibold mb-3">Making Impact</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-eco-green-dark">Our Featured Projects</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover some of our ongoing initiatives making a real impact in communities around the world.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects && featuredProjects.length > 0 ? (
              featuredProjects.slice(0, 3).map((project, index) => (
                <AnimatedSection key={project.id} animation="slideUp" delay={0.1 * (index + 1)}>
                  <ProjectCard 
                    title={project.title}
                    description={project.short_description || project.description.substring(0, 120) + '...'}
                    image={project.image || `/images/projects/default-project-${(index % 3) + 1}.jpg`}
                    badge={project.status === 'active' ? 'Ongoing' : project.status === 'completed' ? 'Completed' : 'Upcoming'}
                    link={`/projects/${project.id}`}
                  />
                </AnimatedSection>
              ))
            ) : (
              // Fallback content if no featured projects are available
              <>
                <AnimatedSection animation="slideUp" delay={0.1}>
                  <ProjectCard 
                    title="Forest Restoration"
                    description="Restoring degraded forest ecosystems through native tree planting and natural regeneration methods."
                    image="/images/projects/forest-restoration.jpg"
                    badge="Ongoing"
                    link="/projects"
                  />
                </AnimatedSection>
                <AnimatedSection animation="slideUp" delay={0.3}>
                  <ProjectCard 
                    title="Clean Water Initiative"
                    description="Providing clean water solutions to communities in need through sustainable filtration systems."
                    image="/images/projects/clean-water.jpg"
                    badge="Featured"
                    link="/projects"
                  />
                </AnimatedSection>
                <AnimatedSection animation="slideUp" delay={0.5}>
                  <ProjectCard 
                    title="Youth Environmental Education"
                    description="Empowering the next generation through hands-on environmental education programs."
                    image="/images/projects/youth-education.jpg"
                    badge="New"
                    link="/projects"
                  />
                </AnimatedSection>
              </>
            )}
          </div>
          
          <AnimatedSection animation="fadeIn" delay={0.7} className="text-center mt-12">
            <Button asChild variant="outline" className="border-eco-green text-eco-green hover:bg-eco-green hover:text-white group">
              <Link to="/projects" className="inline-flex items-center">
                View All Projects <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-eco-stone/30 to-white"></div>
        <div className="container-custom relative z-10">
          <AnimatedSection animation="fadeIn" className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-eco-green/10 text-eco-green-dark rounded-full text-sm font-semibold mb-3">Recognition</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-green-dark">Awards & Achievements</h2>
          </AnimatedSection>
          
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <AnimatedSection animation="slideUp" delay={0.1}>
              <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover-glow">
                <Award className="h-12 w-12 text-eco-green mb-3" />
                <h3 className="text-lg font-semibold mb-1">Environmental Excellence</h3>
                <p className="text-sm text-gray-600 text-center">2023 National Award</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="slideUp" delay={0.3}>
              <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover-glow">
                <SparkleIcon className="h-12 w-12 text-eco-earth mb-3" />
                <h3 className="text-lg font-semibold mb-1">Community Impact</h3>
                <p className="text-sm text-gray-600 text-center">Regional Recognition</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="slideUp" delay={0.5}>
              <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover-glow">
                <Leaf className="h-12 w-12 text-eco-sky mb-3" />
                <h3 className="text-lg font-semibold mb-1">Sustainability Pioneer</h3>
                <p className="text-sm text-gray-600 text-center">Industry Leader</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-eco-earth/10 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-eco-earth/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-eco-earth/10 blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <AnimatedSection animation="fadeIn" className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-eco-earth/20 text-eco-earth-dark rounded-full text-sm font-semibold mb-3">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-eco-earth-dark">What People Say</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Hear from our volunteers, partners, and community members about their experiences with Ecofuture.
            </p>
          </AnimatedSection>
          
          <TestimonialSlider />
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-eco-earth/10 to-white"></div>
        <div className="container-custom relative z-10">
          <AnimatedSection animation="fadeIn" className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-eco-green/10 text-eco-green-dark rounded-full text-sm font-semibold mb-3">Latest News</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-eco-green-dark">Latest From Our Blog</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Stay updated with the latest environmental news, tips, and insights from our team.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBlogPosts && featuredBlogPosts.length > 0 ? (
              featuredBlogPosts.slice(0, 3).map((blog, index) => (
                <AnimatedSection key={blog.id} animation="slideUp" delay={0.1 * (index + 1)}>
                  <BlogCard 
                    title={blog.title}
                    excerpt={blog.excerpt || blog.content.substring(0, 120) + '...'}
                    image={blog.image || `https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80`}
                    date={new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    category={blog.category || "Environmental"}
                    id={blog.id}
                  />
                </AnimatedSection>
              ))
            ) : (
              // Fallback content if no blog posts are available
              <>
                <AnimatedSection animation="slideUp" delay={0.1}>
                  <BlogCard 
                    title="10 Simple Ways to Reduce Your Carbon Footprint"
                    excerpt="Practical tips for making environmentally friendly choices in your everyday life."
                    image="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80"
                    date="Oct 15, 2023"
                    category="Sustainable Living"
                    id="1"
                  />
                </AnimatedSection>
                <AnimatedSection animation="slideUp" delay={0.3}>
                  <BlogCard 
                    title="The Importance of Biodiversity Conservation"
                    excerpt="Understanding why preserving biodiversity is crucial for maintaining healthy ecosystems."
                    image="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80"
                    date="Oct 10, 2023"
                    category="Conservation"
                    id="2"
                  />
                </AnimatedSection>
                <AnimatedSection animation="slideUp" delay={0.5}>
                  <BlogCard 
                    title="Community Gardens: Building Green Spaces Together"
                    excerpt="How community gardens are transforming urban environments and bringing people together."
                    image="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80"
                    date="Oct 5, 2023"
                    category="Community"
                    id="3"
                  />
                </AnimatedSection>
              </>
            )}
          </div>
          
          <AnimatedSection animation="fadeIn" delay={0.7} className="text-center mt-12">
            <Button asChild variant="outline" className="border-eco-green text-eco-green hover:bg-eco-green hover:text-white group">
              <Link to="/blog" className="inline-flex items-center">
                Read More Articles <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <CTA 
        title="Ready to Make a Difference?"
        description="Join our community of environmentalists and help us create a more sustainable future for all."
        buttonText="Get Involved Today"
        buttonLink="/get-involved"
      />
    </div>
  );
};

export default HomePage;
