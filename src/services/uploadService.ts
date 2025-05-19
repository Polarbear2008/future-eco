import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

/**
 * Upload an image file to Firebase Storage
 * @param file The file to upload
 * @param path The storage path (folder) to upload to
 * @returns Promise with the download URL of the uploaded file
 */
export async function uploadImage(file: File, path: string = 'blog-images'): Promise<string> {
  try {
    // Create a unique filename
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    // Create a reference to the file location in Firebase Storage
    const storageRef = ref(storage, `${path}/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Generate a data URL from a file (for preview)
 * @param file The file to generate a data URL for
 * @returns Promise with the data URL
 */
export function getImagePreviewUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get a valid image URL that works in production
 * This function handles both full URLs and relative paths
 * @param imageUrl The image URL or path
 * @returns A properly formatted image URL
 */
export function getValidImageUrl(imageUrl: string): string {
  if (!imageUrl) {
    // Return a default image if none is provided
    return '/images/placeholder.jpg';
  }
  
  // If it's already a full URL, return it as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path, make sure it's properly formatted
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // Otherwise, assume it's a relative path without a leading slash
  return `/${imageUrl}`;
}
