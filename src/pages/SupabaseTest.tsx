import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SupabaseTest() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('test@example.com');
  const [name, setName] = useState('Test User');

  async function testDirectApi() {
    setLoading(true);
    setError(null);
    try {
      const supabaseUrl = 'https://neqrddvormzwbeezezxq.supabase.co';
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // First, check available tables
      const tablesResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      if (!tablesResponse.ok) {
        throw new Error(`Error fetching tables: ${tablesResponse.statusText}`);
      }
      
      const tables = await tablesResponse.json();
      console.log('Available tables:', tables);
      
      // Try to submit a volunteer application
      const volunteerData = {
        name: name,
        email: email,
        phone: '123-456-7890',
        status: 'pending'
      };
      
      const response = await fetch(`${supabaseUrl}/rest/v1/volunteers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(volunteerData)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${JSON.stringify(responseData)}`);
      }
      
      setResult({
        tables,
        submission: responseData
      });
    } catch (err: any) {
      setError(err.message || String(err));
      console.error('Test error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Supabase Direct API Test</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <Button onClick={testDirectApi} disabled={loading}>
          {loading ? 'Testing...' : 'Test Direct API Submission'}
        </Button>
      </div>
      
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
