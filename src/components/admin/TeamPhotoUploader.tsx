import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamMember } from "@/contexts/TeamContext";
import { toast } from "@/components/ui/use-toast";

interface TeamPhotoUploaderProps {
  teamMember: TeamMember;
  onPhotoUpdate: (id: number, imageUrl: string) => void;
}

const TeamPhotoUploader = ({ teamMember, onPhotoUpdate }: TeamPhotoUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Set uploading state
    setIsUploading(true);

    try {
      // Instead of uploading to Firebase, we'll use a local path
      // In a real app, you would send this file to your server
      // For now, we'll simulate a successful "upload" by using the public path
      
      // Create a unique filename
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      
      // In a real implementation, we would copy the file to public/images/team/
      // Since we can't do that directly in the browser, we'll just use the path
      const imageUrl = `/images/team/${fileName}`;
      
      // Simulate a delay for the "upload"
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the team member's photo
      onPhotoUpdate(teamMember.id, imageUrl);
      
      // Show success message
      toast({
        title: "Success!",
        description: `Photo for ${teamMember.name} has been updated. Please manually copy the image to /public/images/team/${fileName}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Could not process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Determine which image to display
  const displayImage = previewUrl || teamMember.image;

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img 
          src={displayImage} 
          alt={teamMember.name}
          className="h-full w-full object-contain transition-all hover:scale-105"
          onError={(e) => {
            // Fallback to logo if image fails to load
            (e.target as HTMLImageElement).src = "/logo.png";
          }}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{teamMember.name}</h3>
        <p className="text-sm text-gray-500">{teamMember.role}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="w-full">
          {isUploading ? (
            <Button disabled className="w-full bg-amber-600">
              Processing...
            </Button>
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                id={`photo-upload-${teamMember.id}`}
                className="hidden"
                onChange={handleFileChange}
              />
              <label 
                htmlFor={`photo-upload-${teamMember.id}`}
                className="cursor-pointer inline-flex items-center justify-center w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Update Photo
              </label>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TeamPhotoUploader;
