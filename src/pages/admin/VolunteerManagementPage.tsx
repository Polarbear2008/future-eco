import { useState } from "react";
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
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText,
  UserCheck
} from "lucide-react";
import { useAdmin, Volunteer } from "@/contexts/AdminContext";

// Roles for filter
const roles = [
  "All Roles",
  "Community Outreach",
  "Event Coordinator",
  "Environmental Educator",
  "Field Volunteer",
  "Marketing Specialist",
  "Technical Support",
  "Administrative Support",
  "Research Assistant"
];

const VolunteerManagementPage = () => {
  const { volunteers, updateVolunteer } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Filter volunteers based on search, role, and status
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === "All Roles" || volunteer.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || volunteer.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
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
  const handleStatusChange = (id: number, newStatus: "approved" | "rejected" | "pending") => {
    updateVolunteer(id, { status: newStatus });
    setIsDetailsDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Management</h1>
          <div className="mt-2 md:mt-0">
            <Button variant="outline" className="mr-2">
              <FileText className="h-4 w-4 mr-2" />
              Export List
            </Button>
            <Button className="bg-eco-green hover:bg-eco-green-dark">
              <UserCheck className="h-4 w-4 mr-2" />
              Assign to Project
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setSelectedStatus}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Applications</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search volunteers..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4" />
                    {selectedRole !== "All Roles" && (
                      <span className="hidden md:inline">{selectedRole}</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {roles.map((role) => (
                    <DropdownMenuItem 
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={selectedRole === role ? "bg-eco-green/10 text-eco-green font-medium" : ""}
                    >
                      {role}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <VolunteerTable 
              volunteers={filteredVolunteers} 
              formatDate={formatDate}
              onViewDetails={(volunteer) => {
                setSelectedVolunteer(volunteer);
                setIsDetailsDialogOpen(true);
              }}
            />
          </TabsContent>
          <TabsContent value="pending" className="m-0">
            <VolunteerTable 
              volunteers={filteredVolunteers.filter(v => v.status === 'pending')} 
              formatDate={formatDate}
              onViewDetails={(volunteer) => {
                setSelectedVolunteer(volunteer);
                setIsDetailsDialogOpen(true);
              }}
            />
          </TabsContent>
          <TabsContent value="approved" className="m-0">
            <VolunteerTable 
              volunteers={filteredVolunteers.filter(v => v.status === 'approved')} 
              formatDate={formatDate}
              onViewDetails={(volunteer) => {
                setSelectedVolunteer(volunteer);
                setIsDetailsDialogOpen(true);
              }}
            />
          </TabsContent>
          <TabsContent value="rejected" className="m-0">
            <VolunteerTable 
              volunteers={filteredVolunteers.filter(v => v.status === 'rejected')} 
              formatDate={formatDate}
              onViewDetails={(volunteer) => {
                setSelectedVolunteer(volunteer);
                setIsDetailsDialogOpen(true);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Volunteer Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Volunteer Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedVolunteer && (
            <div className="grid gap-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedVolunteer.name}</h2>
                  <p className="text-gray-500">{selectedVolunteer.role}</p>
                </div>
                <Badge 
                  className={`mt-2 md:mt-0 ${
                    selectedVolunteer.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                    selectedVolunteer.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                    'bg-amber-100 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  {selectedVolunteer.status.charAt(0).toUpperCase() + selectedVolunteer.status.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={`mailto:${selectedVolunteer.email}`} className="text-blue-600 hover:underline">
                      {selectedVolunteer.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={`tel:${selectedVolunteer.phone}`} className="text-blue-600 hover:underline">
                      {selectedVolunteer.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{selectedVolunteer.location}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Applied: {formatDate(selectedVolunteer.appliedDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Availability: {selectedVolunteer.availability}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVolunteer.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Project Interest</h3>
                <p className="text-gray-700">{selectedVolunteer.projectInterest}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Experience</h3>
                <p className="text-gray-700">{selectedVolunteer.experience}</p>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                {selectedVolunteer.status !== 'rejected' && (
                  <Button 
                    variant="destructive" 
                    onClick={() => handleStatusChange(selectedVolunteer.id, 'rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                )}
                {selectedVolunteer.status !== 'pending' && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleStatusChange(selectedVolunteer.id, 'pending')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Mark as Pending
                  </Button>
                )}
                {selectedVolunteer.status !== 'approved' && (
                  <Button 
                    className="bg-eco-green hover:bg-eco-green-dark"
                    onClick={() => handleStatusChange(selectedVolunteer.id, 'approved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

// Volunteer Table Component
interface VolunteerTableProps {
  volunteers: Volunteer[];
  formatDate: (date: string) => string;
  onViewDetails: (volunteer: Volunteer) => void;
}

const VolunteerTable = ({ volunteers, formatDate, onViewDetails }: VolunteerTableProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Volunteer</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No volunteer applications found
                </TableCell>
              </TableRow>
            ) : (
              volunteers.map((volunteer) => (
                <TableRow key={volunteer.id}>
                  <TableCell className="font-medium">
                    <div>
                      {volunteer.name}
                      <div className="text-xs text-gray-500 mt-0.5">{volunteer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{volunteer.role}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {volunteer.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50 text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {volunteer.skills.length > 2 && (
                        <Badge variant="outline" className="bg-gray-50 text-xs">
                          +{volunteer.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(volunteer.appliedDate)}</TableCell>
                  <TableCell>
                    <Badge 
                      className={`${
                        volunteer.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                        volunteer.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                        'bg-amber-100 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      className="h-8 px-2 text-gray-600 hover:text-gray-900"
                      onClick={() => onViewDetails(volunteer)}
                    >
                      View Details
                    </Button>
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

export default VolunteerManagementPage;
