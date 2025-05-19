import React, { useState, useEffect } from 'react';
import { createProject, getAllProjects, deleteProject } from '../services/projectService';
import { Project } from '../lib/supabase';

export default function TestProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_description: "",
    category: "Environmental",
    status: "planning" as "planning" | "active" | "completed",
    featured: false,
    progress: 0,
    team_members: [],
    goals: []
  });

  // Load projects on initial render
  useEffect(() => {
    fetchProjects();
    checkTableExists();
  }, []);

  // Check if the projects table exists
  const checkTableExists = async () => {
    try {
      console.log("Checking if projects table exists...");
      // Simple fetch to check if the table exists
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects?limit=1`, {
        method: 'GET',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });
      
      setTableExists(response.ok);
      console.log("Table exists check result:", response.ok);
    } catch (error) {
      console.error("Error checking table existence:", error);
      setTableExists(false);
    }
  };

  // Fetch all projects
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const projects = await getAllProjects();
      if (projects) {
        setProjects(projects);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("Creating project with data:", formData);
      const newProject = await createProject(formData);
      
      if (newProject) {
        console.log("Project created successfully:", newProject);
        setProjects([newProject, ...projects]);
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          short_description: "",
          category: "Environmental",
          status: "planning" as "planning" | "active" | "completed",
          featured: false,
          progress: 0,
          team_members: [],
          goals: []
        });
      } else {
        throw new Error("Failed to create project");
      }
    } catch (err) {
      console.error("Error creating project:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle project deletion
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setLoading(true);
      setError(null);
      
      try {
        const success = await deleteProject(id);
        
        if (success) {
          setProjects(projects.filter(project => project.id !== id));
        } else {
          throw new Error("Failed to delete project");
        }
      } catch (err) {
        console.error("Error deleting project:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Projects Page</h1>
      
      {/* Table existence status */}
      <div className={`p-4 mb-4 rounded ${tableExists ? 'bg-green-100' : 'bg-red-100'}`}>
        <h2 className="text-lg font-semibold">Projects Table Status</h2>
        {tableExists === null ? (
          <p>Checking table existence...</p>
        ) : tableExists ? (
          <p className="text-green-700">✅ Projects table exists and is accessible</p>
        ) : (
          <p className="text-red-700">❌ Projects table does not exist or is not accessible</p>
        )}
      </div>
      
      {/* Create Project Form */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Progress (%)</label>
              <input
                type="number"
                name="progress"
                value={formData.progress}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                min="0"
                max="100"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-1">Short Description</label>
              <input
                type="text"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-1">Full Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                rows={4}
                required
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Featured Project
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Projects List */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Projects List ({projects.length})</h2>
        <button
          onClick={fetchProjects}
          disabled={loading}
          className="mb-4 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded disabled:opacity-50"
        >
          Refresh List
        </button>
        
        {loading && <p>Loading...</p>}
        
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project.id} className="border p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-600">ID: {project.id}</p>
                  <p className="text-sm text-gray-600">Status: {project.status}</p>
                  <p className="text-sm text-gray-600">Category: {project.category}</p>
                  <p className="mt-2">{project.short_description}</p>
                </div>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          {projects.length === 0 && !loading && (
            <p className="text-gray-600">No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
