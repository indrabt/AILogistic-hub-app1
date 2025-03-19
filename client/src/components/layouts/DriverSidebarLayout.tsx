import { ReactNode } from "react";
import { useLocation } from "wouter";
import {
  LayoutGrid,
  Route as RouteIcon,
  Navigation,
  CloudRain,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

interface DriverSidebarLayoutProps {
  children: ReactNode;
}

export default function DriverSidebarLayout({ children }: DriverSidebarLayoutProps) {
  const [location, setLocation] = useLocation();

  // Check if a path is active
  const isActive = (path: string) => {
    return location === path;
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setLocation("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-primary-foreground/10">
          <div className="flex items-center space-x-2">
            <RouteIcon className="h-6 w-6" />
            <h1 className="text-xl font-bold">AI Logistics Hub</h1>
          </div>
        </div>

        {/* Section title */}
        <div className="p-4 text-lg font-medium">Driver Portal</div>

        {/* Navigation items */}
        <nav className="flex-1 p-2 space-y-1">
          <a
            href="/driver-dashboard"
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive("/driver-dashboard")
                ? "bg-primary-foreground/20"
                : "hover:bg-primary-foreground/10"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setLocation("/driver-dashboard");
            }}
          >
            <LayoutGrid className="mr-3 h-5 w-5" />
            Dashboard
          </a>

          <a
            href="/driver-routes"
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive("/driver-routes")
                ? "bg-primary-foreground/20"
                : "hover:bg-primary-foreground/10"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setLocation("/driver-routes");
            }}
          >
            <RouteIcon className="mr-3 h-5 w-5" />
            My Routes
          </a>

          <a
            href="/driver-navigation"
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive("/driver-navigation")
                ? "bg-primary-foreground/20"
                : "hover:bg-primary-foreground/10"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setLocation("/driver-navigation");
            }}
          >
            <Navigation className="mr-3 h-5 w-5" />
            Navigation
          </a>

          <a
            href="/driver-weather"
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive("/driver-weather")
                ? "bg-primary-foreground/20"
                : "hover:bg-primary-foreground/10"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setLocation("/driver-weather");
            }}
          >
            <CloudRain className="mr-3 h-5 w-5" />
            Weather Alerts
          </a>

          <a
            href="/driver-schedule"
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive("/driver-schedule")
                ? "bg-primary-foreground/20"
                : "hover:bg-primary-foreground/10"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setLocation("/driver-schedule");
            }}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Schedule
          </a>

          <a
            href="/driver-settings"
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive("/driver-settings")
                ? "bg-primary-foreground/20"
                : "hover:bg-primary-foreground/10"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setLocation("/driver-settings");
            }}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </a>
        </nav>

        {/* Logout */}
        <div className="p-2 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 rounded-md hover:bg-primary-foreground/10"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}