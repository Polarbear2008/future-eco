import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Search, 
  RefreshCw,
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  FileText,
  UserCheck
} from "lucide-react";
import { Volunteer } from "@/lib/supabase";
import * as volunteerService from "@/services/volunteerService";
import { toast } from "sonner";

const VolunteerListPage = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Load volunteers directly from the service
  const loadVolunteers = async () => {
    setLoading(true);
    try {
      const data = await volunteerService.getAllVolunteers();
      console.log('Loaded volunteers directly:', data);
      setVolunteers(data);
      toast.success(`Loaded ${data.length} volunteer applications`);
    } catch (error) {
      console.error('Error loading volunteers:', error);
      toast.error("Failed to load volunteer applications");
    } finally {
      setLoading(false);
    }
  };

  // Load volunteers on mount
  useEffect(() => {
    loadVolunteers();
  }, []);

  // Filter volunteers based on search and status
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = 
      volunteer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (volunteer.skills && Array.isArray(volunteer.skills) && 
        volunteer.skills.some(skill => 
          typeof skill === 'string' && skill.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    
    const matchesStatus = selectedStatus === "all" || volunteer.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  // Handle volunteer status change
  const handleStatusChange = async (id: number, newStatus: "approved" | "rejected" | "pending") => {
    try {
      console.log(`Updating volunteer ${id} status to ${newStatus}`);
      
      // Call the service function to update status
      const updated = await volunteerService.updateVolunteerStatus(id, newStatus);
      
      console.log('Update response:', updated);
      
      if (updated) {
        // Update the local state with the updated volunteer
        setVolunteers(prev => 
          prev.map(v => v.id === id ? { ...v, status: newStatus } : v)
        );
        
        // Update selected volunteer if it's the one being modified
        if (selectedVolunteer && selectedVolunteer.id === id) {
          setSelectedVolunteer({ ...selectedVolunteer, status: newStatus });
        }
        
        toast.success(`Volunteer status updated to ${newStatus}`);
      } else {
        console.error(`Failed to update volunteer ${id} status`);
        toast.error("Failed to update volunteer status");
      }
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      toast.error("Failed to update volunteer status");
    }
  };

  // View volunteer details
  const handleViewDetails = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsDetailsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Volunteer Applications</h1>
          <Button onClick={loadVolunteers} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Volunteer Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or skills..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 rounded-md border"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading volunteer applications...</div>
            ) : filteredVolunteers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVolunteers.map((volunteer) => (
                      <TableRow key={volunteer.id}>
                        <TableCell className="font-medium">{volunteer.name}</TableCell>
                        <TableCell>{volunteer.email}</TableCell>
                        <TableCell>{volunteer.phone || "N/A"}</TableCell>
                        <TableCell>
                          {volunteer.skills && Array.isArray(volunteer.skills) && volunteer.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {volunteer.skills.slice(0, 2).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {volunteer.skills.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{volunteer.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            "None"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              volunteer.status === "pending" ? "outline" : 
                              volunteer.status === "approved" ? "default" : "destructive"
                            }
                            className={
                              volunteer.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""
                            }
                          >
                            {volunteer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(volunteer.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(volunteer)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(volunteer.id, "approved")}
                              disabled={volunteer.status === "approved"}
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(volunteer.id, "rejected")}
                              disabled={volunteer.status === "rejected"}
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">No volunteer applications found.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Volunteer Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedVolunteer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Volunteer Application Details</span>
                  <Badge 
                    variant={
                      selectedVolunteer.status === "pending" ? "outline" : 
                      selectedVolunteer.status === "approved" ? "default" : "destructive"
                    }
                    className={
                      selectedVolunteer.status === "approved" ? "bg-green-100 text-green-800" : ""
                    }
                  >
                    {selectedVolunteer.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">{selectedVolunteer.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <a href={`mailto:${selectedVolunteer.email}`} className="text-blue-600 hover:underline">
                          {selectedVolunteer.email}
                        </a>
                      </div>
                      {selectedVolunteer.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <a href={`tel:${selectedVolunteer.phone}`} className="text-blue-600 hover:underline">
                            {selectedVolunteer.phone}
                          </a>
                        </div>
                      )}
                      {selectedVolunteer.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{selectedVolunteer.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Availability</h3>
                    <div className="mt-2 flex items-start">
                      <Calendar className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                      <span>{selectedVolunteer.availability || "Not specified"}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <div className="mt-2 flex items-start">
                      <Briefcase className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                      <span>{selectedVolunteer.role || "Not specified"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                    <div className="mt-2">
                      {selectedVolunteer.skills && Array.isArray(selectedVolunteer.skills) && selectedVolunteer.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedVolunteer.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No skills specified</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                    <div className="mt-2 flex items-start">
                      <FileText className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                      <span className="whitespace-pre-wrap">{selectedVolunteer.experience || "Not specified"}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Project Interest</h3>
                    <div className="mt-2 flex items-start">
                      <FileText className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                      <span className="whitespace-pre-wrap">{selectedVolunteer.project_interest || "Not specified"}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Application Date</h3>
                    <div className="mt-2 flex items-start">
                      <Calendar className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                      <span>{formatDate(selectedVolunteer.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  ID: {selectedVolunteer.id}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(selectedVolunteer.id, "pending")}
                    disabled={selectedVolunteer.status === "pending"}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Mark as Pending
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                    onClick={() => handleStatusChange(selectedVolunteer.id, "approved")}
                    disabled={selectedVolunteer.status === "approved"}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                    onClick={() => handleStatusChange(selectedVolunteer.id, "rejected")}
                    disabled={selectedVolunteer.status === "rejected"}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default VolunteerListPage;
