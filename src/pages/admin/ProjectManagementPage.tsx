import { useState, useEffect, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Edit, Trash2, Plus, CheckCircle, Search, Filter, ArrowUpDown, Loader2, Eye, ArrowUpRight, Calendar, Users, MoreVertical } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Project } from '@/lib/supabase';
import * as projectService from '@/services/projectService';
import ImageUpload from '@/components/admin/ImageUpload';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFilterCategories, projectCategories, projectStatuses } from '@/lib/constants';

const ProjectManagementPage = () => {
  const { projects, addProject, updateProject, deleteProject } = useAdmin();
  const navigate = useNavigate();
  
  // State for filtering and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });
  
  // State for dialogs
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  
  // Default form data
  const defaultFormData = {
    title: "",
    short_description: "",
    description: "",
    category: "",
    status: "planning" as "planning" | "active" | "completed",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    location: "",
    image: "",
    progress: 0,
    budget: 0,
    raised: 0,
    featured: false,
    coordinator: "",
    team_members: [] as string[],
    goals: [] as string[]
  };
  
  // Form state
  const [formData, setFormData] = useState<typeof defaultFormData>(defaultFormData);

  // Reset form to defaults
  const resetForm = () => {
    setFormData(defaultFormData);
  };

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        await projectService.getAllProjects();
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast.error('Failed to load projects');
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, []);

  // Filter projects based on search, category, and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || project.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name === 'budget' || name === 'raised' || name === 'progress') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };

  // Handle array field changes (comma-separated values)
  const handleArrayFieldChange = (e: React.ChangeEvent<HTMLTextAreaElement>, fieldName: 'team_members' | 'goals') => {
    const values = e.target.value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData(prev => ({ ...prev, [fieldName]: values }));
  };

  // Confirm delete project
  const confirmDeleteProject = async () => {
    if (!selectedProject) return;
    
    try {
      setIsLoading(true);
      const success = await projectService.deleteProject(selectedProject.id);
      
      if (success) {
        deleteProject(selectedProject.id);
        toast.success('Project deleted successfully');
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    }
  };

  // Handle project deletion
  const handleDeleteProject = () => {
    if (selectedProject) {
      confirmDeleteProject();
    }
  };

  // Handle project edit
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      short_description: project.short_description || '',
      image: project.image || '',
      category: project.category,
      status: project.status,
      featured: project.featured || false,
      progress: project.progress || 0,
      location: project.location || '',
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      budget: project.budget || 0,
      raised: project.raised || 0,
      coordinator: project.coordinator || '',
      team_members: project.team_members || [],
      goals: project.goals || []
    });
    setIsEditDialogOpen(true);
  };

  // Handle save edited project
  const handleUpdateProject = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) return;
    
    try {
      setIsSaving(true);
      
      // Prepare data for submission
      const projectData = {
        title: formData.title,
        description: formData.description,
        short_description: formData.short_description,
        category: formData.category,
        status: formData.status,
        image: formData.image,
        featured: formData.featured,
        progress: formData.progress,
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget: formData.budget,
        raised: formData.raised,
        coordinator: formData.coordinator,
        team_members: formData.team_members,
        goals: formData.goals
      };
      
      // Handle base64 image data
      if (projectData.image && projectData.image.startsWith('data:image')) {
        console.log('Using base64 image data');
      }
      
      // Update the project in Supabase
      await projectService.updateProject(selectedProject.id, projectData);
      
      // Update projects list using context function
      updateProject(selectedProject.id, projectData);
      
      // Close dialog and show success
      setIsEditDialogOpen(false);
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle create new project
  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // Prepare data for submission
      const projectData = {
        title: formData.title,
        description: formData.description,
        short_description: formData.short_description,
        category: formData.category,
        status: formData.status,
        image: formData.image,
        featured: formData.featured,
        progress: formData.progress,
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget: formData.budget,
        raised: formData.raised,
        coordinator: formData.coordinator,
        team_members: formData.team_members,
        goals: formData.goals
      };
      
      // Handle base64 image data
      if (projectData.image && projectData.image.startsWith('data:image')) {
        console.log('Using base64 image data');
      }
      
      // Create the project in Supabase
      const newProject = await projectService.createProject(projectData);
      
      if (newProject) {
        // Update projects list using context function
        addProject(projectData);
        
        // Reset form and show success
        setSaveSuccess(true);
        setTimeout(() => {
          setIsNewProjectDialogOpen(false);
          setSaveSuccess(false);
          resetForm();
        }, 2000);
        
        toast.success('Project created successfully');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setIsSaving(false);
    }
  };

  // Open new project dialog
  const handleNewProject = () => {
    setFormData(defaultFormData);
    setIsNewProjectDialogOpen(true);
  };

  // Handle preview project
  const handlePreviewProject = (project: Project) => {
    setSelectedProject(project);
    setIsPreviewDialogOpen(true);
  };

  // Handle delete project
  const handleDeleteProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Project Management</h1>
          <Button onClick={handleNewProject} className="bg-eco-green hover:bg-eco-green-dark">
            <Plus className="mr-2 h-4 w-4" /> Add New Project
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Projects Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search projects..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select 
                  value={categoryFilter} 
                  onValueChange={(value) => setCategoryFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Categories">All Categories</SelectItem>
                    {adminFilterCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <ProjectTable 
              projects={filteredProjects} 
              formatDate={formatDate}
              onDeleteClick={handleDeleteProjectClick}
              onEditClick={handleEditProject}
              onPreviewClick={handlePreviewProject}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project 
              "{selectedProject?.title}" and remove all associated data from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteProject}
              className="bg-red-500 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Project'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          
          {saveSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
              <h3 className="text-xl font-semibold text-green-700">Project Updated Successfully!</h3>
              <p className="text-gray-500 mt-2">Changes will be reflected on the public website immediately.</p>
            </div>
          ) : (
            <form onSubmit={handleUpdateProject} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="short_description">Short Description (for cards)</Label>
                    <Textarea 
                      id="short_description" 
                      name="short_description" 
                      value={formData.short_description || ''} 
                      onChange={handleFormChange} 
                      placeholder="Brief description for project cards (150 chars max)"
                      className="h-20"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleFormChange} 
                      required 
                      className="h-32"
                    />
                  </div>
                  
                  <ImageUpload 
                    onImageUploaded={(url) => setFormData({ ...formData, image: url })}
                    currentImageUrl={formData.image}
                    label="Project Image"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => handleFormChange({ target: { name: 'category', value } } as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {adminFilterCategories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => handleFormChange({ target: { name: 'status', value } } as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input 
                        id="start_date" 
                        name="start_date" 
                        type="date" 
                        value={formData.start_date} 
                        onChange={handleFormChange} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="end_date">End Date</Label>
                      <Input 
                        id="end_date" 
                        name="end_date" 
                        type="date" 
                        value={formData.end_date || ''} 
                        onChange={handleFormChange} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      value={formData.location || ''} 
                      onChange={handleFormChange} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="coordinator">Coordinator</Label>
                    <Input 
                      id="coordinator" 
                      name="coordinator" 
                      value={formData.coordinator || ''} 
                      onChange={handleFormChange} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="team_members">Team Members (comma-separated)</Label>
                    <Textarea 
                      id="team_members" 
                      name="team_members" 
                      value={formData.team_members ? formData.team_members.join(', ') : ''} 
                      onChange={(e) => handleArrayFieldChange(e, 'team_members')} 
                      placeholder="Enter team members separated by commas"
                      className="h-20"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="goals">Project Goals (comma-separated)</Label>
                    <Textarea 
                      id="goals" 
                      name="goals" 
                      value={formData.goals ? formData.goals.join(', ') : ''} 
                      onChange={(e) => handleArrayFieldChange(e, 'goals')} 
                      placeholder="Enter project goals separated by commas"
                      className="h-20"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget">Budget ($)</Label>
                      <Input 
                        id="budget" 
                        name="budget" 
                        type="number" 
                        value={formData.budget || 0} 
                        onChange={handleFormChange} 
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="raised">Funds Raised ($)</Label>
                      <Input 
                        id="raised" 
                        name="raised" 
                        type="number" 
                        value={formData.raised || 0} 
                        onChange={handleFormChange} 
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="progress">Progress (%)</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="progress" 
                        name="progress" 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={formData.progress || 0} 
                        onChange={handleFormChange} 
                        className="w-full"
                      />
                      <span className="text-sm font-medium">{formData.progress || 0}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: Progress will be automatically set to 100% for completed projects and capped at 20% for planning projects
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="featured" 
                      checked={formData.featured || false} 
                      onCheckedChange={handleCheckboxChange} 
                    />
                    <Label htmlFor="featured">Featured Project</Label>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-eco-green hover:bg-eco-green-dark" disabled={isSaving}>Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* New Project Dialog */}
      <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          
          {saveSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
              <h3 className="text-xl font-semibold text-green-700">Project Created Successfully!</h3>
              <p className="text-gray-500 mt-2">Your new project is now live on the website.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-title">Project Title</Label>
                    <Input 
                      id="new-title" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-short_description">Short Description (for cards)</Label>
                    <Textarea 
                      id="new-short_description" 
                      name="short_description" 
                      value={formData.short_description || ''} 
                      onChange={handleFormChange} 
                      placeholder="Brief description for project cards (150 chars max)"
                      className="h-20"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-description">Full Description</Label>
                    <Textarea 
                      id="new-description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleFormChange} 
                      required 
                      className="h-32"
                    />
                  </div>
                  
                  <ImageUpload 
                    onImageUploaded={(url) => setFormData({ ...formData, image: url })}
                    currentImageUrl={formData.image}
                    label="Project Image"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new-category">Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => handleFormChange({ target: { name: 'category', value } } as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {adminFilterCategories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="new-status">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => handleFormChange({ target: { name: 'status', value } } as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new-start_date">Start Date</Label>
                      <Input 
                        id="new-start_date" 
                        name="start_date" 
                        type="date" 
                        value={formData.start_date} 
                        onChange={handleFormChange} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="new-end_date">End Date</Label>
                      <Input 
                        id="new-end_date" 
                        name="end_date" 
                        type="date" 
                        value={formData.end_date || ''} 
                        onChange={handleFormChange} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="new-location">Location</Label>
                    <Input 
                      id="new-location" 
                      name="location" 
                      value={formData.location || ''} 
                      onChange={handleFormChange} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-coordinator">Coordinator</Label>
                    <Input 
                      id="new-coordinator" 
                      name="coordinator" 
                      value={formData.coordinator || ''} 
                      onChange={handleFormChange} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-team_members">Team Members (comma-separated)</Label>
                    <Textarea 
                      id="new-team_members" 
                      name="team_members" 
                      value={formData.team_members ? formData.team_members.join(', ') : ''} 
                      onChange={(e) => handleArrayFieldChange(e, 'team_members')} 
                      placeholder="Enter team members separated by commas"
                      className="h-20"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-goals">Project Goals (comma-separated)</Label>
                    <Textarea 
                      id="new-goals" 
                      name="goals" 
                      value={formData.goals ? formData.goals.join(', ') : ''} 
                      onChange={(e) => handleArrayFieldChange(e, 'goals')} 
                      placeholder="Enter project goals separated by commas"
                      className="h-20"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new-budget">Budget ($)</Label>
                      <Input 
                        id="new-budget" 
                        name="budget" 
                        type="number" 
                        value={formData.budget || 0} 
                        onChange={handleFormChange} 
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="new-raised">Funds Raised ($)</Label>
                      <Input 
                        id="new-raised" 
                        name="raised" 
                        type="number" 
                        value={formData.raised || 0} 
                        onChange={handleFormChange} 
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="new-progress">Progress (%)</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="new-progress" 
                        name="progress" 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={formData.progress || 0} 
                        onChange={handleFormChange} 
                        className="w-full"
                      />
                      <span className="text-sm font-medium">{formData.progress || 0}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: Progress will be automatically set to 100% for completed projects and capped at 20% for planning projects
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="new-featured" 
                      checked={formData.featured || false} 
                      onCheckedChange={handleCheckboxChange} 
                    />
                    <Label htmlFor="new-featured">Featured Project</Label>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsNewProjectDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-eco-green hover:bg-eco-green-dark" disabled={isSaving}>Create Project</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Project Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Preview</DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img 
                  src={selectedProject.image || '/images/projects/default-project-1.jpg'} 
                  alt={selectedProject.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/projects/default-project-1.jpg';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    selectedProject.status === 'active' ? 'bg-green-500 text-white' :
                    selectedProject.status === 'completed' ? 'bg-blue-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                {selectedProject.short_description && (
                  <p className="text-gray-600 mt-2">{selectedProject.short_description}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{selectedProject.description}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Details</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{selectedProject.category}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedProject.location || 'N/A'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Coordinator:</span>
                        <span className="font-medium">{selectedProject.coordinator || 'N/A'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">{selectedProject.start_date || 'N/A'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium">{selectedProject.end_date || 'N/A'}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Progress</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${selectedProject.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>{selectedProject.progress || 0}% Complete</span>
                      <span>
                        ${selectedProject.raised || 0} of ${selectedProject.budget || 0} raised
                      </span>
                    </div>
                  </div>
                  
                  {selectedProject.goals && selectedProject.goals.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Goals</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedProject.goals.map((goal, index) => (
                          <li key={index}>{goal}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedProject.team_members && selectedProject.team_members.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Team Members</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.team_members.map((member, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsPreviewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setIsPreviewDialogOpen(false);
                    // navigate(`/projects/${selectedProject.id}`);
                  }}
                  className="bg-eco-green hover:bg-eco-green-dark"
                >
                  View Public Page
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

// Project Table Component
interface ProjectTableProps {
  projects: Project[];
  formatDate: (date: string) => string;
  onDeleteClick: (project: Project) => void;
  onEditClick: (project: Project) => void;
  onPreviewClick: (project: Project) => void;
}

const ProjectTable = ({ projects, formatDate, onDeleteClick, onEditClick, onPreviewClick }: ProjectTableProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Project</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Volunteers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No projects found
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-gray-100 mr-3 overflow-hidden flex-shrink-0">
                        <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        {project.title}
                        {project.featured && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                            Featured
                          </span>
                        )}
                        <div className="text-xs text-gray-500 mt-0.5">{project.location}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {project.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="w-full max-w-[100px]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
                        <span className={`text-xs ${
                          project.status === 'active' ? 'text-blue-600' :
                          project.status === 'completed' ? 'text-green-600' :
                          'text-amber-600'
                        }`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            project.status === 'active' ? 'bg-blue-500' :
                            project.status === 'completed' ? 'bg-green-500' :
                            'bg-amber-500'
                          }`} 
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{project.team_members ? project.team_members.length : 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => onEditClick(project)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => onPreviewClick(project)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Preview</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                          <span>View Volunteers</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-600 focus:text-red-600" 
                          onClick={() => onDeleteClick(project)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProjectManagementPage;
