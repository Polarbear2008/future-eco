import { supabase } from '@/lib/supabase';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { createProject } from '@/services/projectService';
import { createBlog } from '@/services/blogService';

/**
 * Utility to troubleshoot Firebase and Supabase connections and operations
 */
export async function troubleshoot() {
  const results = {
    supabase: {
      connection: false,
      tables: [],
      createProject: false,
      error: null as string | null
    },
    firebase: {
      connection: false,
      collections: [],
      createBlog: false,
      error: null as string | null
    }
  };

  // Test Supabase connection and tables
  try {
    console.log('Testing Supabase connection...');
    const { data: tables, error } = await supabase.from('projects').select('count');
    
    if (error) {
      results.supabase.error = `Connection error: ${error.message}`;
      console.error('Supabase connection error:', error);
    } else {
      results.supabase.connection = true;
      console.log('✅ Supabase connection successful!');
      
      // Check tables
      const { data: tableList } = await supabase.rpc('list_tables');
      results.supabase.tables = tableList || [];
      console.log('Supabase tables:', tableList);
      
      // Try to create a test project
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
          results.supabase.createProject = true;
          console.log('✅ Successfully created test project in Supabase!');
        } else {
          results.supabase.error = 'Failed to create project, but no error was thrown';
        }
      } catch (projectError) {
        results.supabase.error = `Create project error: ${projectError instanceof Error ? projectError.message : String(projectError)}`;
        console.error('Error creating test project:', projectError);
      }
    }
  } catch (supabaseError) {
    results.supabase.error = `Unexpected error: ${supabaseError instanceof Error ? supabaseError.message : String(supabaseError)}`;
    console.error('Supabase unexpected error:', supabaseError);
  }
  
  // Test Firebase connection and collections
  try {
    console.log('Testing Firebase connection...');
    const blogsRef = collection(db, 'blogs');
    const blogsSnapshot = await getDocs(blogsRef);
    
    results.firebase.connection = true;
    results.firebase.collections = ['blogs'];
    console.log('✅ Firebase connection successful!');
    console.log('Firebase blogs collection has', blogsSnapshot.size, 'documents');
    
    // Try to create a test blog
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
        results.firebase.createBlog = true;
        console.log('✅ Successfully created test blog in Firebase!');
      } else {
        results.firebase.error = 'Failed to create blog, but no error was thrown';
      }
    } catch (blogError) {
      results.firebase.error = `Create blog error: ${blogError instanceof Error ? blogError.message : String(blogError)}`;
      console.error('Error creating test blog:', blogError);
    }
  } catch (firebaseError) {
    results.firebase.error = `Unexpected error: ${firebaseError instanceof Error ? firebaseError.message : String(firebaseError)}`;
    console.error('Firebase unexpected error:', firebaseError);
  }
  
  return results;
}

/**
 * Test volunteer application submission
 */
export async function testVolunteerSubmission() {
  try {
    console.log('Testing volunteer submission...');
    
    // First, check available tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error checking tables:', tablesError);
      return { success: false, error: tablesError };
    }
    
    console.log('Available tables:', tables);
    
    // Try to create a test volunteer application
    const testVolunteer = {
      name: 'Test Volunteer',
      email: 'test@example.com',
      phone: '123-456-7890',
      skills: ['Testing', 'Debugging'],
      availability: 'Weekends',
      experience: 'Testing volunteer applications',
      project_interest: 'Fixing bugs'
    };
    
    const { data, error } = await supabase
      .from('volunteers')
      .insert([{
        ...testVolunteer,
        status: 'pending'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error submitting test volunteer:', error);
      return { success: false, error };
    }
    
    console.log('Test volunteer submitted successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in test volunteer submission:', error);
    return { success: false, error };
  }
}

// Make the functions available in the browser console
if (typeof window !== 'undefined') {
  (window as any).troubleshoot = troubleshoot;
  (window as any).testVolunteerSubmission = testVolunteerSubmission;
}
