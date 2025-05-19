import { Project } from "@/contexts/AdminContext";

export const mockProjects: Project[] = [
  {
    id: 1,
    title: "Urban Garden Initiative",
    description: "Creating community gardens in urban areas to promote sustainable food production and community engagement.",
    category: "Community",
    status: "active",
    progress: 65,
    startDate: "2025-01-15",
    endDate: "2025-06-30",
    location: "Downtown Metro Area",
    coordinator: "Sarah Williams",
    volunteers: 24,
    featured: true,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    title: "Clean Water Initiative",
    description: "Providing clean water solutions to communities in need through sustainable filtration systems.",
    category: "Conservation",
    status: "active",
    progress: 40,
    startDate: "2025-02-10",
    endDate: "2025-08-15",
    location: "Riverside Communities",
    coordinator: "Michael Chen",
    volunteers: 18,
    featured: true,
    image: "https://images.unsplash.com/photo-1500673922987-4542c06a5843?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "Renewable Energy Workshop Series",
    description: "Educational workshops teaching communities about renewable energy technologies and implementation.",
    category: "Education",
    status: "planning",
    progress: 15,
    startDate: "2025-04-05",
    endDate: "2025-10-20",
    location: "Community Centers",
    coordinator: "Emily Johnson",
    volunteers: 8,
    featured: false,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    title: "Wildlife Habitat Restoration",
    description: "Restoring natural habitats for local wildlife through native plant reintroduction and ecosystem management.",
    category: "Conservation",
    status: "active",
    progress: 80,
    startDate: "2024-11-20",
    endDate: "2025-05-15",
    location: "Northern Nature Reserve",
    coordinator: "David Rodriguez",
    volunteers: 32,
    featured: false,
    image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    title: "Plastic-Free Community Challenge",
    description: "Community initiative to reduce single-use plastics through education, alternatives, and policy advocacy.",
    category: "Waste Management",
    status: "completed",
    progress: 100,
    startDate: "2024-09-01",
    endDate: "2025-02-28",
    location: "Citywide",
    coordinator: "Lisa Park",
    volunteers: 45,
    featured: true,
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80"
  }
];
