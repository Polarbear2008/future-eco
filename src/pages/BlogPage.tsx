import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Tag, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BlogCard from "@/components/blog/BlogCard";
import { Link } from "react-router-dom";
import { CustomLoader } from "@/components/animations";
import { usePublic } from "@/contexts/PublicContext";

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get blog posts from PublicContext instead of hardcoded data
  const { blogPosts } = usePublic();
  
  // Log the blog posts for debugging
  useEffect(() => {
    console.log('Blog posts:', blogPosts);
  }, [blogPosts]);
  
  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show loading animation while content is loading
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

  // Show error if there is one
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">
          Error loading blogs: {error}
        </div>
      </div>
    );
  }

  // Extract unique categories
  const categories = [...new Set(blogPosts.map(post => post.category))];
  
  // Filter posts based on search query and selected category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get featured post (first post)
  const featuredPost = blogPosts.length > 0 ? blogPosts[0] : null;

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-eco-green text-white">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Our Blog</h1>
            <p className="text-xl mb-0 text-white/90 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Stay updated with the latest environmental news, insights, and sustainability tips.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-cover opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80')" }}></div>
      </section>

      {/* Blog Content */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-8 relative">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
              
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post) => (
                    <BlogCard
                      key={post.id}
                      title={post.title}
                      excerpt={post.excerpt}
                      image={post.image}
                      date={post.date}
                      category={post.category}
                      id={post.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-muted/30 rounded-lg">
                  <p className="text-xl text-gray-500 mb-4">No articles found matching your search.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {setSearchQuery(""); setSelectedCategory(null);}}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-eco-stone/30 p-6 rounded-lg sticky top-24">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-eco-green-dark flex items-center">
                    <Tag size={18} className="mr-2" /> Categories
                  </h3>
                  <div className="space-y-2">
                    <Button 
                      variant={selectedCategory === null ? "default" : "outline"}
                      size="sm"
                      className={selectedCategory === null ? "bg-eco-green hover:bg-eco-green-dark mr-2 mb-2" : "mr-2 mb-2"}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All
                    </Button>
                    {categories.map((category) => (
                      <Button 
                        key={category} 
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        className={selectedCategory === category ? "bg-eco-green hover:bg-eco-green-dark mr-2 mb-2" : "mr-2 mb-2"}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-eco-green-dark flex items-center">
                    <Calendar size={18} className="mr-2" /> Recent Posts
                  </h3>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 4).map((post) => (
                      <div key={post.id} className="flex items-start">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-16 h-16 object-cover rounded-md mr-3"
                        />
                        <div>
                          <Link to={`/blog/${post.id}`} className="font-medium hover:text-eco-green transition-colors line-clamp-2">
                            {post.title}
                          </Link>
                          <p className="text-sm text-gray-500">{post.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-xl font-bold mb-4 text-eco-green-dark">Follow Us</h3>
                  <p className="text-gray-700 mb-4">
                    Connect with us on social media for the latest updates and environmental news.
                  </p>
                  <div className="flex space-x-4">
                    {/* LinkedIn */}
                    <a 
                      href="https://www.linkedin.com/in/ecofuture-foreveryone-2a51bb359/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 bg-eco-green/10 rounded-full flex items-center justify-center text-eco-green-dark hover:bg-eco-green hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                      </svg>
                    </a>
                    
                    {/* Telegram */}
                    <a 
                      href="https://t.me/future_eco" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 bg-eco-green/10 rounded-full flex items-center justify-center text-eco-green-dark hover:bg-eco-green hover:text-white transition-colors"
                      aria-label="Telegram"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"/>
                      </svg>
                    </a>
                    
                    {/* Instagram */}
                    <a 
                      href="https://www.instagram.com/eco_future_for_everyone?igsh=bmxkN2RyenlhdW16" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 bg-eco-green/10 rounded-full flex items-center justify-center text-eco-green-dark hover:bg-eco-green hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                      </svg>
                    </a>
                    
                    {/* YouTube */}
                    <a 
                      href="https://www.youtube.com/@EcoFutureforeveryone" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 bg-eco-green/10 rounded-full flex items-center justify-center text-eco-green-dark hover:bg-eco-green hover:text-white transition-colors"
                      aria-label="YouTube"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
