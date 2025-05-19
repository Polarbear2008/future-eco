import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  badge: string | null;
  link: string;
}

const ProjectCard = ({ title, description, image, badge, link }: ProjectCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {badge && (
          <Badge className="absolute top-3 right-3 bg-eco-green text-white hover:bg-eco-green-dark">
            {badge}
          </Badge>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-eco-green-dark">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        <Link 
          to={link}
          className="inline-flex items-center text-eco-green font-medium hover:text-eco-green-dark transition-colors"
        >
          Learn More <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
