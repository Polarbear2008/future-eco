import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const TestUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      addLog(`File selected: ${e.target.files[0].name}`);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);
    setImageUrl(null);
    addLog("Starting upload...");

    try {
      // Create a direct reference
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `test-uploads/${fileName}`);
      
      addLog(`Created storage reference: test-uploads/${fileName}`);

      // Upload directly
      addLog("Uploading to Firebase...");
      const snapshot = await uploadBytes(storageRef, file);
      addLog("Upload successful, getting download URL...");

      // Get URL
      const url = await getDownloadURL(snapshot.ref);
      addLog(`Got download URL: ${url}`);
      setImageUrl(url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
      addLog(`ERROR: ${err.message || "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-4">
        <h1 className="text-2xl font-bold">Test Firebase Upload</h1>
        
        <div className="flex flex-col space-y-4 max-w-md">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="border p-2 rounded"
          />
          
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
          
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded">
              {error}
            </div>
          )}
          
          {imageUrl && (
            <div className="space-y-2">
              <h3 className="font-medium">Upload Successful!</h3>
              <img 
                src={imageUrl} 
                alt="Uploaded" 
                className="max-w-full h-auto border rounded"
              />
              <p className="text-xs break-all">{imageUrl}</p>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Upload Logs:</h3>
            <div className="bg-gray-100 p-3 rounded text-xs font-mono h-60 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
              ))}
              {logs.length === 0 && <p className="text-gray-500">No logs yet</p>}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TestUploadPage;
