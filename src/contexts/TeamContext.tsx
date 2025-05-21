import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the team member interface
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  category: string; // Added category field for grouping
}

interface TeamContextType {
  teamMembers: TeamMember[];
  updateTeamMemberPhoto: (id: number, imageUrl: string) => void;
  isLoading: boolean;
}

// Helper function to encode image paths
const encodeImagePath = (path: string): string => {
  // Split the path to preserve the /images/team/ part
  const parts = path.split('/');
  const filename = parts[parts.length - 1];
  // Encode only the filename part
  const encodedFilename = encodeURIComponent(filename);
  // Reconstruct the path
  parts[parts.length - 1] = encodedFilename;
  return parts.join('/');
};

// Helper function to check if an image exists and return the appropriate path
const getImagePath = (name: string): string => {
  // Map of team member names to their exact image filenames
  const imageMap: Record<string, string> = {
    "Abdugʻafurova Asal Shuxratjonovna": "Abdugʻafurova Asal Shuxratjonovna.jpg",
    "Alibek Toshmuratov Abdisattor oʻgʻli": "Alibek Toshmuratov Abdisattor oʻgʻli.JPG",
    "Asemay Asemova Maksudjanovna": "Asemay Asemova Maksudjanovna.jpg",
    "Ashurov Javohir": "Ashurov Javohir.JPG",
    "Barotova Shaxrizoda Yòldosh qizi": "Barotova Shaxrizoda Yòldosh qizi.jpg",
    "Bobonazarova Binafsha Behzodovna": "Bobonazarova Binafsha Behzodovna.jpg",
    "Bobomuratov Sardor Shuxrat o'g'li": "Bobumaratov Sardorbek Shuxrat o'g'li.jpg",
    "Boburbek Panjiev Boboyorovich": "Boburbek Panjiev Boboyorovich.JPG",
    "Boynazarova Shukrona Sheraliyevna": "Boynazarova Shukrona Sheraliyevna.jpg",
    "Charos Mamayusupova Barot qizi": "Charos Mamayusupova Barot qizi.jpg",
    "Choriyev Said Akhtam Sanjar o'g'li": "Choriyev Said Akhtam Sanjar o'g'li.png",
    "Choriyeva Hurzoda Sanjar qizi": "Choriyeva Hurzoda Sanjar qizi.jpg",
    "Eldorbek Safarov Muzaffarovich": "Eldorbek Safarov Muzaffarovich.jpg",
    "Ergashev Sardor": "Ergashev Sardor Azizjon o'g'li.JPG",
    "Eshmamatov Asilbek Oybek oʻgʻli": "Eshmamatov Asilbek Oybek oʻgʻli.JPG",
    "Eshmoʻminova Mushtariy Otabek qizi": "Eshmoʻminova Mushtariy Otabek qizi.jpg",
    "Farhodova Fozila Uygunovna": "Farhodova Fozila Uygunovna.jpg",
    "Farhodova Sora Uygunovna": "Farxodova Sora Uyg'unovna.jpg",
    "Fayzullayev Ramziddin Demir oʻgʻli": "Fayzullayev Ramziddin Demir o'g'li.jpg",
    "Firdavs Xudoyberdiyev Suxrob oʻgʻli": "Firdavs Xudoyberdiyev Suxrob o'g'li.jpg",
    "Gulboyev Muhammadali Sultonbek oʻgʻli": "Gulboyev Muhammadali Sultonbek òĝli.JPG",
    "Islamov Alisher Yusupovich": "Islamov Alisher Yusupovich.JPG",
    "Joʻrayev Dilnur Jasurovich": "Jo'rayev Dilnur Jasurovich.JPG",
    "Jumayev Zuhriddin Ikromjon o'g'li": "Jumayev Zuhriddin Ikromjon o'g'li.jpg",
    "Khurramov Asliddin Sharofutdin o'g'li": "Khurramov Asliddin.JPG",
    "Ko'charov Muhammad Ziyodullo oʻgʻli": "Ko'charov Muhammad Ziyodulla oʻgʻli.jpg",
    "Madiyev Sardor Kenja oʻgʻli": "Madiyev Sardor Kenja oʻgʻli.JPG",
    "Murotov Manuchekhr Sulaymonkulovich": "Murotov Manuchekhr Sulaymonkulovich.JPG",
    "Numonov Samandar Olimjon o'g'li": "Numonov Samandar Olimjon o'g'li.png",
    "Nurbek Salomov Choriyevich": "Nurbek Salomov Choriyevich.jpg",
    "Rizvonbek Hamroqulov Firoʻz oʻgʻli": "Rizvonbek Hamroqulov Firo'z o'g'li.png",
    "Roʻziyev Mirsaid Baxtiyor oʻgʻli": "Ro'ziyev Mirsaid Baxtiyor o'g'li.jpg",
    "Shohruh Tojiboyev Xoliyorovich": "Shohruh Tojiboyev Xoliyorovich.png",
    "To`rayev Sanjarbek Musayevich": "To`rayev Sanjarbek  Musayevich.jpg",
    "Tojinorova Sitora Muhammadi qizi": "Tojinorova Sitora Muhammadi qizi.jpg",
    "Toshtemirova Muxlisa Akmal qizi": "Toshtemirova Muxlisa Akmal qizi.jpeg",
    "Usmonbek Abdukhalimov Eshberdievich": "Usmonbek Abdukhalimov Eshberdiyevich.jpg",
    "Xayrullayeva Feruza Faxrullayevna": "Xayrullayeva Feruza Faxrullayevna.JPG",
    "Xo'janov Asliddin Muzaffarovich": "Xo'janov Asliddin Muzaffarovich.jpg",
    "Xo'janov Shohjahon Muzaffarovich": "Xo'janov Shohjahon Muzaffarovich.JPG"
  };

  // Check if the name has a mapped image
  if (imageMap[name]) {
    // In production, try to use the direct path first
    if (process.env.NODE_ENV === 'production') {
      const directPath = `/images/team/${imageMap[name]}`;
      console.log(`[PROD] Trying direct path for ${name}:`, directPath);
      return directPath;
    }
    
    // In development, use the encoded path
    const encodedPath = encodeImagePath(`/images/team/${imageMap[name]}`);
    console.log(`[DEV] Using encoded path for ${name}:`, encodedPath);
    return encodedPath;
  } else {
    // Return default logo for members without photos
    console.warn(`No image found for team member: ${name}`);
    return "/logo.png";
  }
};

