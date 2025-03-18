import { useState, ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Route, 
  Truck,
  Warehouse, 
  TrendingUp, 
  Cloud, 
  FileText, 
  Settings,
  Menu,
  Bell,
  Search,
  BrainCircuit,
  Navigation,
  Map,
  Shield,
  Leaf,
  ShieldAlert,
  ArrowUpDown,
  BarChart,
  LineChart,
  PieChart,
  MapPin,
  Users,
  LogOut,
  Package,
  ClipboardCheck,
  CalendarClock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import MobileNav from "@/components/ui/mobile-nav";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserRole } from "@/utils/auth";
import { Separator } from "@/components/ui/separator";

interface SidebarItemProps {
  icon: ReactNode;
  href: string;
  label: string;
  active: boolean;
}

const SidebarItem = ({ icon, href, label, active }: SidebarItemProps) => {
  return (
    <li className="mb-2">
      <Link href={href}>
        <div
          className={cn(
            "flex items-center py-2 px-4 rounded-r-lg transition-colors duration-200 cursor-pointer",
            active
              ? "bg-primary-light text-white font-medium"
              : "hover:bg-primary-light/70 text-white"
          )}
        >
          <span className="mr-3">{icon}</span>
          {label}
        </div>
      </Link>
    </li>
  );
};

interface SidebarLayoutProps {
  children: ReactNode;
}

