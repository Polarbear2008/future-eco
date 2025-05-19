import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function VolunteerTest() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<string[]>([]);

  async function checkTables() {
    setLoading(true);
    try {
      // Check available tables
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (error) throw error;
      
      const tableNames = data.map((t: any) => t.table_name);
      setTables(tableNames);
      console.log('Available tables:', tableNames);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  async function testDirectInsert() {
    setLoading(true);
    setError(null);
    try {
      // Simple test data
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '123-456-7890',
        status: 'pending'
      };
      
      // Try to insert directly to the volunteers table
      const { data, error } = await supabase
        .from('volunteers')
        .insert([testData])
        .select();
      
      if (error) throw error;
      
      setResult(data);
      console.log('Insert successful:', data);
    } catch (err: any) {
      setError(err.message || String(err));
      console.error('Insert error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function testVolunteerApplicationsInsert() {
    setLoading(true);
    setError(null);
    try {
      // Simple test data
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '123-456-7890',
        status: 'pending'
      };
      
      // Try to insert directly to the volunteer_applications table
      const { data, error } = await supabase
        .from('volunteer_applications')
        .insert([testData])
        .select();
      
      if (error) throw error;
      
      setResult(data);
      console.log('Insert successful:', data);
    } catch (err: any) {
      setError(err.message || String(err));
      console.error('Insert error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Volunteer Submission Test</h1>
      
      <div className="flex gap-4 mb-6">
        <Button onClick={checkTables} disabled={loading}>
          Check Available Tables
        </Button>
        <Button onClick={testDirectInsert} disabled={loading}>
          Test Insert to 'volunteers'
        </Button>
        <Button onClick={testVolunteerApplicationsInsert} disabled={loading}>
          Test Insert to 'volunteer_applications'
        </Button>
      </div>
      
      {tables.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Available Tables:</h2>
          <ul className="list-disc pl-6">
            {tables.map((table, index) => (
              <li key={index}>{table}</li>
            ))}
          </ul>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
