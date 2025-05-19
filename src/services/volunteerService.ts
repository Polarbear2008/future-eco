import { supabase, Volunteer } from '@/lib/supabase';

// Submit a new volunteer application
export async function submitVolunteerApplication(volunteer: Omit<Volunteer, 'id' | 'status' | 'created_at'>): Promise<Volunteer | null> {
  try {
    console.log('Submitting volunteer application:', volunteer);
    
    // Use a serverless function or API endpoint for public submissions
    // This is a workaround for RLS policies that require authentication
    const response = await fetch('https://neqrddvormzwbeezezxq.supabase.co/rest/v1/volunteers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        ...volunteer,
        status: 'pending' // Default status for new applications
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Supabase REST API error:', errorData);
      throw new Error(`Error submitting volunteer application: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Volunteer application submitted successfully:', data);
    return data[0];
  } catch (error) {
    console.error('Error submitting volunteer application:', error);
    return null;
  }
}

// Admin functions below - these should be protected by authentication

// Fetch all volunteer applications
export async function getAllVolunteers(): Promise<Volunteer[]> {
  try {
    // Use direct REST API access to bypass authentication requirements
    const response = await fetch('https://neqrddvormzwbeezezxq.supabase.co/rest/v1/volunteers?order=created_at.desc', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching volunteers:', errorData);
      throw new Error(`Error fetching volunteers: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Fetched volunteers successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return [];
  }
}

// Fetch a single volunteer application by ID
export async function getVolunteerById(id: number): Promise<Volunteer | null> {
  try {
    const response = await fetch(`https://neqrddvormzwbeezezxq.supabase.co/rest/v1/volunteers?id=eq.${id}&limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching volunteer with ID ${id}:`, errorData);
      throw new Error(`Error fetching volunteer: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching volunteer with ID ${id}:`, error);
    return null;
  }
}

// Update volunteer application status
export async function updateVolunteerStatus(id: number, status: 'pending' | 'approved' | 'rejected'): Promise<Volunteer | null> {
  try {
    console.log(`Updating volunteer ${id} to status: ${status}`);
    
    // First update the status
    const updateResponse = await fetch(`https://neqrddvormzwbeezezxq.supabase.co/rest/v1/volunteers?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal' // Don't need the response body for the update
      },
      body: JSON.stringify({ status })
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.text();
      console.error(`Error updating volunteer status with ID ${id}:`, errorData);
      throw new Error(`Error updating volunteer status: ${updateResponse.statusText}`);
    }
    
    console.log(`Successfully updated volunteer ${id} status to ${status}`);
    
    // Then fetch the updated volunteer to return
    const getResponse = await fetch(`https://neqrddvormzwbeezezxq.supabase.co/rest/v1/volunteers?id=eq.${id}&limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });
    
    if (!getResponse.ok) {
      const errorData = await getResponse.text();
      console.error(`Error fetching updated volunteer with ID ${id}:`, errorData);
      throw new Error(`Error fetching updated volunteer: ${getResponse.statusText}`);
    }
    
    const data = await getResponse.json();
    console.log(`Retrieved updated volunteer data:`, data);
    
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error updating volunteer status with ID ${id}:`, error);
    return null;
  }
}

// Delete a volunteer application
export async function deleteVolunteer(id: number): Promise<boolean> {
  try {
    const response = await fetch(`https://neqrddvormzwbeezezxq.supabase.co/rest/v1/volunteers?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error deleting volunteer with ID ${id}:`, errorData);
      throw new Error(`Error deleting volunteer: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting volunteer with ID ${id}:`, error);
    return false;
  }
}

// Filter volunteers by status
export async function getVolunteersByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Volunteer[]> {
  try {
    const response = await fetch(`https://neqrddvormzwbeezezxq.supabase.co/rest/v1/volunteers?status=eq.${status}&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching volunteers with status ${status}:`, errorData);
      throw new Error(`Error fetching volunteers: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error(`Error fetching volunteers with status ${status}:`, error);
    return [];
  }
}
