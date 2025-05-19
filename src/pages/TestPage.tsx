import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { createProject } from '@/services/projectService';
import { createBlog } from '@/services/blogService';

export default function TestPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function testSupabaseConnection() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('projects').select('count');
      
      if (error) {
        throw new Error(`Supabase connection error: ${error.message}`);
      }
      
      setResults(prev => ({ ...prev, supabaseConnection: 'Success' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setResults(prev => ({ ...prev, supabaseConnection: 'Failed' }));
    } finally {
      setLoading(false);
    }
  }

  async function testFirebaseConnection() {
    setLoading(true);
    setError(null);
    try {
      const blogsRef = collection(db, 'blogs');
      const blogsSnapshot = await getDocs(blogsRef);
      
      setResults(prev => ({ 
        ...prev, 
        firebaseConnection: 'Success',
        blogCount: blogsSnapshot.size
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setResults(prev => ({ ...prev, firebaseConnection: 'Failed' }));
    } finally {
      setLoading(false);
    }
  }

  async function testCreateProject() {
    setLoading(true);
    setError(null);
    try {
      const testProject = {
        title: 'Test Project',
        description: 'This is a test project created for troubleshooting',
        short_description: 'Test project',
        status: 'planning' as 'active' | 'planning' | 'completed',
        category: 'Test',
        progress: 0,
        featured: false
      };
      
      const newProject = await createProject(testProject);
      if (newProject) {
        setResults(prev => ({ ...prev, createProject: 'Success', projectData: newProject }));
      } else {
        throw new Error('Failed to create project, but no error was thrown');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setResults(prev => ({ ...prev, createProject: 'Failed' }));
    } finally {
      setLoading(false);
    }
  }

  async function testCreateBlog() {
    setLoading(true);
    setError(null);
    try {
      const testBlog = {
        title: 'Test Blog Post',
        excerpt: 'This is a test blog post created for troubleshooting',
        content: 'This is the content of the test blog post.',
        image: 'https://example.com/test-image.jpg',
        date: new Date().toISOString().split('T')[0],
        category: 'Test',
        author: {
          name: 'Test Author',
          image: 'https://example.com/author.jpg',
          role: 'Tester'
        },
        featured: false,
        tags: ['test', 'troubleshooting']
      };
      
      const newBlog = await createBlog(testBlog);
      if (newBlog) {
        setResults(prev => ({ ...prev, createBlog: 'Success', blogData: newBlog }));
      } else {
        throw new Error('Failed to create blog, but no error was thrown');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setResults(prev => ({ ...prev, createBlog: 'Failed' }));
    } finally {
      setLoading(false);
    }
  }

  async function testDirectSupabaseInsert() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title: 'Direct Insert Test',
            description: 'Testing direct insert to Supabase',
            short_description: 'Direct test',
            status: 'planning',
            category: 'Test',
            progress: 0,
            featured: false
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      setResults(prev => ({ ...prev, directSupabaseInsert: 'Success', directData: data }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setResults(prev => ({ ...prev, directSupabaseInsert: 'Failed' }));
    } finally {
      setLoading(false);
    }
  }

  async function testDirectFirebaseInsert() {
    setLoading(true);
    setError(null);
    try {
      const blogsRef = collection(db, 'blogs');
      const docRef = await addDoc(blogsRef, {
        title: 'Direct Firebase Test',
        excerpt: 'Testing direct insert to Firebase',
        content: 'This is a direct test.',
        image: 'https://example.com/test.jpg',
        date: new Date().toISOString().split('T')[0],
        category: 'Test',
        author: {
          name: 'Direct Test',
          image: 'https://example.com/author.jpg',
          role: 'Tester'
        },
        featured: false,
        tags: ['direct', 'test'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setResults(prev => ({ ...prev, directFirebaseInsert: 'Success', directFirebaseId: docRef.id }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setResults(prev => ({ ...prev, directFirebaseInsert: 'Failed' }));
    } finally {
      setLoading(false);
    }
  }

  async function testVolunteerSubmission() {
    setLoading(true);
    setError(null);
    try {
      // First, check if the volunteers table exists
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (tablesError) {
        throw new Error(`Error checking tables: ${tablesError.message}`);
      }
      
      // Log available tables
      console.log('Available tables:', tables);
      const tableNames = tables.map((t: any) => t.table_name);
      
      // Try to create a test volunteer application
      const testVolunteer = {
        name: 'Test Volunteer',
        email: 'test@example.com',
        phone: '123-456-7890',
        skills: ['Testing', 'Debugging'],
        availability: 'Weekends',
        experience: 'Testing volunteer applications',
        project_interest: 'Fixing bugs',
        status: 'pending'
      };
      
      const { data, error } = await supabase
        .from('volunteers')
        .insert([testVolunteer])
        .select()
        .single();
      
      if (error) {
        throw new Error(`Error submitting volunteer: ${error.message}`);
      }
      
      setResults(prev => ({ 
        ...prev, 
        volunteerSubmission: 'Success',
        volunteerData: data,
        availableTables: tableNames
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setResults(prev => ({ ...prev, volunteerSubmission: 'Failed' }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Firebase & Supabase Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Supabase Tests</h2>
          <div className="space-y-4">
            <button 
              onClick={testSupabaseConnection}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Test Supabase Connection
            </button>
            
            <button 
              onClick={testCreateProject}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Test Create Project
            </button>
            
            <button 
              onClick={testDirectSupabaseInsert}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
            >
              Test Direct Supabase Insert
            </button>
            
            <button 
              onClick={testVolunteerSubmission}
              disabled={loading}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
            >
              Test Volunteer Submission
            </button>
          </div>
        </div>
        
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Firebase Tests</h2>
          <div className="space-y-4">
            <button 
              onClick={testFirebaseConnection}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Test Firebase Connection
            </button>
            
            <button 
              onClick={testCreateBlog}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Test Create Blog
            </button>
            
            <button 
              onClick={testDirectFirebaseInsert}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
            >
              Test Direct Firebase Insert
            </button>
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="text-center p-4">
          <p className="text-blue-500 font-semibold">Loading...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {results && (
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
