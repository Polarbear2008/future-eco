import { useState, useEffect, FormEvent, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Upload,
  Image
} from "lucide-react";
import { useAdmin, Blog } from "@/contexts/AdminContext";
import { toast } from "sonner";
import { adminBlogFilterCategories, blogCategories } from "@/lib/constants";
import * as uploadService from '@/services/uploadService';
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

// Blog categories
const categories = adminBlogFilterCategories;

// Initial form state
const initialFormState = {
  title: "",
  excerpt: "",
  content: "",
  image: "",
  category: blogCategories[0],
  featured: false,
  date: new Date().toISOString(),
  tags: [] as string[],
  author: {
    name: "",
    image: "",
    role: "Editor"
  }
};

const BlogManagementPage = () => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useAdmin();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [authorImageFile, setAuthorImageFile] = useState<File | null>(null);
  const [authorImagePreview, setAuthorImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAuthorImage, setUploadingAuthorImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authorFileInputRef = useRef<HTMLInputElement>(null);

  // Update local blogs when blogPosts from context changes
  useEffect(() => {
    setBlogs(blogPosts);
  }, [blogPosts]);

  // Filter blogs based on search, category, and status
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

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

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isEditMode && blogToDelete) {
        // Update existing blog
        await updateBlogPost(blogToDelete, formData);
        toast.success("Blog post updated successfully!");
      } else {
        // Create new blog
        await addBlogPost(formData);
        toast.success("Blog post created successfully!");
      }
      
      // Reset form and close dialog
      setFormData(initialFormState);
      setIsDialogOpen(false);
      setIsEditMode(false);
      setBlogToDelete(null);
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error(isEditMode ? "Failed to update blog post" : "Failed to create blog post");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle blog deletion
  const handleDeleteBlog = async () => {
    if (blogToDelete) {
      setIsLoading(true);
      try {
        await deleteBlogPost(blogToDelete);
        toast.success("Blog post deleted successfully!");
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast.error("Failed to delete blog post");
      } finally {
        setIsLoading(false);
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
      tags: blog.tags || [],
      author: {
        name: blog.author.name,
        image: blog.author.image,
        role: blog.author.role
      }
    });
    setBlogToDelete(blog.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Handle image file selection
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>, isAuthorImage = false) => {
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

    if (isAuthorImage) {
      setAuthorImageFile(file);
    } else {
      setImageFile(file);
    }
    
    try {
      // Generate preview
      const previewUrl = await uploadService.getImagePreviewUrl(file);
      if (isAuthorImage) {
        setAuthorImagePreview(previewUrl);
      } else {
        setImagePreview(previewUrl);
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Failed to generate image preview');
    }
  };

  // Handle image upload
  const handleImageUpload = async (isAuthorImage = false) => {
    const file = isAuthorImage ? authorImageFile : imageFile;
    if (!file) {
      toast.error('Please select an image first');
      return;
    }

    try {
      if (isAuthorImage) {
        setUploadingAuthorImage(true);
      } else {
        setUploadingImage(true);
      }
      
      const imageUrl = await uploadService.uploadImage(
        file, 
        isAuthorImage ? 'author-images' : 'blog-images'
      );
      
      // Update form data with the new image URL
      if (isAuthorImage) {
        setFormData(prev => ({
          ...prev,
          author: {
            ...prev.author,
            image: imageUrl
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }));
      }
      
      toast.success(`${isAuthorImage ? 'Author image' : 'Image'} uploaded successfully`);
      
      // Clear the file input
      if (isAuthorImage && authorFileInputRef.current) {
        authorFileInputRef.current.value = '';
      } else if (!isAuthorImage && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload ${isAuthorImage ? 'author image' : 'image'}`);
    } finally {
      if (isAuthorImage) {
        setUploadingAuthorImage(false);
      } else {
        setUploadingImage(false);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <Button 
            className="mt-2 md:mt-0 bg-eco-green hover:bg-eco-green-dark"
            onClick={() => {
              setFormData(initialFormState);
              setIsEditMode(false);
              setBlogToDelete(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Blog Post
          </Button>
        </div>

        <Tabs defaultValue="all" onValueChange={setSelectedStatus}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search blogs..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4" />
                    {selectedCategory !== "All Categories" && (
                      <span className="hidden md:inline">{selectedCategory}</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {adminBlogFilterCategories.map((category) => (
                    <DropdownMenuItem 
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-eco-green/10 text-eco-green font-medium" : ""}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <BlogTable 
              blogs={filteredBlogs} 
              formatDate={formatDate} 
              onDeleteClick={(id) => {
                setBlogToDelete(id);
                setIsDeleteDialogOpen(true);
              }}
              onEditClick={handleEditClick}
            />
          </TabsContent>
          <TabsContent value="published" className="m-0">
            <BlogTable 
              blogs={filteredBlogs} 
              formatDate={formatDate}
              onDeleteClick={(id) => {
                setBlogToDelete(id);
                setIsDeleteDialogOpen(true);
              }}
              onEditClick={handleEditClick}
            />
          </TabsContent>
          <TabsContent value="draft" className="m-0">
            <BlogTable 
              blogs={filteredBlogs} 
              formatDate={formatDate}
              onDeleteClick={(id) => {
                setBlogToDelete(id);
                setIsDeleteDialogOpen(true);
              }}
              onEditClick={handleEditClick}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create/Edit Blog Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
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
                  className="min-h-[200px]" 
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
                  onChange={(e) => handleImageSelect(e)}
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
                        onClick={() => handleImageUpload()}
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
              <div className="grid gap-2">
                <Label htmlFor="authorImage">Author Image URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="authorImage" 
                    placeholder="https://example.com/author.jpg" 
                    value={formData.author.image}
                    onChange={(e) => handleInputChange('author.image', e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => authorFileInputRef.current?.click()}
                  >
                    <Image className="h-4 w-4 mr-1" />
                    Browse
                  </Button>
                </div>
                <input 
                  type="file" 
                  ref={authorFileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, true)}
                />
                
                {authorImagePreview && (
                  <div className="mt-2">
                    <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={authorImagePreview} 
                        alt="Author Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button 
                        type="button"
                        onClick={() => handleImageUpload(true)}
                        disabled={uploadingAuthorImage}
                        className="bg-eco-green hover:bg-eco-green-dark"
                      >
                        {uploadingAuthorImage ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload Author Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured" 
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange('featured', checked)}
                />
                <Label htmlFor="featured">Mark as featured post</Label>
              </div>
            </div>
            <DialogFooter className="sticky bottom-0 bg-background pt-2 pb-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  setFormData(initialFormState);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-eco-green hover:bg-eco-green-dark"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Update Blog Post" : "Create Blog Post"}
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
              This action cannot be undone. This will permanently delete the blog post from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteBlog}
              className="bg-red-500 hover:bg-red-600"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

// Blog Table Component
interface BlogTableProps {
  blogs: Blog[];
  formatDate: (date: Date) => string;
  onDeleteClick: (id: string) => void;
  onEditClick: (blog: Blog) => void;
}

const BlogTable = ({ blogs, formatDate, onDeleteClick, onEditClick }: BlogTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>{blog.category}</TableCell>
                <TableCell>{blog.author.name}</TableCell>
                <TableCell>{formatDate(blog.createdAt)}</TableCell>
                <TableCell className="text-center">
                  {blog.featured ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onEditClick(blog)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      onClick={() => onDeleteClick(blog.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      asChild
                    >
                      <a href={`/blog/${blog.id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </a>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No blogs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogManagementPage;
