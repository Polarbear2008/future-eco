import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  FileText, 
  Users, 
  FolderKanban, 
  TrendingUp, 
  Calendar 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

const AdminDashboardPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const admin = useAdmin();
  const stats = admin.getDashboardStats();

  // Generate stats cards data
  const statsCards = [
    { 
      name: "Total Blog Posts", 
      value: stats.totalBlogPosts, 
      icon: FileText, 
      color: "bg-blue-500", 
      path: "/admin/blogs" 
    },
    { 
      name: "Active Projects", 
      value: stats.activeProjects, 
      icon: FolderKanban, 
      color: "bg-eco-green", 
      path: "/admin/projects" 
    },
    { 
      name: "Volunteer Applications", 
      value: stats.totalVolunteers, 
      icon: Users, 
      color: "bg-amber-500", 
      path: "/admin/volunteers" 
    },
    { 
      name: "Pending Applications", 
      value: stats.pendingVolunteers, 
      icon: TrendingUp, 
      color: "bg-purple-500", 
      path: "/admin/volunteers" 
    },
  ];

  // Generate recent activity data
  const generateRecentActivity = () => {
    const activities = [];
    
    // Add blog posts (most recent 2)
    admin.blogPosts.slice(0, 2).forEach(post => {
      activities.push({
        id: `blog-${post.id}`,
        type: "blog",
        title: post.title,
        date: post.date
      });
    });
    
    // Add volunteers (most recent 2)
    admin.volunteers.slice(0, 2).forEach(volunteer => {
      activities.push({
        id: `volunteer-${volunteer.id}`,
        type: "volunteer",
        name: volunteer.name,
        role: volunteer.role,
        date: volunteer.appliedDate
      });
    });
    
    // Add projects (most recent)
    admin.projects.slice(0, 1).forEach(project => {
      activities.push({
        id: `project-${project.id}`,
        type: "project",
        title: project.title,
        status: project.status.charAt(0).toUpperCase() + project.status.slice(1),
        date: new Date().toISOString() // Use current date as update date
      });
    });
    
    // Sort by date (most recent first)
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  const recentActivity = generateRecentActivity();

  // Generate upcoming events based on active projects
  const generateUpcomingEvents = () => {
    const events = [];
    const activeProjects = admin.projects.filter(p => p.status === "active");
    
    // Create events from active projects
    activeProjects.slice(0, 3).forEach((project, index) => {
      // Generate a future date for the event
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + (index + 1) * 7); // Each event is a week apart
      
      events.push({
        id: `event-${project.id}`,
        title: `${project.title} Volunteer Day`,
        date: eventDate.toISOString(),
        location: project.location
      });
    });
    
    return events;
  };
  
  const upcomingEvents = generateUpcomingEvents();

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).format(date);
  };

  // Calculate relative time for activity feed
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = currentTime;
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center mt-2 md:mt-0 text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <Link to={stat.path} key={stat.name}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`p-2 rounded-full mr-4 ${
                      activity.type === 'blog' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'volunteer' ? 'bg-amber-100 text-amber-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {activity.type === 'blog' ? <FileText className="h-5 w-5" /> :
                       activity.type === 'volunteer' ? <Users className="h-5 w-5" /> :
                       <FolderKanban className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium text-gray-900">
                          {activity.type === 'blog' ? activity.title :
                           activity.type === 'volunteer' ? activity.name :
                           activity.title}
                        </p>
                        <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {activity.type === 'blog' ? 'Blog Post' :
                           activity.type === 'volunteer' ? 'Volunteer' :
                           'Project'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {activity.type === 'volunteer' ? `Applied as ${activity.role}` :
                         activity.type === 'project' ? `Status: ${activity.status}` :
                         'New post published'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{getRelativeTime(activity.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
