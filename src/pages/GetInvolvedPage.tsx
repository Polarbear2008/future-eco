import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, HandHeart, DollarSign, Mail, Users, Clock, Leaf, TreePine, Sprout, Droplets } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { submitVolunteerApplication } from "@/services/volunteerService";
import { useState } from "react";

const GetInvolvedPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    availability: "",
    skills: [],
    message: "",
    amount: "25"
  });
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, availability: value }));
  };

  const handleSkillsChange = (skill: string) => {
    setFormData(prev => {
      const skills = [...prev.skills] as string[];
      
      if (skills.includes(skill)) {
        return { ...prev, skills: skills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...skills, skill] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email) {
        throw new Error("Name and email are required");
      }
      
      // Map form data to match the Volunteer type in Supabase
      const volunteerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        skills: formData.skills.length > 0 ? formData.skills : null,
        availability: formData.availability || null,
        experience: formData.reason || null, // Using reason field as experience
        project_interest: formData.message || null, // Using message field as project interest
        role: 'Volunteer applicant' // Adding default role
      };
      
      console.log('Submitting volunteer application with data:', volunteerData);
      
      const result = await submitVolunteerApplication(volunteerData);
      
      if (!result) {
        throw new Error("Failed to submit volunteer application");
      }
      
      toast({
        title: "Application Submitted",
        description: "Thank you for your interest in volunteering with EcoFuture!",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        reason: "",
        availability: "",
        skills: [],
        message: "",
        amount: "25"
      });
    } catch (error) {
      console.error("Error submitting volunteer application:", error);
      toast({
        title: "Error Submitting Form",
        description: error instanceof Error ? error.message : "There was an error submitting your application. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonationAmountChange = (value: string) => {
    setFormData(prev => ({ ...prev, amount: value }));
  };

  const opportunities = [
    {
      id: 1,
      title: "Tree Planting Volunteer",
      description: "Join our reforestation efforts by planting trees in affected areas.",
      commitment: "Weekends, 3-4 hours",
      location: "Various locations",
      skills: "No experience necessary",
      icon: <Users size={24} />
    },
    {
      id: 2,
      title: "Community Garden Assistant",
      description: "Help maintain community gardens and educate visitors about sustainable gardening.",
      commitment: "Flexible, 2-10 hours per week",
      location: "Urban garden sites",
      skills: "Basic gardening knowledge helpful",
      icon: <Clock size={24} />
    },
    {
      id: 3,
      title: "Environmental Educator",
      description: "Lead workshops and educational sessions on environmental topics.",
      commitment: "Scheduled events, 2-6 hours",
      location: "Schools and community centers",
      skills: "Teaching experience, environmental knowledge",
      icon: <CalendarDays size={24} />
    },
    {
      id: 4,
      title: "Administrative Support",
      description: "Assist with office tasks, event organization, and communications.",
      commitment: "Flexible, 5-15 hours per week",
      location: "Ecofuture office or remote",
      skills: "Organizational skills, computer literacy",
      icon: <Mail size={24} />
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="h-[60vh] min-h-[400px] relative flex items-center">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80')",
            backgroundPosition: "center",
          }}
        ></div>
        
        <div className="container-custom relative z-20 text-white mt-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Get Involved</h1>
            <p className="text-xl md:text-2xl mb-0 text-white/90 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              There are many ways to support our mission and make a positive impact on the environment.
            </p>
          </div>
        </div>
      </section>

      {/* Ways to Get Involved Tabs */}
      <section className="py-20 mt-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-eco-green-dark">How You Can Help</h2>
            <p className="text-xl text-gray-700">
              Whether you want to volunteer your time, make a donation, or attend our events, there are many ways to contribute.
            </p>
          </div>
          
          <Tabs defaultValue="volunteer" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
              <TabsTrigger value="volunteer" className="flex items-center gap-2">
                <HandHeart size={18} />
                <span>Volunteer</span>
              </TabsTrigger>
              <TabsTrigger value="donate" className="flex items-center gap-2">
                <DollarSign size={18} />
                <span>Donate</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <CalendarDays size={18} />
                <span>Events</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Volunteer Tab */}
            <TabsContent value="volunteer" className="mt-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-eco-green-dark">Volunteer Opportunities</h3>
                  <div className="space-y-6">
                    {opportunities.map(opportunity => (
                      <div key={opportunity.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-eco-green/10 rounded-full flex items-center justify-center mr-4 mt-1">
                            {opportunity.icon}
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold mb-2 text-eco-green-dark">{opportunity.title}</h4>
                            <p className="text-gray-700 mb-4">{opportunity.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-eco-earth-dark">Time Commitment:</span>
                                <p className="text-gray-600">{opportunity.commitment}</p>
                              </div>
                              <div>
                                <span className="font-medium text-eco-earth-dark">Location:</span>
                                <p className="text-gray-600">{opportunity.location}</p>
                              </div>
                              <div>
                                <span className="font-medium text-eco-earth-dark">Skills Needed:</span>
                                <p className="text-gray-600">{opportunity.skills}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-eco-stone/30 p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-6 text-eco-green-dark">Volunteer Application</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          placeholder="Your full name" 
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          placeholder="Your email address" 
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          placeholder="Your phone number" 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="reason">Why do you want to volunteer?</Label>
                        <Textarea 
                          id="reason" 
                          name="reason" 
                          value={formData.reason} 
                          onChange={handleChange} 
                          placeholder="Tell us about your motivation" 
                          required 
                        />
                      </div>
                      
                      <div>
                        <div className="mb-3">
                          <Label>Availability</Label>
                        </div>
                        <RadioGroup 
                          value={formData.availability} 
                          onValueChange={handleRadioChange}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="weekdays" id="weekdays" />
                            <Label htmlFor="weekdays">Weekdays</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="weekends" id="weekends" />
                            <Label htmlFor="weekends">Weekends</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="both" />
                            <Label htmlFor="both">Both</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <div className="mb-3">
                          <Label>Skills & Interests (Select all that apply)</Label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="gardening" 
                              checked={(formData.skills as string[]).includes("gardening")}
                              onCheckedChange={() => handleSkillsChange("gardening")}
                            />
                            <Label htmlFor="gardening">Gardening</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="teaching" 
                              checked={(formData.skills as string[]).includes("teaching")}
                              onCheckedChange={() => handleSkillsChange("teaching")}
                            />
                            <Label htmlFor="teaching">Teaching</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="admin" 
                              checked={(formData.skills as string[]).includes("admin")}
                              onCheckedChange={() => handleSkillsChange("admin")}
                            />
                            <Label htmlFor="admin">Administrative</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="photography" 
                              checked={(formData.skills as string[]).includes("photography")}
                              onCheckedChange={() => handleSkillsChange("photography")}
                            />
                            <Label htmlFor="photography">Photography</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="marketing" 
                              checked={(formData.skills as string[]).includes("marketing")}
                              onCheckedChange={() => handleSkillsChange("marketing")}
                            />
                            <Label htmlFor="marketing">Marketing</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="manual" 
                              checked={(formData.skills as string[]).includes("manual")}
                              onCheckedChange={() => handleSkillsChange("manual")}
                            />
                            <Label htmlFor="manual">Manual Labor</Label>
                          </div>
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full bg-eco-green hover:bg-eco-green-dark text-white" disabled={isSubmitting}>
                        Submit Application
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </TabsContent>
            
            {/* Donate Tab */}
            <TabsContent value="donate" className="mt-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-eco-green-dark">Support Our Mission</h3>
                  <p className="text-gray-700 mb-6">
                    Your donations help us continue our environmental conservation efforts, community education programs, and sustainability initiatives.
                  </p>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
                    <h4 className="text-xl font-semibold mb-4 text-eco-green-dark">How Your Donation Helps</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-8 h-8 bg-eco-green/10 rounded-full flex items-center justify-center mr-3 mt-1">
                          <span className="text-eco-green-dark"><Leaf className="h-4 w-4" /></span>
                        </div>
                        <div>
                          <p className="text-gray-700">Provides educational materials and workshops for schools to promote environmental awareness.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-8 h-8 bg-eco-green/10 rounded-full flex items-center justify-center mr-3 mt-1">
                          <span className="text-eco-green-dark"><TreePine className="h-4 w-4" /></span>
                        </div>
                        <div>
                          <p className="text-gray-700">Plants native trees in reforestation areas to combat deforestation and climate change.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-8 h-8 bg-eco-green/10 rounded-full flex items-center justify-center mr-3 mt-1">
                          <span className="text-eco-green-dark"><Sprout className="h-4 w-4" /></span>
                        </div>
                        <div>
                          <p className="text-gray-700">Supports community gardens that provide fresh produce and green spaces in urban areas.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-8 h-8 bg-eco-green/10 rounded-full flex items-center justify-center mr-3 mt-1">
                          <span className="text-eco-green-dark"><Droplets className="h-4 w-4" /></span>
                        </div>
                        <div>
                          <p className="text-gray-700">Funds clean water systems for communities in need, ensuring access to safe drinking water.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h4 className="text-xl font-semibold mb-4 text-eco-green-dark">Other Ways to Give</h4>
                    <ul className="space-y-4">
                      <li>
                        <h5 className="font-medium text-eco-earth-dark mb-1">Monthly Giving</h5>
                        <p className="text-gray-700">
                          Become a sustaining member with a recurring monthly donation to provide consistent support.
                        </p>
                      </li>
                      <li>
                        <h5 className="font-medium text-eco-earth-dark mb-1">Corporate Matching</h5>
                        <p className="text-gray-700">
                          Many employers match charitable contributions. Check if your company offers this program.
                        </p>
                      </li>
                      <li>
                        <h5 className="font-medium text-eco-earth-dark mb-1">Planned Giving</h5>
                        <p className="text-gray-700">
                          Include Ecofuture in your estate planning to create a lasting environmental legacy.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-eco-stone/30 p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-6 text-eco-green-dark">Make a Donation</h3>
                  
                  <div className="text-gray-700 mb-8">
                    <p className="mb-4">
                      We've made donating simple! Just click the button below to connect with our Telegram bot.
                    </p>
                    <p className="mb-4">
                      Our Telegram bot will guide you through the donation process in a few simple steps:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-6">
                      <li>Choose your donation amount</li>
                      <li>Select payment method</li>
                      <li>Complete your donation securely</li>
                    </ul>
                    <p className="italic">
                      All donations are tax-deductible as Ecofuture is a registered non-profit organization.
                    </p>
                  </div>
                  
                  <a 
                    href="https://t.me/ecofuturebot" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full block"
                  >
                    <Button 
                      type="button" 
                      className="w-full bg-eco-earth hover:bg-eco-earth-dark text-white py-6 text-lg"
                    >
                      Donate via Telegram Bot
                    </Button>
                  </a>
                  
                  <div className="text-center text-sm text-gray-500 mt-6">
                    <p>Ecofuture is a registered non-profit organization. All donations are tax-deductible.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Events Tab */}
            <TabsContent value="events" className="mt-10">
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">
                <div className="lg:col-span-4">
                  <h3 className="text-2xl font-bold mb-6 text-eco-green-dark">Upcoming Events</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                      <div className="flex items-start">
                        <div className="w-16 h-16 bg-eco-green flex flex-col items-center justify-center text-white rounded-lg mr-4">
                          <span className="text-xl font-bold">14</span>
                          <span className="text-sm">Apr</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2 text-eco-green-dark">Community Tree Planting</h4>
                          <p className="text-gray-700 mb-3">
                            Join us for a day of tree planting at Main Park. No experience necessary, tools and guidance provided. Help us make our community greener!
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                            <div>
                              <span className="font-medium text-eco-earth-dark">When:</span>
                              <p className="text-gray-600">April 14, 2025 • 9:00 AM - 1:00 PM</p>
                            </div>
                            <div>
                              <span className="font-medium text-eco-earth-dark">Where:</span>
                              <p className="text-gray-600">Main Park</p>
                            </div>
                          </div>
                          <a 
                            href="https://t.me/ecofuturebot" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button className="bg-eco-green hover:bg-eco-green-dark text-white">
                              Register to Attend
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-3 bg-eco-stone/30 p-8 rounded-lg h-fit">
                  <h3 className="text-2xl font-bold mb-6 text-eco-green-dark">Connect With Us</h3>
                  <p className="text-gray-700 mb-6">
                    Stay connected and join the conversation about environmental issues and events.
                  </p>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold mb-4 text-eco-green-dark">Follow Us on Social Media</h4>
                    <div className="flex space-x-4">
                      {/* LinkedIn */}
                      <a 
                        href="https://www.linkedin.com/in/ecofuture-foreveryone-2a51bb359/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-10 h-10 bg-eco-green/10 rounded-full flex items-center justify-center text-eco-green-dark hover:bg-eco-green hover:text-white transition-colors"
                        aria-label="LinkedIn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                      </svg>
                      </a>
                      
                      {/* Telegram */}
                      <a 
                        href="https://t.me/future_eco" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-eco-green/10 rounded-full flex items-center justify-center text-eco-green-dark hover:bg-eco-green hover:text-white transition-colors"
                        aria-label="Telegram"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"/>
                      </svg>
                      </a>
                      
                      {/* Instagram */}
                      <a 
                        href="https://www.instagram.com/eco_future_for_everyone?igshid=bmxkN2RyenlhdW16" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-eco-green/10 rounded-full flex items-center justify-center text-eco-green-dark hover:bg-eco-green hover:text-white transition-colors"
                        aria-label="Instagram"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                      </svg>
                      </a>
                      
                      {/* YouTube */}
                      <a 
                        href="https://www.youtube.com/@EcoFutureforeveryone" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-eco-green/10 rounded-full flex items-center justify-center text-eco-green-dark hover:bg-eco-green hover:text-white transition-colors"
                        aria-label="YouTube"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                      </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default GetInvolvedPage;
