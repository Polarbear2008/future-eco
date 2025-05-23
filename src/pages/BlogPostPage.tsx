import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, Tag, Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BlogCard from "@/components/blog/BlogCard";
import { getValidImageUrl } from "@/services/uploadService";
import { usePublic } from "@/contexts/PublicContext";
import { useEffect, useState } from "react";
import { CustomLoader } from "@/components/animations";
import { Blog } from "@/lib/firebase";

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlogPostById, blogPosts } = usePublic();
  const [isLoading, setIsLoading] = useState(true);
  const [blogPost, setBlogPost] = useState<Blog | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      if (id) {
        const post = getBlogPostById(id);
        setBlogPost(post || null);
        
        // Find related posts (same category, excluding current post)
        if (post) {
          const related = blogPosts
            .filter(p => p.id !== post.id && p.category === post.category)
            .slice(0, 2);
          setRelatedPosts(related);
        }
      }
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id, getBlogPostById, blogPosts]);

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

  // Show not found message if blog post doesn't exist
  if (!blogPost) {
    return (
      <div className="container-custom py-32 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/blog" className="inline-flex items-center">
            <ArrowLeft size={16} className="mr-2" /> Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${getValidImageUrl(blogPost.image)})` }}>
        <div className="container-custom relative z-10 text-center text-white">
          <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white/20 mb-8">
            <Link to="/blog" className="inline-flex items-center">
              <ArrowLeft size={16} className="mr-2" /> Back to All Articles
            </Link>
          </Button>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">{blogPost.title}</h1>
            <div className="flex flex-wrap justify-center items-center gap-4 text-white/90 mb-4">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>{blogPost.author.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{blogPost.date}</span>
              </div>
              <div className="flex items-center">
                <Tag size={16} className="mr-2" />
                <span>{blogPost.category}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <article className="lg:col-span-2">
              <div className="flex items-center mb-8">
                <img 
                  src={getValidImageUrl(blogPost.author.image)} 
                  alt={blogPost.author.name} 
                  className="w-12 h-12 rounded-full mr-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.jpg';
                    target.onerror = null;
                  }}
                />
                <div>
                  <h3 className="font-medium">{blogPost.author.name}</h3>
                  <p className="text-sm text-gray-500">{blogPost.author.role}</p>
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
              
              <div className="mt-10 pt-8 border-t">
                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <span className="font-medium mr-3">Share:</span>
                    <Button variant="ghost" size="icon" className="text-eco-green hover:text-white hover:bg-eco-green rounded-full">
                      <Facebook size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-eco-green hover:text-white hover:bg-eco-green rounded-full">
                      <Twitter size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-eco-green hover:text-white hover:bg-eco-green rounded-full">
                      <Linkedin size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-eco-green hover:text-white hover:bg-eco-green rounded-full">
                      <Mail size={18} />
                    </Button>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Button asChild variant="outline">
                      <Link to="/blog" className="inline-flex items-center">
                        <ArrowLeft size={16} className="mr-2" /> Back to Blog
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
            
            {/* Sidebar */}
            <div>
              <div className="bg-eco-stone/30 p-6 rounded-lg sticky top-24">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-eco-green-dark">About the Author</h3>
                  <div className="flex items-center mb-4">
                    <img 
                      src={getValidImageUrl(blogPost.author.image)} 
                      alt={blogPost.author.name} 
                      className="w-16 h-16 rounded-full mr-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                        target.onerror = null;
                      }}
                    />
                    <div>
                      <h4 className="font-medium">{blogPost.author.name}</h4>
                      <p className="text-sm text-gray-500">{blogPost.author.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    As a dedicated environmentalist, {blogPost.author.name.split(' ')[0]} has been working with Ecofuture to develop sustainable solutions and educate communities about environmental conservation.
                  </p>
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
                      href="https://www.instagram.com/eco_future_for_everyone?igshid=YWJhMjlhZTc9" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 bg-eco-green/10 rounded-full flex items-center justify-center text-eco-green-dark hover:bg-eco-green hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8 text-eco-green-dark">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((post) => (
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