// Updated team members with direct paths to uploaded images, organized by categories
const defaultTeamMembers: TeamMember[] = [
  // Founders
  {
    id: 1,
    name: "Madiyev Sardor Kenja oʻgʻli",
    role: "Founder",
    bio: "Sardor is one of the founding members of EcoFuture.",
    image: getImagePath("Madiyev Sardor Kenja oʻgʻli"),
    category: "Founders"
  },
  {
    id: 2,
    name: "Farhodova Fozila Uygunovna",
    role: "Founder",
    bio: "Fozila is one of the founding members of EcoFuture.",
    image: getImagePath("Farhodova Fozila Uygunovna"),
    category: "Founders"
  },
  
  // Logistics Coordinators
  {
    id: 3,
    name: "Xo'janov Shohjahon Muzaffarovich",
    role: "Head of Logistics Coordinators",
    bio: "Shohjahon leads the logistics team for our environmental projects.",
    image: getImagePath("Xo'janov Shohjahon Muzaffarovich"),
    category: "Logistics Coordinators"
  },
  {
    id: 4,
    name: "Jumayev Zuhriddin Ikromjon o'g'li",
    role: "Head of Logistics Coordinators",
    bio: "Zuhriddin co-leads the logistics team for our environmental initiatives.",
    image: getImagePath("Jumayev Zuhriddin Ikromjon o'g'li"),
    category: "Logistics Coordinators"
  },
  {
    id: 5,
    name: "Xayrullayeva Feruza Faxrullayevna",
    role: "Logistics Coordinator",
    bio: "Feruza manages logistics for our conservation initiatives.",
    image: getImagePath("Xayrullayeva Feruza Faxrullayevna"),
    category: "Logistics Coordinators"
  },
  {
    id: 6,
    name: "Eshmoʻminova Mushtariy Otabek qizi",
    role: "Logistics Coordinator",
    bio: "Mushtariy handles logistics for our environmental programs.",
    image: getImagePath("Eshmoʻminova Mushtariy Otabek qizi"),
    category: "Logistics Coordinators"
  },
  {
    id: 7,
    name: "Roʻziyev Mirsaid Baxtiyor oʻgʻli",
    role: "Logistics Coordinator",
    bio: "Mirsaid manages logistics for our environmental initiatives.",
    image: getImagePath("Roʻziyev Mirsaid Baxtiyor oʻgʻli"),
    category: "Logistics Coordinators"
  },
  {
    id: 8,
    name: "Farhodova Sora Uygunovna",
    role: "Logistics Coordinator",
    bio: "Sora coordinates logistics for our conservation programs.",
    image: getImagePath("Farhodova Sora Uygunovna"),
    category: "Logistics Coordinators"
  },
  {
    id: 9,
    name: "Choriyeva Hurzoda Sanjar qizi",
    role: "Logistics Coordinator",
    bio: "Hurzoda handles logistics for our environmental initiatives.",
    image: getImagePath("Choriyeva Hurzoda Sanjar qizi"),
    category: "Logistics Coordinators"
  },
  
  // Finance Managers
  {
    id: 10,
    name: "Bobomuratov Sardor Shuxrat o'g'li",
    role: "Head of Finance Manager",
    bio: "Sardor leads the financial management of our organization.",
    image: getImagePath("Bobomuratov Sardor Shuxrat o'g'li"),
    category: "Finance Managers"
  },
  {
    id: 11,
    name: "To`rayev Sanjarbek Musayevich",
    role: "Finance Manager",
    bio: "Sanjarbek manages the financial aspects of our organization.",
    image: getImagePath("To`rayev Sanjarbek Musayevich"),
    category: "Finance Managers"
  },
  {
    id: 12,
    name: "Asemay Asemova Maksudjanovna",
    role: "Finance Manager",
    bio: "Asemay oversees our financial planning and budgeting.",
    image: getImagePath("Asemay Asemova Maksudjanovna"),
    category: "Finance Managers"
  },
  
  // Designers
  {
    id: 13,
    name: "Numonov Samandar Olimjon o'g'li",
    role: "Head of Designers",
    bio: "Samandar leads the design team for our environmental initiatives.",
    image: getImagePath("Numonov Samandar Olimjon o'g'li"),
    category: "Designers"
  },
  {
    id: 14,
    name: "Fayzullayev Ramziddin Demir oʻgʻli",
    role: "Designer",
    bio: "Ramziddin creates visual designs for our campaigns and materials.",
    image: getImagePath("Fayzullayev Ramziddin Demir oʻgʻli"),
    category: "Designers"
  },
  {
    id: 15,
    name: "Islamov Alisher Yusupovich",
    role: "Designer",
    bio: "Alisher designs visual content for our environmental initiatives.",
    image: getImagePath("Islamov Alisher Yusupovich"),
    category: "Designers"
  },
  {
    id: 16,
    name: "Shohruh Tojiboyev Xoliyorovich",
    role: "Designer",
    bio: "Shohruh designs visual content for our environmental initiatives.",
    image: getImagePath("Shohruh Tojiboyev Xoliyorovich"),
    category: "Designers"
  },
  {
    id: 17,
    name: "Usmonbek Abdukhalimov Eshberdievich",
    role: "Designer",
    bio: "Usmonbek creates designs for our environmental campaigns.",
    image: getImagePath("Usmonbek Abdukhalimov Eshberdievich"),
    category: "Designers"
  },
  {
    id: 18,
    name: "Firdavs Xudoyberdiyev Suxrob oʻgʻli",
    role: "Designer",
    bio: "Firdavs creates designs for our conservation awareness materials.",
    image: getImagePath("Firdavs Xudoyberdiyev Suxrob oʻgʻli"),
    category: "Designers"
  },
  {
    id: 19,
    name: "Ko'charov Muhammad Ziyodullo oʻgʻli",
    role: "Designer",
    bio: "Muhammad creates visual content for our environmental initiatives.",
    image: getImagePath("Ko'charov Muhammad Ziyodullo oʻgʻli"),
    category: "Designers"
  },
  
  // Content Makers
  {
    id: 20,
    name: "Rizvonbek Hamroqulov Firoʻz oʻgʻli",
    role: "Head of Content Maker",
    bio: "Rizvonbek leads the content creation for our environmental campaigns.",
    image: getImagePath("Rizvonbek Hamroqulov Firoʻz oʻgʻli"),
    category: "Content Makers"
  },
  {
    id: 21,
    name: "Ergashev Sardor",
    role: "Content Maker",
    bio: "Sardor produces content for our conservation initiatives.",
    image: getImagePath("Ergashev Sardor"),
    category: "Content Makers"
  },
  {
    id: 22,
    name: "Murotov Manuchekhr Sulaymonkulovich",
    role: "Content Maker",
    bio: "Manuchekhr produces content for our conservation awareness campaigns.",
    image: getImagePath("Murotov Manuchekhr Sulaymonkulovich"),
    category: "Content Makers"
  },
  {
    id: 23,
    name: "Charos Mamayusupova Barot qizi",
    role: "Content Maker",
    bio: "Charos creates content for our environmental initiatives.",
    image: getImagePath("Charos Mamayusupova Barot qizi"),
    category: "Content Makers"
  },
  {
    id: 24,
    name: "Nurbek Salomov Choriyevich",
    role: "Content Maker",
    bio: "Nurbek produces content for our conservation programs.",
    image: getImagePath("Nurbek Salomov Choriyevich"),
    category: "Content Makers"
  },
  
  // Administration & Special Roles
  {
    id: 25,
    name: "Alibek Toshmuratov Abdisattor oʻgʻli",
    role: "Admin",
    bio: "Alibek manages administrative functions for our organization.",
    image: getImagePath("Alibek Toshmuratov Abdisattor oʻgʻli"),
    category: "Administration & Special Roles"
  },
  {
    id: 26,
    name: "Khurramov Asliddin Sharofutdin o'g'li",
    role: "Head of Mobilographs",
    bio: "Asliddin leads the mobile photography team for our environmental projects.",
    image: getImagePath("Khurramov Asliddin Sharofutdin o'g'li"),
    category: "Administration & Special Roles"
  },
  {
    id: 27,
    name: "Boburbek Panjiev Boboyorovich",
    role: "Mobilograph",
    bio: "Boburbek handles mobile photography for our environmental initiatives.",
    image: getImagePath("Boburbek Panjiev Boboyorovich"),
    category: "Administration & Special Roles"
  },
  
  // Volunteers
  {
    id: 28,
    name: "Barotova Shaxrizoda Yòldosh qizi",
    role: "Head of Volunteers",
    bio: "Shaxrizoda leads and coordinates our volunteer programs.",
    image: getImagePath("Barotova Shaxrizoda Yòldosh qizi"),
    category: "Volunteers"
  },
  {
    id: 29,
    name: "Eshmamatov Asilbek Oybek oʻgʻli",
    role: "Volunteer",
    bio: "Asilbek volunteers for our environmental conservation initiatives.",
    image: getImagePath("Eshmamatov Asilbek Oybek oʻgʻli"),
    category: "Volunteers"
  },
  {
    id: 30,
    name: "Ashurov Javohir",
    role: "Volunteer",
    bio: "Javohir volunteers for our conservation programs.",
    image: getImagePath("Ashurov Javohir"),
    category: "Volunteers"
  },
  {
    id: 31,
    name: "Joʻrayev Dilnur Jasurovich",
    role: "Volunteer",
    bio: "Dilnur volunteers for our environmental initiatives.",
    image: getImagePath("Joʻrayev Dilnur Jasurovich"),
    category: "Volunteers"
  },
  {
    id: 32,
    name: "Abdugʻafurova Asal Shuxratjonovna",
    role: "Volunteer",
    bio: "Asal volunteers for our conservation awareness campaigns.",
    image: getImagePath("Abdugʻafurova Asal Shuxratjonovna"),
    category: "Volunteers"
  },
  {
    id: 33,
    name: "Tojinorova Sitora Muhammadi qizi",
    role: "Volunteer",
    bio: "Sitora volunteers for our environmental programs.",
    image: getImagePath("Tojinorova Sitora Muhammadi qizi"),
    category: "Volunteers"
  },
  {
    id: 34,
    name: "Bobonazarova Binafsha Behzodovna",
    role: "Volunteer",
    bio: "Binafsha volunteers for our conservation initiatives.",
    image: getImagePath("Bobonazarova Binafsha Behzodovna"),
    category: "Volunteers"
  },
  {
    id: 35,
    name: "Choriyev Said Akhtam Sanjar o'g'li",
    role: "Volunteer",
    bio: "Said volunteers for our environmental programs.",
    image: getImagePath("Choriyev Said Akhtam Sanjar o'g'li"),
    category: "Volunteers"
  },
  {
    id: 36,
    name: "Boynazarova Shukrona Sheraliyevna",
    role: "Volunteer",
    bio: "Shukrona volunteers for our environmental conservation initiatives.",
    image: getImagePath("Boynazarova Shukrona Sheraliyevna"),
    category: "Volunteers"
  },
  {
    id: 37,
    name: "Gulboyev Muhammadali Sultonbek oʻgʻli",
    role: "Volunteer",
    bio: "Muhammadali volunteers for our environmental initiatives.",
    image: getImagePath("Gulboyev Muhammadali Sultonbek oʻgʻli"),
    category: "Volunteers"
  },
  {
    id: 38,
    name: "Xo'janov Asliddin Muzaffarovich",
    role: "Volunteer",
    bio: "Asliddin volunteers for our conservation programs.",
    image: getImagePath("Xo'janov Asliddin Muzaffarovich"),
    category: "Volunteers"
  },
  {
    id: 39,
    name: "Eldorbek Safarov Muzaffarovich",
    role: "Volunteer",
    bio: "Eldorbek volunteers for our environmental initiatives.",
    image: getImagePath("Eldorbek Safarov Muzaffarovich"),
    category: "Volunteers"
  },
  {
    id: 40,
    name: "Toshtemirova Muxlisa Akmal qizi",
    role: "Volunteer",
    bio: "Muxlisa volunteers for our conservation awareness campaigns.",
    image: getImagePath("Toshtemirova Muxlisa Akmal qizi"),
    category: "Volunteers"
  },
  {
    id: 41,
    name: "Numonov Samandar Olimjon o'g'li",
    role: "Volunteer",
    bio: "Samandar is an active volunteer contributing to our environmental initiatives.",
    image: getImagePath("Numonov Samandar Olimjon o'g'li"),
    category: "Volunteers"
  }
];

// Create the context
const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Provider component
export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load team members from localStorage or use default
    const loadTeamMembers = () => {
      try {
        const savedTeamMembers = localStorage.getItem('teamMembers');
        if (savedTeamMembers) {
          setTeamMembers(JSON.parse(savedTeamMembers));
        } else {
          setTeamMembers(defaultTeamMembers);
          localStorage.setItem('teamMembers', JSON.stringify(defaultTeamMembers));
        }
      } catch (error) {
        console.error("Error loading team members:", error);
        setTeamMembers(defaultTeamMembers);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamMembers();
  }, []);

  // Update team member photo
  const updateTeamMemberPhoto = (id: number, imageUrl: string) => {
    setTeamMembers(prevMembers => {
      const updatedMembers = prevMembers.map(member => 
        member.id === id ? { ...member, image: imageUrl } : member
      );
      
      // Save to localStorage
      localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
      
      return updatedMembers;
    });
  };

  return (
    <TeamContext.Provider value={{ teamMembers, updateTeamMemberPhoto, isLoading }}>
      {children}
    </TeamContext.Provider>
  );
};

// Custom hook to use the team context
export const useTeam = (): TeamContextType => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
