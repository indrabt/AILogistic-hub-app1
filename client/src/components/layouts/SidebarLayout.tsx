import { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Route, 
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
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import MobileNav from "@/components/ui/mobile-nav";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarItemProps {
  icon: ReactNode;
  href: string;
  label: string;
  active: boolean;
}

const SidebarItem = ({ icon, href, label, active }: SidebarItemProps) => {
  return (
    <li className="mb-2">
      <div
        className={cn(
          "flex items-center py-2 px-4 rounded-r-lg transition-colors duration-200 cursor-pointer",
          active
            ? "bg-primary-light text-white font-medium"
            : "hover:bg-primary-light/70 text-white"
        )}
        onClick={() => {
          window.location.href = href;
        }}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </div>
    </li>
  );
};

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
        
        <nav className="mt-6 flex-1 overflow-y-auto">
          <ul>
            <SidebarItem 
              icon={<LayoutDashboard size={20} />} 
              href="/" 
              label="Dashboard" 
              active={location === "/"} 
            />
            <SidebarItem 
              icon={<Route size={20} />} 
              href="/routes" 
              label="Route Optimization" 
              active={location === "/routes"} 
            />
            <SidebarItem 
              icon={<Navigation size={20} />} 
              href="/hyper-local-routing" 
              label="Hyper-Local Routing" 
              active={location === "/hyper-local-routing"} 
            />
            <SidebarItem 
              icon={<Warehouse size={20} />} 
              href="/supply-chain" 
              label="Supply Chain" 
              active={location === "/supply-chain"} 
            />
            <SidebarItem 
              icon={<TrendingUp size={20} />} 
              href="/demand-forecasting" 
              label="Demand Forecasting" 
              active={location === "/demand-forecasting"} 
            />
            <SidebarItem 
              icon={<Cloud size={20} />} 
              href="/weather-impact" 
              label="Weather Impact" 
              active={location === "/weather-impact"} 
            />
            <SidebarItem 
              icon={<BrainCircuit size={20} />} 
              href="/ai-analytics" 
              label="AI Analytics" 
              active={location === "/ai-analytics"} 
            />
            <SidebarItem 
              icon={<Shield size={20} />} 
              href="/supply-chain-resilience" 
              label="Supply Chain Resilience" 
              active={location === "/supply-chain-resilience"} 
            />
            <SidebarItem 
              icon={<Leaf size={20} />} 
              href="/sustainability" 
              label="Sustainability" 
              active={location === "/sustainability"} 
            />
            <SidebarItem 
              icon={<ShieldAlert size={20} />} 
              href="/cybersecurity" 
              label="Cybersecurity" 
              active={location === "/cybersecurity"} 
            />
            <SidebarItem 
              icon={<ArrowUpDown size={20} />} 
              href="/multi-modal-logistics" 
              label="Multi-Modal Logistics" 
              active={location === "/multi-modal-logistics"} 
            />
            <SidebarItem 
              icon={<FileText size={20} />} 
              href="/reports" 
              label="Reports" 
              active={location === "/reports"} 
            />
            <SidebarItem 
              icon={<Settings size={20} />} 
              href="/settings" 
              label="Settings" 
              active={location === "/settings"} 
            />
          </ul>
        </nav>
        
        <div className="p-4 border-t border-primary-light/30 mt-auto">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Alex Johnson</p>
              <p className="text-xs text-gray-300">Logistics Manager</p>
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
