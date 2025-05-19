import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { Blog } from "@/lib/firebase";
import { Project, Volunteer } from "@/lib/supabase";
import * as blogService from "@/services/blogService";
import * as projectService from "@/services/projectService";
import * as volunteerService from "@/services/volunteerService";

// Types
// We're using the types from Firebase and Supabase, but we need to define any additional fields here

// Re-export types for components to use
export type { Project, Volunteer } from "@/lib/supabase";
export type { Blog } from "@/lib/firebase";

// Context type
interface AdminContextType {
  // Blog posts (Firebase)
  blogPosts: Blog[];
  addBlogPost: (post: Omit<Blog, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateBlogPost: (id: string, updatedPost: Partial<Omit<Blog, "id" | "createdAt" | "updatedAt">>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  
  // Projects (Supabase)
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateProject: (id: number, updatedProject: Partial<Omit<Project, "id" | "created_at" | "updated_at">>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  
  // Volunteers (Supabase)
  volunteers: Volunteer[];
  addVolunteer: (volunteer: Omit<Volunteer, "id" | "status" | "created_at">) => Promise<void>;
  updateVolunteer: (id: number, updatedVolunteer: Partial<Volunteer>) => Promise<void>;
  updateVolunteerStatus: (id: number, status: "pending" | "approved" | "rejected") => Promise<void>;
  deleteVolunteer: (id: number) => Promise<void>;
  
  // Dashboard stats
  getDashboardStats: () => {
    totalBlogPosts: number;
    totalProjects: number;
    totalVolunteers: number;
    pendingVolunteers: number;
    activeProjects: number;
  };
  totalBlogPosts: number;
  totalProjects: number;
  totalVolunteers: number;
  pendingVolunteers: number;
  activeProjects: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  // State for blogs (Firebase)
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  
  // State for projects (Supabase)
  const [projects, setProjects] = useState<Project[]>([]);
  
  // State for volunteers (Supabase)
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [pendingVolunteers, setPendingVolunteers] = useState(0);
  
  // Stats
  const [totalBlogPosts, setTotalBlogPosts] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch blog posts
        const blogs = await blogService.getAllBlogs();
        setBlogPosts(blogs);
        setTotalBlogPosts(blogs.length);
        
        // Fetch projects
        const projects = await projectService.getAllProjects();
        setProjects(projects);
        setTotalProjects(projects.length);
        setActiveProjects(projects.filter(p => p.status === 'active').length);
        
        // Fetch volunteers
        const volunteers = await volunteerService.getAllVolunteers();
        console.log('Fetched volunteers:', volunteers);
        setVolunteers(volunteers);
        setTotalVolunteers(volunteers.length);
        setPendingVolunteers(volunteers.filter(v => v.status === 'pending').length);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Failed to load dashboard data");
      }
    };
    
    fetchAllData();
  }, []);

  // Blog functions (Firebase)
  const addBlogPost = async (post: Omit<Blog, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newBlog = await blogService.createBlog(post);
      if (newBlog) {
        setBlogPosts(prev => [newBlog, ...prev]);
        setTotalBlogPosts(prev => prev + 1);
        toast.success("Blog post created successfully!");
      } else {
        throw new Error("Failed to create blog post");
      }
    } catch (error) {
      console.error("Error adding blog post:", error);
      toast.error("Failed to create blog post. Please try again.");
    }
  };

  const updateBlogPost = async (id: string, updatedPost: Partial<Omit<Blog, "id" | "createdAt" | "updatedAt">>) => {
    try {
      const updated = await blogService.updateBlog(id, updatedPost);
      if (updated) {
        setBlogPosts(prev => prev.map(post => post.id === id ? updated : post));
        toast.success("Blog post updated successfully!");
      } else {
        throw new Error("Failed to update blog post");
      }
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error("Failed to update blog post. Please try again.");
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      const success = await blogService.deleteBlog(id);
      if (success) {
        setBlogPosts(prev => prev.filter(post => post.id !== id));
        setTotalBlogPosts(prev => prev - 1);
        toast.success("Blog post deleted successfully!");
      } else {
        throw new Error("Failed to delete blog post");
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Failed to delete blog post. Please try again.");
    }
  };

  // Project functions (Supabase)
  const addProject = async (project: Omit<Project, "id" | "created_at" | "updated_at">) => {
    try {
      // Transform any camelCase properties to snake_case for Supabase
      const supabaseProject = {
        title: project.title,
        description: project.description,
        short_description: project.short_description || "",
        status: project.status,
        category: project.category,
        image: project.image || "",
        featured: project.featured || false,
        progress: project.progress || 0,
        location: project.location || "",
        start_date: project.start_date || null,
        end_date: project.end_date || null,
        budget: project.budget || 0,
        raised: project.raised || 0,
        coordinator: project.coordinator || "",
        team_members: project.team_members || [],
        goals: project.goals || []
      };
      
      const newProject = await projectService.createProject(supabaseProject);
      if (newProject) {
        setProjects(prev => [newProject, ...prev]);
        setTotalProjects(prev => prev + 1);
        if (newProject.status === 'active') {
          setActiveProjects(prev => prev + 1);
        }
        toast.success("Project created successfully!");
      } else {
        throw new Error("Failed to create project");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to create project. Please try again.");
    }
  };

  const updateProject = async (id: number, updatedProject: Partial<Omit<Project, "id" | "created_at" | "updated_at">>) => {
    try {
      // Transform data for Supabase
      const supabaseProjectUpdate: any = {};
      
      // Only include fields that are provided in the update
      if (updatedProject.title !== undefined) supabaseProjectUpdate.title = updatedProject.title;
      if (updatedProject.description !== undefined) supabaseProjectUpdate.description = updatedProject.description;
      if (updatedProject.short_description !== undefined) supabaseProjectUpdate.short_description = updatedProject.short_description;
      if (updatedProject.status !== undefined) supabaseProjectUpdate.status = updatedProject.status;
      if (updatedProject.category !== undefined) supabaseProjectUpdate.category = updatedProject.category;
      if (updatedProject.image !== undefined) supabaseProjectUpdate.image = updatedProject.image;
      if (updatedProject.featured !== undefined) supabaseProjectUpdate.featured = updatedProject.featured;
      if (updatedProject.progress !== undefined) supabaseProjectUpdate.progress = updatedProject.progress;
      if (updatedProject.location !== undefined) supabaseProjectUpdate.location = updatedProject.location;
      if (updatedProject.start_date !== undefined) supabaseProjectUpdate.start_date = updatedProject.start_date;
      if (updatedProject.end_date !== undefined) supabaseProjectUpdate.end_date = updatedProject.end_date;
      if (updatedProject.budget !== undefined) supabaseProjectUpdate.budget = updatedProject.budget;
      if (updatedProject.raised !== undefined) supabaseProjectUpdate.raised = updatedProject.raised;
      if (updatedProject.coordinator !== undefined) supabaseProjectUpdate.coordinator = updatedProject.coordinator;
      if (updatedProject.team_members !== undefined) supabaseProjectUpdate.team_members = updatedProject.team_members;
      if (updatedProject.goals !== undefined) supabaseProjectUpdate.goals = updatedProject.goals;
      
      const updated = await projectService.updateProject(id, supabaseProjectUpdate);
      if (updated) {
        setProjects(prev => {
          const oldProject = prev.find(p => p.id === id);
          const newProjects = prev.map(p => p.id === id ? updated : p);
          
          // Update active projects count if status changed
          if (oldProject && 'status' in updatedProject && oldProject.status !== updatedProject.status) {
            if (oldProject.status === 'active' && updatedProject.status !== 'active') {
              setActiveProjects(prev => prev - 1);
            } else if (oldProject.status !== 'active' && updatedProject.status === 'active') {
              setActiveProjects(prev => prev + 1);
            }
          }
          
          return newProjects;
        });
        toast.success("Project updated successfully!");
      } else {
        throw new Error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project. Please try again.");
    }
  };

  const deleteProject = async (id: number) => {
    try {
      const success = await projectService.deleteProject(id);
      if (success) {
        setProjects(prev => {
          const projectToDelete = prev.find(p => p.id === id);
          if (projectToDelete && projectToDelete.status === 'active') {
            setActiveProjects(prevCount => prevCount - 1);
          }
          return prev.filter(p => p.id !== id);
        });
        setTotalProjects(prev => prev - 1);
        toast.success("Project deleted successfully!");
      } else {
        throw new Error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project. Please try again.");
    }
  };

  // Volunteer functions (Supabase)
  const addVolunteer = async (volunteer: Omit<Volunteer, "id" | "status" | "created_at">) => {
    try {
      const newVolunteer = await volunteerService.submitVolunteerApplication(volunteer);
      if (newVolunteer) {
        setVolunteers(prev => [newVolunteer, ...prev]);
        setTotalVolunteers(prev => prev + 1);
        setPendingVolunteers(prev => prev + 1);
        toast.success("Volunteer application submitted successfully!");
      } else {
        throw new Error("Failed to submit volunteer application");
      }
    } catch (error) {
      console.error("Error adding volunteer:", error);
      toast.error("Failed to submit volunteer application. Please try again.");
    }
  };

  const updateVolunteer = async (id: number, updatedVolunteer: Partial<Volunteer>) => {
    try {
      // This is a simplified update that doesn't handle status changes
      // Status changes should use updateVolunteerStatus instead
      if ('status' in updatedVolunteer) {
        throw new Error("Use updateVolunteerStatus to change volunteer status");
      }
      
      const volunteer = await getVolunteerById(id);
      if (!volunteer) {
        throw new Error("Volunteer not found");
      }
      
      const updated = await volunteerService.updateVolunteerStatus(id, volunteer.status);
      if (updated) {
        setVolunteers(prev => prev.map(v => v.id === id ? { ...v, ...updatedVolunteer } : v));
        toast.success("Volunteer information updated successfully!");
      } else {
        throw new Error("Failed to update volunteer information");
      }
    } catch (error) {
      console.error("Error updating volunteer:", error);
      toast.error("Failed to update volunteer information. Please try again.");
    }
  };

  const updateVolunteerStatus = async (id: number, status: "pending" | "approved" | "rejected") => {
    try {
      const volunteer = await getVolunteerById(id);
      if (!volunteer) {
        throw new Error("Volunteer not found");
      }
      
      const oldStatus = volunteer.status;
      const updated = await volunteerService.updateVolunteerStatus(id, status);
      
      if (updated) {
        setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status } : v));
        
        // Update pending count
        if (oldStatus === 'pending' && status !== 'pending') {
          setPendingVolunteers(prev => prev - 1);
        } else if (oldStatus !== 'pending' && status === 'pending') {
          setPendingVolunteers(prev => prev + 1);
        }
        
        toast.success(`Volunteer application ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'} successfully!`);
      } else {
        throw new Error("Failed to update volunteer status");
      }
    } catch (error) {
      console.error("Error updating volunteer status:", error);
      toast.error("Failed to update volunteer status. Please try again.");
    }
  };

  const deleteVolunteer = async (id: number) => {
    try {
      const volunteer = await getVolunteerById(id);
      if (!volunteer) {
        throw new Error("Volunteer not found");
      }
      
      const success = await volunteerService.deleteVolunteer(id);
      if (success) {
        setVolunteers(prev => prev.filter(v => v.id !== id));
        setTotalVolunteers(prev => prev - 1);
        
        if (volunteer.status === 'pending') {
          setPendingVolunteers(prev => prev - 1);
        }
        
        toast.success("Volunteer application deleted successfully!");
      } else {
        throw new Error("Failed to delete volunteer application");
      }
    } catch (error) {
      console.error("Error deleting volunteer:", error);
      toast.error("Failed to delete volunteer application. Please try again.");
    }
  };

  // Helper function to get volunteer by ID
  const getVolunteerById = async (id: number): Promise<Volunteer | null> => {
    return await volunteerService.getVolunteerById(id);
  };

  // Dashboard stats
  const getDashboardStats = () => {
    return {
      totalBlogPosts,
      totalProjects,
      totalVolunteers,
      pendingVolunteers,
      activeProjects
    };
  };

  return (
    <AdminContext.Provider
      value={{
        // Blogs
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        
        // Projects
        projects,
        addProject,
        updateProject,
        deleteProject,
        
        // Volunteers
        volunteers,
        addVolunteer,
        updateVolunteer,
        updateVolunteerStatus,
        deleteVolunteer,
        
        // Stats
        getDashboardStats,
        totalBlogPosts,
        totalProjects,
        totalVolunteers,
        pendingVolunteers,
        activeProjects
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
