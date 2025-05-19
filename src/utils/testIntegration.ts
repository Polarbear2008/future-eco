import * as blogService from '@/services/blogService';
import * as projectService from '@/services/projectService';
import * as volunteerService from '@/services/volunteerService';

/**
 * This utility function tests the integration with Firebase and Supabase
 * It can be run from the browser console or as a script
 */
export async function testIntegration() {
  console.log('Testing Firebase and Supabase integration...');
  
  try {
    // Test Firebase Blog Service
    console.log('Testing Firebase Blog Service...');
    const blogs = await blogService.getAllBlogs();
    console.log(`Successfully retrieved ${blogs.length} blogs from Firebase`);
    
    // Test Supabase Project Service
    console.log('Testing Supabase Project Service...');
    const projects = await projectService.getAllProjects();
    console.log(`Successfully retrieved ${projects.length} projects from Supabase`);
    
    // Test Supabase Volunteer Service
    console.log('Testing Supabase Volunteer Service...');
    const volunteers = await volunteerService.getAllVolunteers();
    console.log(`Successfully retrieved ${volunteers.length} volunteer applications from Supabase`);
    
    console.log('Integration test completed successfully!');
    return {
      success: true,
      blogs,
      projects,
      volunteers
    };
  } catch (error) {
    console.error('Integration test failed:', error);
    return {
      success: false,
      error
    };
  }
}

// Expose the test function to the window object for browser console access
if (typeof window !== 'undefined') {
  (window as any).testIntegration = testIntegration;
}
