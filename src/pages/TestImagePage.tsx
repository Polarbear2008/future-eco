import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTeam } from '../contexts/TeamContext';

const TestImagePage: React.FC = () => {
  const { teamMembers } = useTeam();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Test direct image loading
  const testImages = [
    { name: "Logo", path: "/logo.png" },
    { name: "Madiev Sardor", path: "/images/team/Madiev Sardor Kenja o'g'li.JPG" },
    { name: "Farhodova Fozila", path: "/images/team/Farhodova Fozila Uygunovna.jpg" }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Image Test Page</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Direct Image Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testImages.map((img, index) => (
            <div key={index} className="border rounded-lg overflow-hidden shadow-md">
              <div className="p-4 bg-gray-50">
                <h3 className="font-medium">{img.name}</h3>
                <p className="text-sm text-gray-500 break-all">{img.path}</p>
              </div>
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                <img 
                  src={img.path} 
                  alt={img.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    console.error(`Failed to load image: ${img.path}`);
                    (e.target as HTMLImageElement).src = "/logo.png";
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Team Members Image Test</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {teamMembers.slice(0, 12).map((member) => (
            <div 
              key={member.id} 
              className="border rounded-lg overflow-hidden shadow-md cursor-pointer"
              onClick={() => setSelectedImage(member.image)}
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-contain"
                  style={{ 
                    maxHeight: "100%",
                    maxWidth: "100%"
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${member.image}`);
                    (e.target as HTMLImageElement).src = `${window.location.origin}/logo.png`;
                    (e.target as HTMLImageElement).classList.add("p-4");
                  }}
                />
              </div>
              <div className="p-2 text-center">
                <p className="text-sm font-medium truncate">{member.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-medium">Image Preview</h3>
              <button onClick={() => setSelectedImage(null)} className="text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>
            <div className="p-4 flex items-center justify-center">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
            <div className="p-4 border-t">
              <p className="text-sm text-gray-500 break-all">{selectedImage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestImagePage;
