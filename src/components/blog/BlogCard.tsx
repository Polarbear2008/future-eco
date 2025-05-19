import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { getValidImageUrl } from "@/services/uploadService";

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  id: string | number;
}

const BlogCard = ({ title, excerpt, image, date, category, id }: BlogCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
      <Link to={`/blog/${id}`} className="block relative h-52 overflow-hidden">
        <img
          src={getValidImageUrl(image)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.jpg'; // Fallback image
            target.onerror = null; // Prevent infinite loop
          }}
        />
      </Link>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="bg-eco-green/10 text-eco-green border-eco-green/20">
            {category}
          </Badge>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={14} className="mr-1" />
            <span>{date}</span>
          </div>
        </div>
        <Link to={`/blog/${id}`}>
          <h3 className="text-xl font-bold mb-2 text-eco-green-dark group-hover:text-eco-green transition-colors">{title}</h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        <Link 
          to={`/blog/${id}`}
          className="inline-block text-eco-green font-medium hover:text-eco-green-dark transition-colors"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
