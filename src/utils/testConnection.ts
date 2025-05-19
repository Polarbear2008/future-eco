import { supabase } from '@/lib/supabase';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Test connection to both Firebase and Supabase
 * Run this in the browser console to verify your connections
 */
export async function testConnection() {
  console.log('Testing connections...');
  
  try {
    // Test Supabase connection
    console.log('Testing Supabase connection...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('count');
    
    if (projectsError) {
      throw new Error(`Supabase error: ${projectsError.message}`);
    }
    
    console.log('✅ Supabase connection successful!');
    
    // Test Firebase connection
    console.log('Testing Firebase connection...');
    const blogsRef = collection(db, 'blogs');
    const blogsSnapshot = await getDocs(blogsRef);
    const blogCount = blogsSnapshot.size;
    
    console.log('✅ Firebase connection successful!');
    
    return {
      success: true,
      supabase: {
        connected: true,
        projectCount: projects[0]?.count || 0
      },
      firebase: {
        connected: true,
        blogCount
      }
    };
  } catch (error) {
    console.error('Connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Make the function available in the browser console
if (typeof window !== 'undefined') {
  (window as any).testConnection = testConnection;
}
