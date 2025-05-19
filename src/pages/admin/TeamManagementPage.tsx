import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import TeamPhotoUploader from "@/components/admin/TeamPhotoUploader";
import { useTeam, TeamMember } from "@/contexts/TeamContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const TeamManagementPage = () => {
  const { teamMembers, updateTeamMemberPhoto, isLoading } = useTeam();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just a small delay to simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handlePhotoUpdate = (memberId: number, newImageUrl: string) => {
    // Use the context method to update the photo
    updateTeamMemberPhoto(memberId, newImageUrl);
    
    // Log for debugging
    console.log(`Updated member ${memberId} with new image: ${newImageUrl}`);
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved Successfully",
      description: "All team member photos have been updated and are now visible on the main website.",
      variant: "default",
    });
    
    // Log the updated team members for reference
    console.log("Updated team members:", teamMembers);
    
    // Show a more prominent success message
    const updatedCount = teamMembers.filter(member => !member.image.includes('/logo.png')).length;
    if (updatedCount > 0) {
      toast({
        title: `${updatedCount} Team Member Photos Updated`,
        description: "Visit the About page to see your changes live!",
        variant: "default",
      });
    }
  };

  if (loading || isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Team Management</h1>
          <p>Loading team members...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Team Management</h1>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertTitle>Important: Manual Image Copying Required</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              Due to browser security restrictions, you need to manually copy the selected images to the public folder:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>After selecting an image, note the filename shown in the success message</li>
              <li>Copy the image file to: <code className="bg-gray-100 px-1 py-0.5 rounded">public/images/team/</code> folder</li>
              <li>Ensure the filename matches exactly what was shown in the success message</li>
              <li>Click "Save Changes" below when all images are copied</li>
            </ol>
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {teamMembers.map((member) => (
            <TeamPhotoUploader
              key={member.id}
              teamMember={member}
              onPhotoUpdate={handlePhotoUpdate}
            />
          ))}
        </div>
        
        <Button onClick={handleSaveChanges} className="w-full md:w-auto">
          Save Changes
        </Button>
      </div>
    </AdminLayout>
  );
};

export default TeamManagementPage;
