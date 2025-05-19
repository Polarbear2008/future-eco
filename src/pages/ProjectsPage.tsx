import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProjectCard from "@/components/projects/ProjectCard";
import CTA from "@/components/home/CTA";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePublic } from "@/contexts/PublicContext";
import { Project } from "@/contexts/AdminContext";
import { CustomLoader } from "@/components/animations";
import { publicFilterCategories } from "@/lib/constants";

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  
  // Get projects from PublicContext
  const { projects } = usePublic();
  
  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter projects based on search query and category
  useEffect(() => {
    let filtered = [...projects];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        project => 
          project.title.toLowerCase().includes(query) || 
          project.description.toLowerCase().includes(query) ||
          project.category.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (activeCategory !== "All") {
      filtered = filtered.filter(project => project.category === activeCategory);
    }
    
    setFilteredProjects(filtered);
  }, [searchQuery, activeCategory, projects]);
  
  // Use predefined categories from constants
  const categories = publicFilterCategories;
  
  // Map project status to badge
  const getBadge = (project: Project) => {
    if (project.featured) return "Featured";
    switch(project.status) {
      case "active": return "Ongoing";
      case "planning": return "Upcoming";
      case "completed": return "Completed";
      default: return null;
    }
  };

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

  return (
    <div className="container-custom py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Projects</h1>
        <p className="text-xl text-gray-600">
          Discover the initiatives we're working on to create a more sustainable future.
          From conservation efforts to community development, our projects aim to make a positive impact.
        </p>
      </div>
      
      {/* Search and filter */}
      <div className="mb-12">
        <div className="flex flex-col gap-6 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full bg-gray-100 rounded-md p-2">
            <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-center rounded-md transition-colors ${
                    activeCategory === category 
                      ? 'bg-white shadow-sm text-gray-800' 
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.short_description || project.description.substring(0, 150) + '...'}
              image={project.image}
              badge={getBadge(project)}
              link={`/projects/${project.id}`}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No projects found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      
      <CTA 
        title="Want to Get Involved?" 
        description="Join our community of volunteers and make a difference in your local environment."
        buttonText="Join Now"
        buttonLink="/get-involved"
      />
    </div>
  );
};

export default ProjectsPage;
