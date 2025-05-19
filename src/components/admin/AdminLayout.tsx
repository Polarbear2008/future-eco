import { ReactNode, useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  FolderKanban, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Upload 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock authentication - in a real app, use a proper auth system
const useAuth = () => {
  // For demo purposes, we'll assume the user is logged in
  // In a real app, this would check for a valid session
  return { isAuthenticated: true };
};

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Blog Posts', href: '/admin/blogs', icon: FileText },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Volunteers', href: '/admin/volunteer-list', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Test Upload', href: '/admin/test-upload', icon: Upload },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link to="/admin" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Eco Future Logo" className="h-8 w-auto" />
            <span className="text-lg font-semibold text-eco-green-dark">Admin</span>
          </Link>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/admin' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-eco-green/10 text-eco-green" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-eco-green" : "text-gray-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start text-gray-700 hover:text-red-600"
            asChild
          >
            <Link to="/">
              <LogOut className="mr-3 h-5 w-5" />
              Back to Site
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-eco-green flex items-center justify-center text-white">
                    A
                  </div>
                  <span className="text-sm font-medium text-gray-700">Admin User</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
