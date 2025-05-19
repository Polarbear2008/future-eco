import { supabase } from "@/lib/supabase";
import type { Project, ProjectUpdate } from "@/lib/supabase";

// Fetch all projects
export async function getAllProjects(): Promise<Project[]> {
  try {
    console.log('Fetching all projects via REST API');
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects?order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'x-admin-bypass-rls': 'true'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('REST API error fetching projects:', errorText);
      throw new Error(`Error fetching projects: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data?.length || 0} projects via REST API`);
    return data || [];
  } catch (error) {
    console.error('Error fetching projects via REST API:', error);
    return [];
  }
}

// Fetch a single project by ID
export async function getProjectById(id: number): Promise<Project | null> {
  try {
    console.log(`Fetching project with ID ${id} via REST API`);
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects?id=eq.${id}`, {
      method: 'GET',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'x-admin-bypass-rls': 'true'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`REST API error fetching project with ID ${id}:`, errorText);
      throw new Error(`Error fetching project: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched project with ID ${id} via REST API:`, data);
    return data[0] || null;
  } catch (error) {
    console.error(`Error fetching project with ID ${id} via REST API:`, error);
    return null;
  }
}

// Create a new project
export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
  try {
    console.log('Creating new project via REST API with data:', project);
    console.log('Using Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    
    // Log the request details for debugging
    const requestUrl = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects`;
    const requestHeaders = {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Prefer': 'return=representation',
      'x-admin-bypass-rls': 'true'
    };
    
    console.log('Request URL:', requestUrl);
    console.log('Request headers:', JSON.stringify(requestHeaders, null, 2));
    console.log('Request body:', JSON.stringify(project, null, 2));
    
    // Ensure all required fields are present
    const projectData = {
      ...project,
      // Set defaults for any missing fields
      team_members: project.team_members || [],
      goals: project.goals || [],
      updates: project.updates || [],
      progress: project.progress || 0,
      featured: typeof project.featured === 'boolean' ? project.featured : false
    };
    
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(projectData)
    });
    
    // Get the response text first so we can log it even if JSON parsing fails
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', responseText);
    
    if (!response.ok) {
      console.error('REST API error creating project. Status:', response.status);
      console.error('Response headers:', JSON.stringify(Object.fromEntries([...response.headers.entries()]), null, 2));
      console.error('Error details:', responseText);
      
      // Try to parse the error if it's JSON
      try {
        const errorJson = JSON.parse(responseText);
        console.error('Parsed error:', errorJson);
      } catch (e) {
        // Not JSON, that's fine
      }
      
      throw new Error(`Error creating project: ${response.statusText} (${response.status})`);
    }
    
    // Parse the response text as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Invalid JSON response from server');
    }
    
    console.log('Successfully created project via REST API:', data);
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error('Error creating project via REST API:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
}

// Update an existing project
export async function updateProject(id: number, updates: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>): Promise<Project | null> {
  try {
    console.log(`Updating project with ID ${id} via REST API with data:`, updates);
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation',
        'x-admin-bypass-rls': 'true'
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`REST API error updating project with ID ${id}:`, errorText);
      throw new Error(`Error updating project: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully updated project with ID ${id} via REST API:`, data);
    return data[0] || null;
  } catch (error) {
    console.error(`Error updating project with ID ${id} via REST API:`, error);
    return null;
  }
}

// Delete a project
export async function deleteProject(id: number): Promise<boolean> {
  try {
    console.log(`Deleting project with ID ${id} via REST API`);
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'x-admin-bypass-rls': 'true'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`REST API error deleting project with ID ${id}:`, errorText);
      throw new Error(`Error deleting project: ${response.statusText}`);
    }
    
    console.log(`Successfully deleted project with ID ${id} via REST API`);
    return true;
  } catch (error) {
    console.error(`Error deleting project with ID ${id} via REST API:`, error);
    return false;
  }
}

// Fetch featured projects
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    console.log('Fetching featured projects via REST API');
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects?featured=eq.true&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'x-admin-bypass-rls': 'true'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('REST API error fetching featured projects:', errorText);
      throw new Error(`Error fetching featured projects: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data?.length || 0} featured projects via REST API`);
    return data || [];
  } catch (error) {
    console.error('Error fetching featured projects via REST API:', error);
    return [];
  }
}

// Fetch projects by category
export async function getProjectsByCategory(category: string): Promise<Project[]> {
  try {
    console.log(`Fetching projects in category "${category}" via REST API`);
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects?category=eq.${encodeURIComponent(category)}&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'x-admin-bypass-rls': 'true'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`REST API error fetching projects in category "${category}":`, errorText);
      throw new Error(`Error fetching projects by category: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data?.length || 0} projects in category "${category}" via REST API`);
    return data || [];
  } catch (error) {
    console.error(`Error fetching projects in category "${category}" via REST API:`, error);
    return [];
  }
}

// Add an update to a project
export async function addProjectUpdate(projectId: number, update: Omit<ProjectUpdate, 'id' | 'date'>): Promise<Project | null> {
  try {
    console.log(`Adding update to project with ID ${projectId} via REST API`);
    
    // First, get the current project to access its updates
    const project = await getProjectById(projectId);
    if (!project) {
      console.error(`Project with ID ${projectId} not found`);
      return null;
    }
    
    // Create a new update with an ID and date
    const newUpdate: ProjectUpdate = {
      ...update,
      id: Date.now(), // Use timestamp as a unique ID
      date: new Date().toISOString()
    };
    
    // Add the new update to the existing updates array
    const updates = Array.isArray(project.updates) ? [...project.updates, newUpdate] : [newUpdate];
    
    // Update the project with the new updates array
    return updateProject(projectId, { updates });
  } catch (error) {
    console.error(`Error adding update to project with ID ${projectId}:`, error);
    return null;
  }
}

// Filter projects by status
export async function getProjectsByStatus(status: 'active' | 'planning' | 'completed'): Promise<Project[]> {
  try {
    console.log(`Fetching projects with status ${status} via REST API`);
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects?status=eq.${status}&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'x-admin-bypass-rls': 'true'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`REST API error fetching projects with status ${status}:`, errorText);
      throw new Error(`Error fetching projects by status: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data?.length || 0} projects with status ${status} via REST API`);
    return data || [];
  } catch (error) {
    console.error(`Error fetching projects with status ${status} via REST API:`, error);
    return [];
  }
}
