import { useState, useEffect, useRef } from 'react';
import { Blog } from '@/lib/firebase';
import * as blogService from '@/services/blogService';
import * as uploadService from '@/services/uploadService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Edit, Upload, Image } from 'lucide-react';
import { blogCategories } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BlogTestPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1557425955-df376b5903c8?q=80&w=2070',
    category: blogCategories[0],
    featured: false,
    date: new Date().toISOString(),
    author: {
      name: 'Test User',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      role: 'Editor'
    },
    tags: [] as string[]
  });

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const blogData = await blogService.getAllBlogs();
        setBlogs(blogData);
        setError(null);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to fetch blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('author.')) {
      const authorField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        author: {
          ...prev.author,
          [authorField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle image file selection
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    
    try {
      // Generate preview
      const previewUrl = await uploadService.getImagePreviewUrl(file);
      setImagePreview(previewUrl);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Failed to generate image preview');
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error('Please select an image first');
      return;
    }

    try {
      setUploadingImage(true);
      const imageUrl = await uploadService.uploadImage(imageFile, 'blog-images');
      
      // Update form data with the new image URL
      setFormData(prev => ({
        ...prev,
        image: imageUrl
      }));
      
      toast.success('Image uploaded successfully');
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditMode && blogToDelete) {
        // Update existing blog
        const updatedBlog = await blogService.updateBlog(blogToDelete, formData);
        setBlogs(prev => prev.map(blog => blog.id === blogToDelete ? updatedBlog : blog));
        toast.success("Blog post updated successfully!");
      } else {
        // Create new blog
        const newBlog = await blogService.createBlog(formData);
        setBlogs(prev => [newBlog, ...prev]);
        toast.success("Blog post created successfully!");
      }
      
      // Reset form and close dialog
      resetForm();
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error(isEditMode ? "Failed to update blog post" : "Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  // Handle blog deletion
  const handleDeleteBlog = async () => {
    if (blogToDelete) {
      setLoading(true);
      try {
        await blogService.deleteBlog(blogToDelete);
        setBlogs(prev => prev.filter(blog => blog.id !== blogToDelete));
        toast.success("Blog post deleted successfully!");
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast.error("Failed to delete blog post");
      } finally {
        setLoading(false);
        setBlogToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  // Open edit dialog with blog data
  const handleEditClick = (blog: Blog) => {
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      category: blog.category,
      featured: blog.featured,
      date: blog.date,
      author: {
        name: blog.author.name,
        image: blog.author.image,
        role: blog.author.role
      },
      tags: blog.tags || []
    });
    setBlogToDelete(blog.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1557425955-df376b5903c8?q=80&w=2070',
      category: blogCategories[0],
      featured: false,
      date: new Date().toISOString(),
      author: {
        name: 'Test User',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: 'Editor'
      },
      tags: []
    });
    setImageFile(null);
    setImagePreview(null);
    setIsEditMode(false);
    setBlogToDelete(null);
    setIsDialogOpen(false);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Testing Page</h1>
        <Button 
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-eco-green hover:bg-eco-green-dark"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Test Blog
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && blogs.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-eco-green" />
          <span className="ml-2">Loading blogs...</span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-medium text-gray-600">No blogs found</h2>
          <p className="text-gray-500 mt-2">Create a new blog to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={blog.image || 'https://via.placeholder.com/400x200?text=No+Image'} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-eco-green mb-1">{blog.category}</div>
                    <CardTitle>{blog.title}</CardTitle>
                  </div>
                  {blog.featured && (
                    <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>
                <CardDescription>{blog.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                    <img 
                      src={blog.author.image || 'https://via.placeholder.com/40?text=AU'} 
                      alt={blog.author.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{blog.author.name}</div>
                    <div className="text-xs text-gray-500">{formatDate(blog.createdAt)}</div>
                  </div>
                </div>
                <div className="line-clamp-3 text-sm text-gray-600">
                  {blog.content}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditClick(blog)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => {
                    setBlogToDelete(blog.id);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Blog Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Blog Post" : "Create Test Blog Post"}</DialogTitle>
            <DialogDescription>
              This page is for testing the Firebase blog functionality.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter blog title" 
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select 
                    id="category" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                  >
                    {blogCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="author">Author Name</Label>
                  <Input 
                    id="author" 
                    placeholder="Enter author name" 
                    value={formData.author.name}
                    onChange={(e) => handleInputChange('author.name', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea 
                  id="excerpt" 
                  placeholder="Brief summary of the blog post" 
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Write your blog content here..." 
                  className="min-h-[150px]" 
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Featured Image URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="image" 
                    placeholder="https://example.com/image.jpg" 
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="h-4 w-4 mr-1" />
                    Browse
                  </Button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageSelect}
                />
                
                {imagePreview && (
                  <div className="mt-2">
                    <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button 
                        type="button"
                        onClick={handleImageUpload}
                        disabled={uploadingImage}
                        className="bg-eco-green hover:bg-eco-green-dark"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="featured" 
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-eco-green focus:ring-eco-green"
                />
                <Label htmlFor="featured">Mark as featured post</Label>
              </div>
            </div>
            <DialogFooter className="sticky bottom-0 bg-background pt-2 pb-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-eco-green hover:bg-eco-green-dark"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Update Blog Post" : "Save Blog Post"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this blog post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post from Firebase.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteBlog}
              className="bg-red-500 hover:bg-red-600"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogTestPage;
