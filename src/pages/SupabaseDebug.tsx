import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { createProject, getAllProjects, deleteProject } from '../services/projectService';
import { Project } from '../lib/supabase';

const SupabaseDebug = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>({});
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<'signed-out' | 'signed-in' | 'checking'>('checking');
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Create a Supabase client for testing
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Check authentication status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (session && user) {
          setAuthStatus('signed-in');
          setUser(user);
        } else {
          setAuthStatus('signed-out');
        }
      } catch (err) {
        console.error("Error checking auth:", err);
        setAuthStatus('signed-out');
      }
    };
    
    checkAuth();
  }, []);
  
  // Sign in with email and password
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        setAuthStatus('signed-in');
        setUser(data.user);
        setResults({ signIn: true, user: data.user });
        setRawResponse(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError(`Sign in failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out
  const handleSignOut = async () => {
    setLoading(true);
    
    try {
      await supabase.auth.signOut();
      setAuthStatus('signed-out');
      setUser(null);
      setResults({ signOut: true });
    } catch (err) {
      console.error("Sign out error:", err);
      setError(`Sign out failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Test basic connection
  const testBasicConnection = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);
    
    try {
      console.log("Testing basic Supabase connection...");
      
      // Simple REST API call to check connection
      const response = await fetch(`${supabaseUrl}/rest/v1/projects?select=id&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);
      
      if (!response.ok) {
        setError(`Connection failed: ${response.status} ${response.statusText}`);
        setResults({ connectionTest: false });
      } else {
        try {
          const data = JSON.parse(responseText);
          setResults({ connectionTest: true, data });
          setRawResponse(JSON.stringify(data, null, 2));
        } catch (e) {
          setError(`Failed to parse response as JSON: ${responseText}`);
          setResults({ connectionTest: false });
        }
      }
    } catch (err) {
      console.error("Error testing connection:", err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      setResults({ connectionTest: false });
    } finally {
      setLoading(false);
    }
  };
  
  // Test table existence
  const testTableExistence = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);
    
    try {
      console.log("Testing if projects table exists...");
      
      // Using RPC to check if table exists
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/check_table_exists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ table_name: 'projects' })
      });
      
      if (!response.ok) {
        // If RPC fails, try a direct query
        const fallbackResponse = await fetch(`${supabaseUrl}/rest/v1/projects?limit=0`, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        if (fallbackResponse.ok) {
          setResults({ tableExists: true });
          setRawResponse("Table exists (fallback check)");
        } else {
          setError(`Table check failed: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
          setResults({ tableExists: false });
        }
      } else {
        const data = await response.json();
        setResults({ tableExists: data });
        setRawResponse(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error("Error checking table:", err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      setResults({ tableExists: false });
    } finally {
      setLoading(false);
    }
  };
  
  // Test creating a project
  const testCreateProject = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);
    
    try {
      console.log("Testing project creation...");
      
      const testProject = {
        title: "Test Project " + new Date().toISOString(),
        description: "This is a test project created for debugging",
        short_description: "Test project for debugging",
        category: "Environmental",
        status: "planning" as "planning" | "active" | "completed",
        featured: false,
        progress: 0,
        team_members: [],
        goals: []
      };
      
      // Try creating with Supabase client first if authenticated
      if (authStatus === 'signed-in') {
        console.log("Creating project with authenticated Supabase client");
        const { data, error } = await supabase
          .from('projects')
          .insert(testProject)
          .select();
          
        if (error) {
          console.error("Error creating project with Supabase client:", error);
          throw new Error(`Supabase client error: ${error.message}`);
        }
        
        if (data && data.length > 0) {
          setResults({ projectCreated: true, project: data[0], method: 'supabase-client' });
          setRawResponse(JSON.stringify(data, null, 2));
          return;
        }
      }
      
      // Fall back to REST API
      console.log("Creating project with REST API");
      const result = await createProject(testProject);
      
      if (result) {
        setResults({ projectCreated: true, project: result, method: 'rest-api' });
        setRawResponse(JSON.stringify(result, null, 2));
      } else {
        setError("Failed to create project");
        setResults({ projectCreated: false });
      }
    } catch (err) {
      console.error("Error creating project:", err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      setResults({ projectCreated: false });
    } finally {
      setLoading(false);
    }
  };
  
  // Test getting all projects
  const testGetProjects = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);
    
    try {
      console.log("Testing getting all projects...");
      
      const projects = await getAllProjects();
      
      if (projects && projects.length >= 0) {
        setResults({ projectsRetrieved: true, count: projects.length });
        setRawResponse(JSON.stringify(projects, null, 2));
      } else {
        setError("Failed to retrieve projects");
        setResults({ projectsRetrieved: false });
      }
    } catch (err) {
      console.error("Error getting projects:", err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      setResults({ projectsRetrieved: false });
    } finally {
      setLoading(false);
    }
  };
  
  // Display environment variables (first 10 chars of keys)
  const supabaseUrlDisplay = supabaseUrl || "Not set";
  const supabaseKeyDisplay = supabaseKey ? `${supabaseKey.substring(0, 10)}...` : "Not set";
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Debug Page</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
        <p><strong>Supabase URL:</strong> {supabaseUrlDisplay}</p>
        <p><strong>Anon Key (first 10 chars):</strong> {supabaseKeyDisplay}</p>
      </div>
      
      <div className="bg-blue-100 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
        {authStatus === 'checking' ? (
          <p>Checking authentication status...</p>
        ) : authStatus === 'signed-in' ? (
          <div>
            <p className="text-green-700 font-bold">Signed in as: {user?.email}</p>
            <button 
              onClick={handleSignOut}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded mt-2 disabled:opacity-50"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <p className="text-red-700 font-bold">Not signed in</p>
            <form onSubmit={handleSignIn} className="mt-2">
              <div className="mb-2">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded disabled:opacity-50"
              >
                Sign In
              </button>
            </form>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <button 
          onClick={testBasicConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Test Basic Connection
        </button>
        
        <button 
          onClick={testTableExistence}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Test Projects Table Existence
        </button>
        
        <button 
          onClick={testCreateProject}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Test Create Project
        </button>
        
        <button 
          onClick={testGetProjects}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Test Get All Projects
        </button>
      </div>
      
      {loading && (
        <div className="text-center p-4">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {Object.keys(results).length > 0 && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Results</p>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
      
      {rawResponse && (
        <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-96">
          <h3 className="text-lg font-semibold mb-2">Raw Response</h3>
          <pre className="text-sm">{rawResponse}</pre>
        </div>
      )}
    </div>
  );
};

export default SupabaseDebug;