// Define navigation items for each role
const navigationByRole: Record<UserRole, { icon: ReactNode; href: string; label: string; id: string }[]> = {
  warehouse_staff: [
    { icon: <LayoutDashboard size={20} />, href: "/warehouse-dashboard", label: "Dashboard", id: "warehouse-dashboard" },
    { icon: <Package size={20} />, href: "/supply-chain", label: "Inventory", id: "warehouse-inventory" },
    { icon: <ClipboardCheck size={20} />, href: "/supply-chain?view=shipments", label: "Shipments", id: "warehouse-shipments" },
    { icon: <Cloud size={20} />, href: "/weather-impact", label: "Weather Alerts", id: "warehouse-weather" },
  ],
  logistics_manager: [
    { icon: <LayoutDashboard size={20} />, href: "/dashboard", label: "Overview", id: "logistics-dashboard" },
    { icon: <Route size={20} />, href: "/routes", label: "Route Optimization", id: "logistics-routes" },
    { icon: <Navigation size={20} />, href: "/hyper-local-routing", label: "Hyper-Local Routing", id: "logistics-hyper-local" },
    { icon: <Warehouse size={20} />, href: "/supply-chain", label: "Supply Chain", id: "logistics-supply-chain" },
    { icon: <TrendingUp size={20} />, href: "/demand-forecasting", label: "Demand Forecasting", id: "logistics-demand" },
    { icon: <Cloud size={20} />, href: "/weather-impact", label: "Weather Impact", id: "logistics-weather" },
    { icon: <BrainCircuit size={20} />, href: "/ai-analytics", label: "AI Analytics", id: "logistics-ai" },
    { icon: <Shield size={20} />, href: "/supply-chain-resilience", label: "Supply Chain Resilience", id: "logistics-resilience" },
    { icon: <ArrowUpDown size={20} />, href: "/multi-modal-logistics", label: "Multi-Modal Logistics", id: "logistics-multi-modal" },
    { icon: <FileText size={20} />, href: "/reports", label: "Reports", id: "logistics-reports" },
  ],
  driver: [
    { icon: <LayoutDashboard size={20} />, href: "/driver-dashboard", label: "Dashboard", id: "driver-dashboard" },
    { icon: <Route size={20} />, href: "/routes", label: "My Routes", id: "driver-routes" },
    { icon: <Navigation size={20} />, href: "/hyper-local-routing", label: "Navigation", id: "driver-navigation" },
    { icon: <Cloud size={20} />, href: "/weather-impact", label: "Weather Alerts", id: "driver-weather" },
    { icon: <CalendarClock size={20} />, href: "/driver-dashboard?view=schedule", label: "Schedule", id: "driver-schedule" },
  ],
  sales: [
    { icon: <LayoutDashboard size={20} />, href: "/dashboard", label: "Dashboard", id: "sales-dashboard" },
    { icon: <TrendingUp size={20} />, href: "/demand-forecasting", label: "Demand Analysis", id: "sales-demand" },
    { icon: <Users size={20} />, href: "/western-sydney-users", label: "Western Sydney Users", id: "sales-users" },
    { icon: <MapPin size={20} />, href: "/western-sydney-users?view=map", label: "Client Map", id: "sales-map" },
    { icon: <BarChart size={20} />, href: "/business-dashboard", label: "Sales Analytics", id: "sales-analytics" },
    { icon: <FileText size={20} />, href: "/reports", label: "Reports", id: "sales-reports" },
  ],
  business_owner: [
    { icon: <LayoutDashboard size={20} />, href: "/business-dashboard", label: "Executive Dashboard", id: "owner-dashboard" },
    { icon: <BrainCircuit size={20} />, href: "/ai-analytics", label: "AI Analytics", id: "owner-ai" },
    { icon: <Shield size={20} />, href: "/supply-chain-resilience", label: "Resilience Planning", id: "owner-resilience" },
    { icon: <Leaf size={20} />, href: "/sustainability", label: "Sustainability", id: "owner-sustainability" },
    { icon: <ShieldAlert size={20} />, href: "/cybersecurity", label: "Cybersecurity", id: "owner-security" },
    { icon: <TrendingUp size={20} />, href: "/demand-forecasting", label: "Market Forecasting", id: "owner-forecasting" },
    { icon: <FileText size={20} />, href: "/reports", label: "Reports & Analytics", id: "owner-reports" },
    { icon: <Users size={20} />, href: "/western-sydney-users", label: "Western Sydney Market", id: "owner-market" },
  ]
};

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("logistics_manager");
  const [userName, setUserName] = useState("User");
  const [userInitials, setUserInitials] = useState("U");

  useEffect(() => {
    // Get user info from session storage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role || "logistics_manager");
        setUserName(user.name || user.username || "User");
        
        // Set initials
        if (user.name) {
          const nameParts = user.name.split(' ');
          const initials = nameParts.length > 1 
            ? `${nameParts[0][0]}${nameParts[1][0]}`
            : user.name.substring(0, 2);
          setUserInitials(initials.toUpperCase());
        } else if (user.username) {
          setUserInitials(user.username.substring(0, 2).toUpperCase());
        }
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  };

  const roleNavigation = navigationByRole[userRole] || [];
  
  // Role-specific titles
  const roleTitles: Record<UserRole, string> = {
    warehouse_staff: "Warehouse Portal",
    logistics_manager: "Logistics Command",
    driver: "Driver Portal",
    sales: "Sales Dashboard",
    business_owner: "Executive Suite"
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-primary text-white w-64 flex-shrink-0 flex flex-col",
          isMobile ? "fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out" : "hidden md:flex",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="p-4 flex items-center border-b border-primary-light/30">
          <Route className="mr-3 h-6 w-6" />
          <h1 className="text-xl font-bold">AI Logistics Hub</h1>
        </div>
        
        <div className="py-3 px-4">
          <span className="text-sm text-blue-200 font-medium">{roleTitles[userRole]}</span>
        </div>
        
        <nav className="mt-2 flex-1 overflow-y-auto">
          <ul>
            {roleNavigation.map((item) => (
              <SidebarItem 
                key={item.id}
                icon={item.icon} 
                href={item.href} 
                label={item.label} 
                active={location === item.href || location.startsWith(item.href + "?")} 
              />
            ))}
          </ul>
          
          <Separator className="my-4 bg-primary-light/30" />
          
          <ul>
            <SidebarItem 
              key="settings"
              icon={<Settings size={20} />} 
              href="/settings" 
              label="Settings" 
              active={location === "/settings"} 
            />
            <li className="mb-2">
              <div
                className="flex items-center py-2 px-4 rounded-r-lg transition-colors duration-200 cursor-pointer hover:bg-red-700 text-white"
                onClick={handleLogout}
              >
                <span className="mr-3"><LogOut size={20} /></span>
                Logout
              </div>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-primary-light/30 mt-auto">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-gray-300">
                {userRole.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4 md:py-2">
          <div className="flex items-center md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-bold ml-3">AI Logistics Hub</h1>
          </div>
          
          <div className="flex items-center ml-auto">
            <div className="relative mr-4 hidden md:block">
              <Input
                type="text"
                placeholder="Search..."
                className="bg-gray-100 rounded-lg py-2 pl-10 text-sm focus:outline-none w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
            </div>
            
            <div className="relative mr-4">
              <Button variant="ghost" size="icon" className="relative focus:outline-none">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
              </Button>
            </div>
            
            <div className="md:hidden">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      {isMobile && <MobileNav currentPath={location} />}
    </div>
  );
};

export default SidebarLayout;
