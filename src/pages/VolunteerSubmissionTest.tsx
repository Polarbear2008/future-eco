import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitVolunteerApplication, getAllVolunteers } from '@/services/volunteerService';
import { Volunteer } from '@/lib/supabase';

export default function VolunteerSubmissionTest() {
  const [formData, setFormData] = useState({
    name: 'Test Volunteer',
    email: 'test@example.com',
    phone: '123-456-7890',
    skills: ['Web Development', 'Marketing'],
    availability: 'Weekends',
    experience: 'I have experience with environmental projects',
    project_interest: 'I am interested in conservation projects'
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = async () => {
    setLoading(true);
    try {
      const data = await getAllVolunteers();
      console.log('Loaded volunteers:', data);
      setVolunteers(data);
      setError(null);
    } catch (err: any) {
      console.error('Error loading volunteers:', err);
      setError(err.message || 'Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await submitVolunteerApplication(formData);
      setResult(result);
      console.log('Submission result:', result);
      
      // Reload volunteers after submission
      await loadVolunteers();
    } catch (err: any) {
      console.error('Error submitting volunteer:', err);
      setError(err.message || 'Failed to submit volunteer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Volunteer Submission Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Test Volunteer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <Button 
                onClick={handleSubmit} 
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Test Volunteer'}
              </Button>
              
              {result && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                  <p className="font-semibold text-green-700">Submission Successful!</p>
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                  <p className="font-semibold text-red-700">Error:</p>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Current Volunteers</span>
              <Button variant="outline" size="sm" onClick={loadVolunteers} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading volunteers...</p>
            ) : volunteers.length > 0 ? (
              <div className="space-y-4">
                {volunteers.map((volunteer) => (
                  <div key={volunteer.id} className="p-4 border rounded">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{volunteer.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        volunteer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        volunteer.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {volunteer.status}
                      </span>
                    </div>
                    <p className="text-sm">{volunteer.email}</p>
                    <p className="text-sm">{volunteer.phone}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted: {new Date(volunteer.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No volunteers found. Submit one to see it here!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
