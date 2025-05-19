import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Blog } from "@/lib/firebase";
import { Project } from "@/lib/supabase";
import * as blogService from "@/services/blogService";
import * as projectService from "@/services/projectService";

interface PublicContextType {
  // Blog posts (Firebase)
  blogPosts: Blog[];
  featuredBlogPosts: Blog[];
  getBlogPostById: (id: string) => Blog | undefined;
  
  // Projects (Supabase)
  projects: Project[];
  featuredProjects: Project[];
  activeProjects: Project[];
  getProjectById: (id: number) => Project | undefined;
  
  // Stats
  stats: {
    totalProjects: number;
    totalBlogPosts: number;
    activeProjects: number;
  };
}

const PublicContext = createContext<PublicContextType | undefined>(undefined);

export const PublicProvider = ({ children }: { children: ReactNode }) => {
  // State for public data (Firebase)
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [featuredBlogPosts, setFeaturedBlogPosts] = useState<Blog[]>([]);
  
  // State for projects (Supabase)
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  
  // Stats
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalBlogPosts: 0,
    activeProjects: 0
  });

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  // Load all data from Firebase and Supabase
  const loadAllData = async () => {
    try {
      // Load blogs from Firebase
      const blogs = await blogService.getAllBlogs();
      setBlogPosts(blogs);
      setFeaturedBlogPosts(blogs.filter(blog => blog.featured));
      
      // Load projects from Supabase
      const projectsData = await projectService.getAllProjects();
      setProjects(projectsData);
      
      // Set featured projects
      const featured = await projectService.getFeaturedProjects();
      setFeaturedProjects(featured);
      
      // Set active projects
      const active = await projectService.getProjectsByStatus('active');
      setActiveProjects(active);
      
      // Update stats
      setStats({
        totalProjects: projectsData.length,
        totalBlogPosts: blogs.length,
        activeProjects: active.length
      });
      
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Get blog post by ID
  const getBlogPostById = (id: string): Blog | undefined => {
    return blogPosts.find(post => post.id === id);
  };

  // Get project by ID
  const getProjectById = (id: number): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  return (
    <PublicContext.Provider
      value={{
        // Blogs
        blogPosts,
        featuredBlogPosts,
        getBlogPostById,
        
        // Projects
        projects,
        featuredProjects,
        activeProjects,
        getProjectById,
        
        // Stats
        stats
      }}
    >
      {children}
    </PublicContext.Provider>
  );
};

export const usePublic = () => {
  const context = useContext(PublicContext);
  if (context === undefined) {
    throw new Error("usePublic must be used within a PublicProvider");
  }
  return context;
};
