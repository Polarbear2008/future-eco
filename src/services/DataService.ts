import { BlogPost, Project, Volunteer } from "../contexts/AdminContext";

// Storage keys
const STORAGE_KEYS = {
  BLOG_POSTS: "ecofuture_blogPosts",
  PROJECTS: "ecofuture_projects",
  VOLUNTEERS: "ecofuture_volunteers"
};

// Event system for real-time updates
type DataChangeListener = (data: any) => void;
const listeners: Record<string, DataChangeListener[]> = {
  [STORAGE_KEYS.BLOG_POSTS]: [],
  [STORAGE_KEYS.PROJECTS]: [],
  [STORAGE_KEYS.VOLUNTEERS]: []
};

// Add a listener for data changes
export const subscribeToDataChanges = (key: string, listener: DataChangeListener) => {
  if (!listeners[key]) {
    listeners[key] = [];
  }
  listeners[key].push(listener);

  // Return unsubscribe function
  return () => {
    listeners[key] = listeners[key].filter(l => l !== listener);
  };
};

// Notify all listeners of data changes
const notifyListeners = (key: string, data: any) => {
  if (listeners[key]) {
    listeners[key].forEach(listener => listener(data));
  }
};

// Storage utility functions
export const saveToStorage = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyListeners(key, data);
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
};

export const loadFromStorage = <T,>(key: string, defaultData: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultData;
  } catch (error) {
    console.error(`Error loading from localStorage: ${error}`);
    return defaultData;
  }
};

// Blog Posts
export const getBlogPosts = (): BlogPost[] => {
  return loadFromStorage<BlogPost[]>(STORAGE_KEYS.BLOG_POSTS, []);
};

export const getBlogPostById = (id: number): BlogPost | undefined => {
  const posts = getBlogPosts();
  return posts.find(post => post.id === id);
};

export const getFeaturedBlogPosts = (): BlogPost[] => {
  const posts = getBlogPosts();
  return posts.filter(post => post.featured);
};

// Projects
export const getProjects = (): Project[] => {
  return loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
};

export const getProjectById = (id: number): Project | undefined => {
  const projects = getProjects();
  return projects.find(project => project.id === id);
};

export const getFeaturedProjects = (): Project[] => {
  const projects = getProjects();
  return projects.filter(project => project.featured);
};

export const getActiveProjects = (): Project[] => {
  const projects = getProjects();
  return projects.filter(project => project.status === "active");
};

// Volunteers
export const getVolunteers = (): Volunteer[] => {
  return loadFromStorage<Volunteer[]>(STORAGE_KEYS.VOLUNTEERS, []);
};

export const getVolunteerById = (id: number): Volunteer | undefined => {
  const volunteers = getVolunteers();
  return volunteers.find(volunteer => volunteer.id === id);
};

export const getPendingVolunteers = (): Volunteer[] => {
  const volunteers = getVolunteers();
  return volunteers.filter(volunteer => volunteer.status === "pending");
};

// Stats
export const getDashboardStats = () => {
  const blogPosts = getBlogPosts();
  const projects = getProjects();
  const volunteers = getVolunteers();
  
  return {
    totalBlogPosts: blogPosts.length,
    totalProjects: projects.length,
    totalVolunteers: volunteers.length,
    pendingVolunteers: volunteers.filter(v => v.status === "pending").length,
    activeProjects: projects.filter(p => p.status === "active").length,
  };
};
