import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { usePublic } from "@/contexts/PublicContext";
import { Project } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomLoader } from "@/components/animations";
import CTA from "@/components/home/CTA";

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects } = usePublic();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the project with the matching ID
    if (projects.length > 0 && id) {
      const foundProject = projects.find(p => p.id.toString() === id);
      setProject(foundProject || null);
    }
    
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id, projects]);

  // Handle going back
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <CustomLoader 
          animationPath="/animations/Animation - 1743225546141.json"
          animationType="json"
          width={200}
          height={200}
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container-custom py-20 min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-eco-green-dark mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleBack} className="bg-eco-green hover:bg-eco-green-dark">
            <ArrowLeft size={16} className="mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="h-[50vh] min-h-[400px] relative flex items-center">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('${project.image || '/images/placeholder-project.jpg'}')`,
            backgroundPosition: "center",
          }}
        ></div>
        
        <div className="container-custom relative z-20 text-white mt-16">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            className="mb-6 text-white border-white hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Projects
          </Button>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">{project.title}</h1>
            {project.category && (
              <Badge className="bg-eco-green text-white hover:bg-eco-green-dark mb-4">
                {project.category}
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-eco-green-dark mb-6">About This Project</h2>
                <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                
                {project.short_description && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-eco-green-dark mb-4">Summary</h3>
                    <p className="text-gray-700">{project.short_description}</p>
                  </div>
                )}
                
                {project.goals && project.goals.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-eco-green-dark mb-4">Project Goals</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {project.goals.map((goal, index) => (
                        <li key={index} className="text-gray-700">{goal}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {project.updates && project.updates.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-eco-green-dark mb-4">Project Updates</h3>
                    <div className="space-y-6">
                      {project.updates.map((update) => (
                        <div key={update.id} className="border-l-4 border-eco-green pl-4 py-2">
                          <p className="text-sm text-gray-500 mb-1">{update.date}</p>
                          <h4 className="font-bold text-eco-green-dark mb-2">{update.title}</h4>
                          <p className="text-gray-700">{update.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-eco-stone/20 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-eco-green-dark mb-4">Project Information</h3>
                
                <div className="space-y-4">
                  {project.start_date && (
                    <div className="flex items-start">
                      <Calendar size={20} className="text-eco-green mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Start Date</p>
                        <p className="text-gray-600">{project.start_date}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.location && (
                    <div className="flex items-start">
                      <MapPin size={20} className="text-eco-green mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-gray-600">{project.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.team_members && project.team_members.length > 0 && (
                    <div className="flex items-start">
                      <Users size={20} className="text-eco-green mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Team Members</p>
                        <p className="text-gray-600">{project.team_members.join(', ')}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {project.status && (
                  <div className="mt-6">
                    <p className="font-medium text-gray-900 mb-2">Status</p>
                    <Badge className={`${
                      project.status === 'completed' ? 'bg-green-500' : 
                      project.status === 'active' ? 'bg-blue-500' : 
                      project.status === 'planning' ? 'bg-yellow-500' : 'bg-gray-500'
                    } text-white hover:bg-opacity-90`}>
                      {project.status === 'completed' ? 'Completed' : 
                       project.status === 'active' ? 'In Progress' : 
                       project.status === 'planning' ? 'Upcoming' : project.status}
                    </Badge>
                  </div>
                )}
                
                {project.progress !== undefined && (
                  <div className="mt-6">
                    <p className="font-medium text-gray-900 mb-2">Progress</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-eco-green h-2.5 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-sm text-gray-600 mt-1">{project.progress}%</p>
                  </div>
                )}
                
                {project.budget !== undefined && project.raised !== undefined && (
                  <div className="mt-6">
                    <p className="font-medium text-gray-900 mb-2">Funding</p>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Raised: ${project.raised.toLocaleString()}</span>
                      <span>Goal: ${project.budget.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-eco-green h-2.5 rounded-full" 
                        style={{ width: `${Math.min((project.raised / project.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <Button 
                    onClick={() => navigate('/get-involved')} 
                    className="w-full bg-eco-green hover:bg-eco-green-dark"
                  >
                    Get Involved
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <CTA 
        title="Join Our Environmental Mission" 
        description="Be part of our community working toward a sustainable future."
        buttonText="Volunteer Today"
        buttonLink="/get-involved"
      />
    </div>
  );
};

export default ProjectDetailPage;
