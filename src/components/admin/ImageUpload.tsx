import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
}

const ImageUpload = ({ onImageUploaded, currentImageUrl = '', label = 'Project Image' }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);
  const [imageUrl, setImageUrl] = useState<string>(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Convert to base64
      const base64 = await convertToBase64(file);
      
      // Update preview and notify parent
      setPreviewUrl(base64 as string);
      setImageUrl(base64 as string);
      onImageUploaded(base64 as string);
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    } finally {
      setIsUploading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewUrl(url);
    onImageUploaded(url);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">{label}</Label>
      
      <div className="flex flex-col gap-4">
        {/* Hidden file input */}
        <Input 
          ref={fileInputRef}
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {/* Upload button */}
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleButtonClick}
          disabled={isUploading}
          className="w-full h-12 border-dashed border-2"
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isUploading ? 'Processing...' : 'Upload Image'}
        </Button>
        
        {/* Image preview */}
        {previewUrl && (
          <div className="mt-2 relative">
            <div className="aspect-video rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="object-cover w-full h-full"
                onError={() => {
                  toast.error('Failed to load image preview');
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 truncate">
              {previewUrl.startsWith('data:') ? 'Local image' : previewUrl}
            </p>
          </div>
        )}
        
        {/* Alternative URL input */}
        <div>
          <Label htmlFor="image-url" className="text-sm">Or enter image URL directly:</Label>
          <Input 
            id="image-url" 
            type="url" 
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
