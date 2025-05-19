import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

const SupabaseProjectDebug = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ [key: string]: any }>({});
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [testProjectData, setTestProjectData] = useState(`{
  "title": "Test Project",
  "description": "This is a test project description",
  "short_description": "Short description for test",
  "category": "Environmental",
  "status": "planning",
  "featured": false,
  "progress": 0,
  "team_members": [],
  "goals": []
}`);

  // Test Supabase connection
  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);
    setResults({});
    
    try {
      console.log("Testing Supabase connection...");
      // Use a simple select query instead of count(*)
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects?limit=1`, {
        method: 'GET',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Connection test failed:", errorText);
        setError(`Connection test failed: ${response.status} ${response.statusText}`);
        setResults({ connectionTest: false });
      } else {
        const data = await response.json();
        console.log("Connection test successful:", data);
        setResults({ connectionTest: true, data });
        setRawResponse(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error("Error testing connection:", err);
      setError(`Error testing connection: ${err instanceof Error ? err.message : String(err)}`);
      setResults({ connectionTest: false });
    } finally {
      setLoading(false);
    }
  };

  // Test direct REST API
  const testDirectAPI = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);
    setResults({});
    
    try {
      console.log("Testing direct REST API...");
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects?limit=1`, {
        method: 'GET',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });
      
      const responseText = await response.text();
      console.log("Direct API response:", response.status, responseText);
      
      try {
        const responseData = JSON.parse(responseText);
        setResults({ 
          directApiTest: response.ok, 
          statusCode: response.status,
          headers: Object.fromEntries([...response.headers.entries()])
        });
        setRawResponse(JSON.stringify(responseData, null, 2));
      } catch (e) {
        setResults({ 
          directApiTest: response.ok, 
          statusCode: response.status,
          headers: Object.fromEntries([...response.headers.entries()])
        });
        setRawResponse(responseText);
      }
      
      if (!response.ok) {
        setError(`Direct API test failed: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error testing direct API:", err);
      setError(`Error testing direct API: ${err instanceof Error ? err.message : String(err)}`);
      setResults({ directApiTest: false });
    } finally {
      setLoading(false);
    }
  };

  // Test project creation with Supabase client
  const testProjectCreation = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);
    setResults({});
    
    try {
      console.log("Testing project creation with Supabase client...");
      let projectData;
      
      try {
        projectData = JSON.parse(testProjectData);
      } catch (e) {
        setError(`Invalid JSON in project data: ${e instanceof Error ? e.message : String(e)}`);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();
      
      if (error) {
        console.error("Project creation failed:", error);
        setError(`Project creation failed: ${error.message}`);
        setResults({ projectCreation: false });
      } else {
        console.log("Project creation successful:", data);
        setResults({ projectCreation: true, createdProject: data });
        setRawResponse(JSON.stringify(data, null, 2));
        toast.success("Project created successfully!");
      }
    } catch (err) {
      console.error("Error creating project:", err);
      setError(`Error creating project: ${err instanceof Error ? err.message : String(err)}`);
      setResults({ projectCreation: false });
    } finally {
      setLoading(false);
    }
  };

  // Test project creation with direct REST API
  const testDirectProjectCreation = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);
    setResults({});
    
    try {
      console.log("Testing project creation with direct REST API...");
      let projectData;
      
      try {
        projectData = JSON.parse(testProjectData);
      } catch (e) {
        setError(`Invalid JSON in project data: ${e instanceof Error ? e.message : String(e)}`);
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(projectData)
      });
      
      const responseText = await response.text();
      console.log("Direct project creation response:", response.status, responseText);
      
      try {
        const responseData = JSON.parse(responseText);
        setResults({ 
          directProjectCreation: response.ok, 
          statusCode: response.status,
          headers: Object.fromEntries([...response.headers.entries()])
        });
        setRawResponse(JSON.stringify(responseData, null, 2));
        
        if (response.ok) {
          toast.success("Project created successfully via direct API!");
        }
      } catch (e) {
        setResults({ 
          directProjectCreation: response.ok, 
          statusCode: response.status,
          headers: Object.fromEntries([...response.headers.entries()])
        });
        setRawResponse(responseText);
      }
      
      if (!response.ok) {
        setError(`Direct project creation failed: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error in direct project creation:", err);
      setError(`Error in direct project creation: ${err instanceof Error ? err.message : String(err)}`);
      setResults({ directProjectCreation: false });
    } finally {
      setLoading(false);
    }
  };

  // Check table structure
  const checkTableStructure = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);
    setResults({});
    
    try {
      console.log("Checking projects table structure...");
      
      // This is a special endpoint in Supabase that returns table information
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/?apikey=${import.meta.env.VITE_SUPABASE_ANON_KEY}`);
      
      if (!response.ok) {
        setError(`Failed to get table structure: ${response.status} ${response.statusText}`);
        setResults({ tableStructureCheck: false });
      } else {
        const data = await response.json();
        console.log("Table structure data:", data);
        
        // Find the projects table definition
        const projectsTable = data.definitions.projects;
        
        if (projectsTable) {
          setResults({ 
            tableStructureCheck: true, 
            tableExists: true,
            properties: projectsTable.properties
          });
          setRawResponse(JSON.stringify(projectsTable, null, 2));
        } else {
          setResults({ 
            tableStructureCheck: true, 
            tableExists: false
          });
          setRawResponse(JSON.stringify(data.definitions, null, 2));
        }
      }
    } catch (err) {
      console.error("Error checking table structure:", err);
      setError(`Error checking table structure: ${err instanceof Error ? err.message : String(err)}`);
      setResults({ tableStructureCheck: false });
    } finally {
      setLoading(false);
    }
  };

  // Check RLS policies
  const checkRLSPolicies = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);
    setResults({});
    
    try {
      console.log("Testing anonymous access (should work for SELECT)...");
      
      // Test anonymous SELECT
      const selectResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects?limit=1`, {
        method: 'GET',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        }
      });
      
      // Test anonymous INSERT (should fail if RLS is set up correctly)
      console.log("Testing anonymous insert (should fail with RLS)...");
      const insertResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          title: "RLS Test Project",
          description: "Testing RLS policies",
          short_description: "RLS test",
          category: "Test",
          status: "planning"
        })
      });
      
      setResults({
        rlsCheck: true,
        anonymousSelect: selectResponse.ok,
        anonymousSelectStatus: selectResponse.status,
        anonymousInsert: insertResponse.ok,
        anonymousInsertStatus: insertResponse.status
      });
      
      const selectText = await selectResponse.text();
      const insertText = await insertResponse.text();
      
      setRawResponse(JSON.stringify({
        selectResponse: selectResponse.ok ? JSON.parse(selectText || '[]') : selectText,
        insertResponse: insertText
      }, null, 2));
      
      if (selectResponse.ok && !insertResponse.ok) {
        console.log("RLS policies appear to be working correctly");
      } else if (!selectResponse.ok && !insertResponse.ok) {
        setError("Both SELECT and INSERT failed - RLS might be too restrictive");
      } else if (selectResponse.ok && insertResponse.ok) {
        setError("Anonymous INSERT succeeded - RLS policies may not be properly configured");
      }
    } catch (err) {
      console.error("Error checking RLS policies:", err);
      setError(`Error checking RLS policies: ${err instanceof Error ? err.message : String(err)}`);
      setResults({ rlsCheck: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Supabase Project Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Connection Tests</CardTitle>
            <CardDescription>Test basic connectivity to Supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button 
                onClick={testConnection} 
                disabled={loading}
                variant="outline"
              >
                Test Supabase Connection
              </Button>
              <Button 
                onClick={testDirectAPI} 
                disabled={loading}
                variant="outline"
              >
                Test Direct REST API
              </Button>
            </div>
            
            {results.connectionTest !== undefined && (
              <Alert className={results.connectionTest ? "bg-green-50" : "bg-red-50"}>
                {results.connectionTest ? (
                  <CheckCircledIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle className={results.connectionTest ? "text-green-600" : "text-red-600"}>
                  {results.connectionTest ? "Connection Successful" : "Connection Failed"}
                </AlertTitle>
                <AlertDescription>
                  {results.connectionTest 
                    ? `Successfully connected to Supabase projects table.` 
                    : `Failed to connect to Supabase projects table.`}
                </AlertDescription>
              </Alert>
            )}
            
            {results.directApiTest !== undefined && (
              <Alert className={results.directApiTest ? "bg-green-50" : "bg-red-50"}>
                {results.directApiTest ? (
                  <CheckCircledIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle className={results.directApiTest ? "text-green-600" : "text-red-600"}>
                  {results.directApiTest ? "Direct API Successful" : "Direct API Failed"}
                </AlertTitle>
                <AlertDescription>
                  {results.directApiTest 
                    ? `Successfully connected to Supabase REST API.` 
                    : `Failed to connect to Supabase REST API.`}
                  {results.statusCode && <div>Status Code: {results.statusCode}</div>}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Table Structure</CardTitle>
            <CardDescription>Check projects table structure and RLS policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button 
                onClick={checkTableStructure} 
                disabled={loading}
                variant="outline"
              >
                Check Table Structure
              </Button>
              <Button 
                onClick={checkRLSPolicies} 
                disabled={loading}
                variant="outline"
              >
                Check RLS Policies
              </Button>
            </div>
            
            {results.tableStructureCheck !== undefined && (
              <Alert className={results.tableExists ? "bg-green-50" : "bg-red-50"}>
                {results.tableExists ? (
                  <CheckCircledIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle className={results.tableExists ? "text-green-600" : "text-red-600"}>
                  {results.tableExists ? "Table Exists" : "Table Not Found"}
                </AlertTitle>
                <AlertDescription>
                  {results.tableExists 
                    ? `The projects table exists in Supabase.` 
                    : `The projects table was not found in Supabase.`}
                </AlertDescription>
              </Alert>
            )}
            
            {results.rlsCheck !== undefined && (
              <Alert className={!results.anonymousInsert ? "bg-green-50" : "bg-red-50"}>
                <AlertTitle>RLS Policy Check</AlertTitle>
                <AlertDescription>
                  <div>Anonymous SELECT: {results.anonymousSelect ? "Allowed" : "Denied"} ({results.anonymousSelectStatus})</div>
                  <div>Anonymous INSERT: {results.anonymousInsert ? "Allowed" : "Denied"} ({results.anonymousInsertStatus})</div>
                  <div className="mt-1 text-sm">
                    {!results.anonymousInsert && results.anonymousSelect 
                      ? "RLS policies appear to be correctly configured." 
                      : "RLS policies may not be correctly configured."}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Project Creation Tests</CardTitle>
            <CardDescription>Test creating a project in Supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-data">Test Project Data (JSON)</Label>
              <Textarea 
                id="project-data" 
                value={testProjectData} 
                onChange={(e) => setTestProjectData(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={testProjectCreation} 
                disabled={loading}
                variant="outline"
              >
                Test Supabase Client
              </Button>
              <Button 
                onClick={testDirectProjectCreation} 
                disabled={loading}
                variant="outline"
              >
                Test Direct REST API
              </Button>
            </div>
            
            {results.projectCreation !== undefined && (
              <Alert className={results.projectCreation ? "bg-green-50" : "bg-red-50"}>
                {results.projectCreation ? (
                  <CheckCircledIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle className={results.projectCreation ? "text-green-600" : "text-red-600"}>
                  {results.projectCreation ? "Project Creation Successful" : "Project Creation Failed"}
                </AlertTitle>
                <AlertDescription>
                  {results.projectCreation 
                    ? `Successfully created a project using the Supabase client.` 
                    : `Failed to create a project using the Supabase client.`}
                </AlertDescription>
              </Alert>
            )}
            
            {results.directProjectCreation !== undefined && (
              <Alert className={results.directProjectCreation ? "bg-green-50" : "bg-red-50"}>
                {results.directProjectCreation ? (
                  <CheckCircledIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle className={results.directProjectCreation ? "text-green-600" : "text-red-600"}>
                  {results.directProjectCreation ? "Direct API Creation Successful" : "Direct API Creation Failed"}
                </AlertTitle>
                <AlertDescription>
                  {results.directProjectCreation 
                    ? `Successfully created a project using the direct REST API.` 
                    : `Failed to create a project using the direct REST API.`}
                  {results.statusCode && <div>Status Code: {results.statusCode}</div>}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Detailed test results and responses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="bg-red-50">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-600">Error</AlertTitle>
                <AlertDescription>
                  <div className="text-sm overflow-auto max-h-32">{error}</div>
                </AlertDescription>
              </Alert>
            )}
            
            {rawResponse && (
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="text-sm font-semibold mb-2">Raw Response:</h3>
                <pre className="text-xs overflow-auto max-h-96">{rawResponse}</pre>
              </div>
            )}
            
            <div className="text-sm text-gray-500">
              <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL}</p>
              <p>Anon Key (first 10 chars): {import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 10)}...</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => {
                setError(null);
                setRawResponse(null);
                setResults({});
              }}
              variant="outline"
              size="sm"
            >
              Clear Results
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SupabaseProjectDebug;
