import { Volunteer } from "@/contexts/AdminContext";

export const mockVolunteers: Volunteer[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567",
    role: "Community Outreach",
    skills: ["Public Speaking", "Event Planning", "Social Media"],
    availability: "Weekends",
    status: "approved",
    appliedDate: "2025-03-20T09:15:00",
    location: "Downtown",
    projectInterest: "Urban Garden Initiative",
    experience: "3 years working with local community garden projects"
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "(555) 987-6543",
    role: "Event Coordinator",
    skills: ["Event Management", "Marketing", "Fundraising"],
    availability: "Evenings",
    status: "pending",
    appliedDate: "2025-03-24T13:10:00",
    location: "Westside",
    projectInterest: "Clean Water Initiative",
    experience: "5 years in event management and fundraising"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    phone: "(555) 456-7890",
    role: "Environmental Educator",
    skills: ["Teaching", "Curriculum Development", "Research"],
    availability: "Weekdays",
    status: "approved",
    appliedDate: "2025-03-15T11:30:00",
    location: "Northside",
    projectInterest: "Renewable Energy Workshop Series",
    experience: "7 years as a science teacher with focus on environmental education"
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@example.com",
    phone: "(555) 789-0123",
    role: "Field Volunteer",
    skills: ["Gardening", "Conservation", "Physical Labor"],
    availability: "Flexible",
    status: "pending",
    appliedDate: "2025-03-22T15:45:00",
    location: "Eastside",
    projectInterest: "Wildlife Habitat Restoration",
    experience: "Hobbyist gardener with interest in native plant species"
  },
  {
    id: 5,
    name: "Jessica Park",
    email: "jessica.park@example.com",
    phone: "(555) 234-5678",
    role: "Marketing Specialist",
    skills: ["Graphic Design", "Content Creation", "Social Media Management"],
    availability: "Remote/Flexible",
    status: "rejected",
    appliedDate: "2025-03-18T10:20:00",
    location: "Southside",
    projectInterest: "Plastic-Free Community Challenge",
    experience: "10 years in marketing with 3 years focused on sustainability campaigns"
  },
  {
    id: 6,
    name: "Robert Thompson",
    email: "robert.thompson@example.com",
    phone: "(555) 345-6789",
    role: "Technical Support",
    skills: ["Web Development", "IT Support", "Data Analysis"],
    availability: "Evenings and Weekends",
    status: "approved",
    appliedDate: "2025-03-10T14:00:00",
    location: "Central District",
    projectInterest: "General Support",
    experience: "15 years in IT with interest in supporting environmental causes"
  }
];
