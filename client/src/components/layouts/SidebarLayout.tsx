import { useState, ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import DebugNav from "@/components/ui/debug-nav";
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
  CalendarClock,
  Tag,
  ChevronDown,
  ChevronRight
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
  // We'll make sure SidebarItem is never used for those special routes
  // that are now handled with direct navigation
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    console.log(`Clicked on sidebar item: ${label} with href: ${href}`);
  };
  
  return (
    <li className="mb-2">
      <Link href={href} onClick={handleClick}>
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

// Warehouse operations submenu items
const warehouseOperations = [
  { icon: <Truck size={20} />, href: "/warehouse-receiving", label: "Receiving", id: "warehouse-receiving" },
  { icon: <ArrowUpDown size={20} />, href: "/warehouse-putaway", label: "Put-Away", id: "warehouse-putaway" },
  { icon: <Package size={20} />, href: "/warehouse-picking", label: "Picking", id: "warehouse-picking" },
  { icon: <Package size={20} />, href: "/warehouse-packing", label: "Packing", id: "warehouse-packing" },
];

// Define navigation items for each role
const navigationByRole: Record<UserRole, { icon: ReactNode; href: string; label: string; id: string; submenu?: { icon: ReactNode; href: string; label: string; id: string }[] }[]> = {
  warehouse_staff: [
    { icon: <LayoutDashboard size={20} />, href: "/warehouse-dashboard", label: "Dashboard", id: "warehouse-dashboard" },
    { icon: <Package size={20} />, href: "/supply-chain", label: "Inventory", id: "warehouse-inventory" },
    { 
      icon: <Warehouse size={20} />, 
      href: "#", 
      label: "Warehouse Operations", 
      id: "warehouse-operations",
      submenu: warehouseOperations
    },
    { icon: <ClipboardCheck size={20} />, href: "/supply-chain?view=shipments", label: "Shipments", id: "warehouse-shipments" },
    { icon: <Package size={20} />, href: "/order-management", label: "Order Management", id: "warehouse-orders" },
    { icon: <Cloud size={20} />, href: "/weather-impact", label: "Weather Alerts", id: "warehouse-weather" },
  ],
  logistics_manager: [
    { icon: <LayoutDashboard size={20} />, href: "/dashboard", label: "Overview", id: "logistics-dashboard" },
    { icon: <Bell size={20} />, href: "/real-time-dashboard", label: "Real-Time Dashboard", id: "logistics-real-time" },
    { icon: <Route size={20} />, href: "/routes", label: "Route Optimization", id: "logistics-routes" },
    { icon: <Navigation size={20} />, href: "/hyper-local-routing", label: "Hyper-Local Routing", id: "logistics-hyper-local" },
    { icon: <Warehouse size={20} />, href: "/supply-chain", label: "Supply Chain", id: "logistics-supply-chain" },
    { 
      icon: <Warehouse size={20} />, 
      href: "#", 
      label: "Warehouse Operations", 
      id: "logistics-warehouse-operations",
      submenu: warehouseOperations.map(item => ({ 
        ...item, 
        id: `logistics-${item.id}`,
        label: item.label  // Keep the original labels instead of prefixing with "Warehouse "
      }))
    },
    { icon: <TrendingUp size={20} />, href: "/demand-forecasting", label: "Demand Forecasting", id: "logistics-demand" },
    { icon: <Cloud size={20} />, href: "/weather-impact", label: "Weather Impact", id: "logistics-weather" },
    { icon: <ClipboardCheck size={20} />, href: "/order-management", label: "Order Management", id: "logistics-orders" },
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
  retail_store_owner: [
    { icon: <LayoutDashboard size={20} />, href: "/retail-dashboard", label: "Store Dashboard", id: "retail-dashboard" },
    { icon: <Cloud size={20} />, href: "/demand-prediction", label: "Demand Prediction", id: "retail-demand" },
    { icon: <Truck size={20} />, href: "/local-sourcing", label: "Local Sourcing", id: "retail-sourcing" },
    { icon: <Tag size={20} />, href: "/pricing-assistant", label: "Pricing Assistant", id: "retail-pricing" },
    { icon: <Package size={20} />, href: "/inventory-tracker", label: "Inventory Tracker", id: "retail-inventory" },
    { icon: <Users size={20} />, href: "/loyalty-program", label: "Loyalty Program", id: "retail-loyalty" },
    { icon: <Leaf size={20} />, href: "/waste-management", label: "Waste Management", id: "retail-waste" },
    { icon: <Settings size={20} />, href: "/integration-kit", label: "Square Integration", id: "retail-integration" },
    { icon: <FileText size={20} />, href: "/staff-training", label: "Staff Training", id: "retail-training" },
    { icon: <Route size={20} />, href: "/routes", label: "Delivery Routes", id: "retail-routes" },
    { icon: <Shield size={20} />, href: "/supply-chain-resilience", label: "Supply Planning", id: "retail-planning" },
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
    { icon: <BarChart size={20} />, href: "/business-metrics", label: "Business Metrics", id: "owner-metrics" },
    { icon: <BrainCircuit size={20} />, href: "/ai-analytics", label: "AI Analytics", id: "owner-ai" },
    { icon: <Shield size={20} />, href: "/supply-chain-resilience", label: "Resilience Planning", id: "owner-resilience" },
    { icon: <Leaf size={20} />, href: "/sustainability", label: "Sustainability", id: "owner-sustainability" },
    { icon: <ShieldAlert size={20} />, href: "/cybersecurity", label: "Cybersecurity", id: "owner-security" },
    { icon: <TrendingUp size={20} />, href: "/demand-forecasting", label: "Market Forecasting", id: "owner-forecasting" },
    { icon: <FileText size={20} />, href: "/reports", label: "Reports & Analytics", id: "owner-reports" },
  ]
};

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("logistics_manager");
  const [userName, setUserName] = useState("User");
  const [userInitials, setUserInitials] = useState("U");
  
  // Debugging current location
  console.log("SidebarLayout: Current location is:", location);

  useEffect(() => {
    // Get user info from session storage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const userRole = user.role || "logistics_manager";
        
        // Log user details for debugging
        console.log("SidebarLayout detected user:", user.username, "with role:", userRole);
        
        // Special check for warehouse staff to ensure they don't see driver content
        if (user.username && user.username.toLowerCase().includes('warehouse')) {
          console.log("Username contains 'warehouse', enforcing warehouse_staff role");
          setUserRole('warehouse_staff');
        } else {
          setUserRole(userRole);
        }
        
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
    // Use wouter's navigation instead of direct window.location modification
    sessionStorage.removeItem('user');
    console.log('Logging out user, redirecting to login page');
    setLocation('/login');
  };

  const roleNavigation = navigationByRole[userRole] || [];
  
  // Role-specific titles
  const roleTitles: Record<UserRole, string> = {
    warehouse_staff: "Warehouse Portal",
    logistics_manager: "Logistics Command",
    driver: "Driver Portal",
    sales: "Sales Dashboard",
    business_owner: "Executive Suite",
    retail_store_owner: "Retail Store Management"
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
            {roleNavigation.map((item) => {
              // Handle submenu items
              if (item.submenu) {
                // Use a simple dropdown menu with useState hook
                const [isOpen, setIsOpen] = useState(location.startsWith("/warehouse-"));
                
                return (
                  <li className="mb-2" key={item.id}>
                    <div className="w-full">
                      {/* Menu trigger */}
                      <div
                        className={cn(
                          "flex items-center justify-between py-2 px-4 rounded-r-lg transition-colors duration-200 cursor-pointer",
                          "hover:bg-primary-light/70 text-white"
                        )}
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{item.icon}</span>
                          {item.label}
                        </div>
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                      
                      {/* Submenu content */}
                      {isOpen && (
                        <ul className="pl-6 mt-1 space-y-1">
                          {item.submenu.map((subItem) => {
                            if (subItem.href === "/warehouse-receiving") {
                              return (
                                <li key={subItem.id}>
                                  <div
                                    className={cn(
                                      "flex items-center py-2 px-3 rounded-r-lg transition-colors duration-200 cursor-pointer",
                                      location === subItem.href ? "bg-primary-light text-white font-medium" : "hover:bg-primary-light/70 text-white"
                                    )}
                                    onClick={() => {
                                      console.log("Direct Warehouse Receiving navigation triggered from submenu");
                                      sessionStorage.setItem("usingDirectWarehouseAccess", "true");
                                      sessionStorage.setItem("directWarehouseReceivingAccess", "true");
                                      sessionStorage.setItem("lastDirectWarehouseAccess", new Date().toISOString());
                                      window.location.href = "/warehouse-direct.html?target=receiving";
                                    }}
                                  >
                                    <span className="mr-3">{subItem.icon}</span>
                                    {subItem.label}
                                  </div>
                                </li>
                              );
                            } else if (subItem.href === "/warehouse-putaway") {
                              return (
                                <li key={subItem.id}>
                                  <div
                                    className={cn(
                                      "flex items-center py-2 px-3 rounded-r-lg transition-colors duration-200 cursor-pointer",
                                      location === subItem.href ? "bg-primary-light text-white font-medium" : "hover:bg-primary-light/70 text-white"
                                    )}
                                    onClick={() => {
                                      console.log("Direct Warehouse Put-Away navigation triggered from submenu");
                                      sessionStorage.setItem("usingDirectWarehouseAccess", "true");
                                      sessionStorage.setItem("directWarehousePutawayAccess", "true");
                                      sessionStorage.setItem("lastDirectWarehouseAccess", new Date().toISOString());
                                      window.location.href = "/warehouse-direct.html?target=putaway&t=" + new Date().getTime();
                                    }}
                                  >
                                    <span className="mr-3">{subItem.icon}</span>
                                    {subItem.label}
                                  </div>
                                </li>
                              );
                            } else if (subItem.href === "/warehouse-picking") {
                              return (
                                <li key={subItem.id}>
                                  <div
                                    className={cn(
                                      "flex items-center py-2 px-3 rounded-r-lg transition-colors duration-200 cursor-pointer",
                                      location === subItem.href ? "bg-primary-light text-white font-medium" : "hover:bg-primary-light/70 text-white"
                                    )}
                                    onClick={() => {
                                      console.log("Direct Warehouse Picking navigation triggered from submenu");
                                      // Add tracking flags in session storage for analytics
                                      sessionStorage.setItem("usingDirectWarehouseAccess", "true");
                                      sessionStorage.setItem("directWarehousePickingAccess", "true");
                                      sessionStorage.setItem("lastDirectWarehouseAccess", new Date().toISOString());
                                      // Use setLocation from wouter instead of direct DOM manipulation
                                      setLocation("/warehouse-picking");
                                    }}
                                  >
                                    <span className="mr-3">{subItem.icon}</span>
                                    {subItem.label}
                                  </div>
                                </li>
                              );
                            } else if (subItem.href === "/warehouse-packing") {
                              return (
                                <li key={subItem.id}>
                                  <div
                                    className={cn(
                                      "flex items-center py-2 px-3 rounded-r-lg transition-colors duration-200 cursor-pointer",
                                      location === subItem.href ? "bg-primary-light text-white font-medium" : "hover:bg-primary-light/70 text-white"
                                    )}
                                    onClick={() => {
                                      console.log("Direct Warehouse Packing navigation triggered from submenu");
                                      // Add tracking flags in session storage for analytics
                                      sessionStorage.setItem("usingDirectWarehouseAccess", "true");
                                      sessionStorage.setItem("directWarehousePackingAccess", "true");
                                      sessionStorage.setItem("lastDirectWarehouseAccess", new Date().toISOString());
                                      // Use setLocation from wouter instead of direct DOM manipulation
                                      setLocation("/warehouse-packing");
                                    }}
                                  >
                                    <span className="mr-3">{subItem.icon}</span>
                                    {subItem.label}
                                  </div>
                                </li>
                              );
                            } else {
                              return (
                                <li key={subItem.id}>
                                  <Link href={subItem.href}>
                                    <div
                                      className={cn(
                                        "flex items-center py-2 px-3 rounded-r-lg transition-colors duration-200 cursor-pointer",
                                        location === subItem.href ? "bg-primary-light text-white font-medium" : "hover:bg-primary-light/70 text-white"
                                      )}
                                    >
                                      <span className="mr-3">{subItem.icon}</span>
                                      {subItem.label}
                                    </div>
                                  </Link>
                                </li>
                              );
                            }
                          })}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              }
              
              // Special cases with direct navigation
              if (item.href === "/order-management") {
                return (
                  <li className="mb-2" key={item.id}>
                    <div
                      className={cn(
                        "flex items-center py-2 px-4 rounded-r-lg transition-colors duration-200 cursor-pointer",
                        location === item.href ? "bg-primary-light text-white font-medium" : "hover:bg-primary-light/70 text-white"
                      )}
                      onClick={() => {
                        console.log("Direct Order Management navigation triggered");
                        // Add tracking flag in session storage
                        sessionStorage.setItem("usingDirectOrdersAccess", "true");
                        sessionStorage.setItem("lastDirectOrdersAccess", new Date().toISOString());
                        // Use direct navigation to avoid router issues
                        window.location.href = "/orders-direct";
                      }}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </div>
                  </li>
                );
              } else if (item.href === "/warehouse-dashboard") {
                return (
                  <li className="mb-2" key={item.id}>
                    <div
                      className={cn(
                        "flex items-center py-2 px-4 rounded-r-lg transition-colors duration-200 cursor-pointer",
                        location === item.href ? "bg-primary-light text-white font-medium" : "hover:bg-primary-light/70 text-white"
                      )}
                      onClick={() => {
                        console.log("Direct Warehouse Dashboard navigation triggered");
                        // Add tracking flags in session storage
                        sessionStorage.setItem("usingDirectWarehouseAccess", "true");
                        sessionStorage.setItem("directWarehouseDashboardAccess", "true");
                        sessionStorage.setItem("lastDirectWarehouseAccess", new Date().toISOString());
                        // Use direct HTML page for navigation to avoid router issues
                        window.location.href = "/warehouse-direct.html?target=dashboard";
                      }}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </div>
                  </li>
                );
              } else if (item.href === "/warehouse-receiving") {
                return (
                  <li className="mb-2" key={item.id}>
                    <div
                      className={cn(
                        "flex items-center py-2 px-4 rounded-r-lg transition-colors duration-200 cursor-pointer",
                        location === item.href ? "bg-primary-light text-white font-medium" : "hover:bg-primary-light/70 text-white"
                      )}
                      onClick={() => {
                        console.log("Direct Warehouse Receiving navigation triggered");
                        // Add tracking flags in session storage
                        sessionStorage.setItem("usingDirectWarehouseAccess", "true");
                        sessionStorage.setItem("directWarehouseReceivingAccess", "true");
                        sessionStorage.setItem("lastDirectWarehouseAccess", new Date().toISOString());
                        // Use direct HTML page for navigation to avoid router issues
                        window.location.href = "/warehouse-direct.html?target=receiving";
                      }}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </div>
                  </li>
                );
              } else if (item.href === "/warehouse-putaway") {
                return (
                  <li className="mb-2" key={item.id}>
                    <div
                      className={cn(
                        "flex items-center py-2 px-4 rounded-r-lg transition-colors duration-200 cursor-pointer",
                        location === item.href ? "bg-primary-light text-white font-medium" : "hover:bg-primary-light/70 text-white"
                      )}
                      onClick={() => {
                        console.log("Direct Warehouse Put-Away navigation triggered");
                        // Add tracking flags in session storage with clear naming
                        sessionStorage.setItem("usingDirectWarehouseAccess", "true");
                        sessionStorage.setItem("directWarehousePutawayAccess", "true"); 
                        sessionStorage.setItem("bypassRouter", "true");
                        sessionStorage.setItem("directWarehouseAccess", "true");
                        sessionStorage.setItem("lastDirectWarehouseAccess", new Date().toISOString());
                        
                        // Add additional debug information
                        console.log("Set directWarehousePutawayAccess flag to true");
                        console.log("Set bypassRouter flag to true");
                        console.log("Set directWarehouseAccess flag to true");
                        
                        // Use direct HTML page for navigation to avoid router issues
                        window.location.href = "/warehouse-direct.html?target=putaway&t=" + new Date().getTime();
                      }}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </div>
                  </li>
                );
              } else if (item.href === "/warehouse-picking") {
                return (
                  <li className="mb-2" key={item.id}>
                    <div
                      className={cn(
                        "flex items-center py-2 px-4 rounded-r-lg transition-colors duration-200 cursor-pointer",
                        location === item.href ? "bg-primary-light text-white font-medium" : "hover:bg-primary-light/70 text-white"
                      )}
                      onClick={() => {
                        console.log("Direct Warehouse Picking navigation triggered");
                        // Add tracking flags in session storage
                        sessionStorage.setItem("usingDirectWarehouseAccess", "true");
                        sessionStorage.setItem("directWarehousePickingAccess", "true");
                        sessionStorage.setItem("lastDirectWarehouseAccess", new Date().toISOString());
                        // Use direct navigation
                        window.location.href = "/warehouse-picking";
                      }}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </div>
                  </li>
                );
              } else if (item.href === "/warehouse-packing") {
                return (
                  <li className="mb-2" key={item.id}>
                    <div
                      className={cn(
                        "flex items-center py-2 px-4 rounded-r-lg transition-colors duration-200 cursor-pointer",
                        location === item.href ? "bg-primary-light text-white font-medium" : "hover:bg-primary-light/70 text-white"
                      )}
                      onClick={() => {
                        console.log("Direct Warehouse Packing navigation triggered");
                        // Add tracking flags in session storage
                        sessionStorage.setItem("usingDirectWarehouseAccess", "true");
                        sessionStorage.setItem("directWarehousePackingAccess", "true");
                        sessionStorage.setItem("lastDirectWarehouseAccess", new Date().toISOString());
                        // Use direct navigation
                        window.location.href = "/warehouse-packing";
                      }}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </div>
                  </li>
                );
              }
              
              // For all other items, use the standard SidebarItem
              return (
                <SidebarItem 
                  key={item.id}
                  icon={item.icon} 
                  href={item.href} 
                  label={item.label} 
                  active={location === item.href || location.startsWith(item.href + "?") || (location.includes(item.href) && item.href !== "/")} 
                />
              );
            })}
          </ul>
          
          <Separator className="my-4 bg-primary-light/30" />
          
          <ul>
            <SidebarItem 
              key="settings"
              icon={<Settings size={20} />} 
              href="/settings" 
              label="Settings" 
              active={location === "/settings" || location.startsWith("/settings?") || location.includes("/settings/")} 
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

      {/* Debug Navigation Helper */}
      <DebugNav targetRoute="/orders-direct" />
    </div>
  );
};

export default SidebarLayout;
