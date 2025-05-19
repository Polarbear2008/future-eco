import { Award, Calendar, Heart, Check, User, Linkedin, Twitter, Mail } from "lucide-react";
import CTA from "@/components/home/CTA";
import { useTeam } from "@/contexts/TeamContext";
import { useEffect } from "react";
import { motion } from "framer-motion";

const AboutPage = () => {
  const { teamMembers, isLoading } = useTeam();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const timeline = [
    {
      year: "February 20, 2025",
      title: "Club Inception",
      description: "The idea for EcoFuture was born, with a vision to create positive environmental change through community action."
    },
    {
      year: "February 27, 2025",
      title: "Team Formation",
      description: "The full EcoFuture team was created, bringing together passionate individuals dedicated to environmental sustainability."
    },
    {
      year: "February 28, 2025",
      title: "First Team Meeting",
      description: "Our first official team meeting marked the beginning of our collaborative journey toward environmental impact."
    },
    {
      year: "March 2025",
      title: "Initial Projects",
      description: "Launched our first environmental initiatives and began building our community presence."
    },
    {
      year: "March 29, 2025",
      title: "Digital Presence",
      description: "Established our online platform to reach a wider audience and share our environmental mission."
    },
  ];

  return (
    <div className="overflow-hidden">
      <section className="py-12 md:py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            >
              About EcoFuture
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 mb-8"
            >
              We're on a mission to create a sustainable future through
              community-driven environmental initiatives.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-6 text-gray-900"
            >
              Our Mission
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-gray-600 mb-8"
            >
              At EcoFuture, we believe that sustainable environmental change
              starts at the community level. Our mission is to empower local
              communities to take action against climate change and
              environmental degradation through education, collaborative
              projects, and sustainable practices.
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold mb-6 text-gray-900"
            >
              Our Vision
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-600 mb-8"
            >
              We envision a world where communities work together to create
              sustainable environments, where ecological balance is restored,
              and where future generations can thrive in harmony with nature.
              Through our collective efforts, we aim to build a network of
              environmentally conscious communities that drive positive change
              on a global scale.
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl font-bold mb-6 text-gray-900"
            >
              Our Values
            </motion.h2>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-lg text-gray-600 mb-8 space-y-4 list-disc pl-6"
            >
              <li>
                <span className="font-semibold">Community Engagement:</span> We
                believe in the power of community-driven change and actively
                involve local communities in our initiatives.
              </li>
              <li>
                <span className="font-semibold">Sustainability:</span> We
                promote sustainable practices that meet present needs without
                compromising the ability of future generations to meet their
                own needs.
              </li>
              <li>
                <span className="font-semibold">Education:</span> We are
                committed to raising awareness and providing education about
                environmental issues and solutions.
              </li>
              <li>
                <span className="font-semibold">Collaboration:</span> We foster
                partnerships with individuals, organizations, and governments
                to maximize our impact.
              </li>
              <li>
                <span className="font-semibold">Innovation:</span> We encourage
                innovative approaches to environmental challenges and support
                the development of new sustainable technologies.
              </li>
            </motion.ul>
          </div>
        </div>
      </section>

      <section className="py-12 bg-green-50">
        <div className="container px-4 mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-12 text-center text-gray-900"
          >
            Meet Our Team
          </motion.h2>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Loading team members...</p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Group team members by category */}
              {Array.from(new Set(teamMembers.map(member => member.category))).map((category, categoryIndex) => (
                <div key={category} className="mb-12">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * categoryIndex }}
                    className="text-2xl font-bold mb-8 text-center text-gray-800 border-b-2 border-green-500 pb-2 max-w-xs mx-auto"
                  >
                    {category}
                  </motion.h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {teamMembers
                      .filter(member => member.category === category)
                      .map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-contain bg-gray-50 transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                console.error(`Failed to load image: ${member.image}`);
                                // Fallback to logo if image fails to load
                                (e.target as HTMLImageElement).src = "/logo.png";
                              }}
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-semibold mb-1 text-gray-900">
                              {member.name}
                            </h3>
                            <p className="text-green-600 mb-3">{member.role}</p>
                            <p className="text-gray-600 text-sm">{member.bio}</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-eco-green-dark text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Journey</h2>
            <p className="text-xl text-white/80">
              From humble beginnings to where we are today, our story is one of passion, perseverance, and impact.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline vertical line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-eco-green"></div>
            
            {/* Timeline items */}
            {timeline.map((item, index) => (
              <div key={index} className="mb-12 relative">
                <div className="md:flex items-center">
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'}`}>
                    <div className={`bg-eco-green/20 p-6 rounded-lg ${index % 2 === 0 ? 'md:mr-10' : 'md:ml-10'}`}>
                      <div className="flex items-center justify-center md:justify-start mb-3">
                        <Calendar size={18} className="mr-2" />
                        <span className="font-bold">{item.year}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-white/80">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-eco-green flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA 
        title="Join Our Mission"
        description="Become a part of our team and help us create a more sustainable future for our planet."
        buttonText="Get Involved"
        buttonLink="/get-involved"
        bgColor="bg-eco-earth"
        textColor="text-white"
      />
    </div>
  );
};

export default AboutPage;
