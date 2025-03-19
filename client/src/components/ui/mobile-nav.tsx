import { useState, useEffect, ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Route, 
  Warehouse, 
  MoreHorizontal, 
  Navigation, 
  User,
  Cloud,
  Package,
  Truck,
  TrendingUp,
  FileText,
  Calendar,
  BarChart,
  ShoppingBag,
  Tag,
  Zap,
  Settings,
  Smartphone
} from "lucide-react";
import { UserRole } from "@/utils/auth";

interface MobileNavProps {
  currentPath: string;
}

type MobileNavItem = {
  icon: ReactNode;
  label: string;
  href: string;
  roles: UserRole[];
};

const mobileNavItems: MobileNavItem[] = [
  // Dashboard items for each role
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/warehouse-dashboard", roles: ["warehouse_staff"] },
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/dashboard", roles: ["logistics_manager", "sales"] },
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/driver-dashboard", roles: ["driver"] },
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/business-dashboard", roles: ["business_owner"] },
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/retail-dashboard", roles: ["retail_store_owner"] },
  
  // Common items across roles
  { icon: <Route size={20} />, label: "Routes", href: "/routes", roles: ["logistics_manager", "driver", "retail_store_owner"] },
  { icon: <Navigation size={20} />, label: "Local", href: "/hyper-local-routing", roles: ["logistics_manager", "driver", "retail_store_owner"] },
  { icon: <Warehouse size={20} />, label: "Supply", href: "/supply-chain", roles: ["warehouse_staff", "logistics_manager", "retail_store_owner"] },
  { icon: <Cloud size={20} />, label: "Weather", href: "/weather-impact", roles: ["warehouse_staff", "logistics_manager", "driver", "retail_store_owner"] },
  
  // Role-specific items
  { icon: <Package size={20} />, label: "Inventory", href: "/supply-chain", roles: ["warehouse_staff"] },
  { icon: <Package size={20} />, label: "Inventory", href: "/inventory-tracker", roles: ["retail_store_owner"] },
  { icon: <Calendar size={20} />, label: "Schedule", href: "/driver-dashboard?view=schedule", roles: ["driver"] },
  { icon: <User size={20} />, label: "Clients", href: "/western-sydney-users", roles: ["sales"] },
  { icon: <BarChart size={20} />, label: "Metrics", href: "/business-metrics", roles: ["business_owner"] },
  { icon: <TrendingUp size={20} />, label: "Forecast", href: "/demand-forecasting", roles: ["sales", "logistics_manager", "business_owner"] },
  
  // Enhanced retail-specific items
  { icon: <TrendingUp size={20} />, label: "Demand", href: "/demand-prediction", roles: ["retail_store_owner"] },
  { icon: <Truck size={20} />, label: "Sourcing", href: "/local-sourcing", roles: ["retail_store_owner"] },
  { icon: <ShoppingBag size={20} />, label: "POS", href: "/integration-kit", roles: ["retail_store_owner"] },
  { icon: <Package size={20} />, label: "Stock", href: "/inventory-tracker", roles: ["retail_store_owner"] },
  { icon: <Tag size={20} />, label: "Pricing", href: "/pricing-assistant", roles: ["retail_store_owner"] },
  { icon: <Zap size={20} />, label: "Loyalty", href: "/loyalty-program", roles: ["retail_store_owner"] },
  
  // Reports and settings
  { icon: <FileText size={20} />, label: "Reports", href: "/reports", roles: ["logistics_manager", "sales", "business_owner", "retail_store_owner"] },
  { icon: <Settings size={20} />, label: "Settings", href: "/settings", roles: ["warehouse_staff", "logistics_manager", "driver", "sales", "business_owner", "retail_store_owner"] },
  
  // More options for all roles
  { icon: <MoreHorizontal size={20} />, label: "More", href: "/settings", roles: ["warehouse_staff", "logistics_manager", "driver", "sales", "business_owner", "retail_store_owner"] },
];

const MobileNav = ({ currentPath }: MobileNavProps) => {
  const [userRole, setUserRole] = useState<UserRole>("logistics_manager");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Get user info from session storage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const role = user.role || "logistics_manager";
        setUserRole(role);
        console.log("User role in MobileNav:", role);
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  }, []);

  // Filter navigation items by user role
  const filteredNavItems = mobileNavItems
    .filter(item => {
      // Extra check to prevent warehouse staff from seeing driver dashboard
      if (userRole === 'warehouse_staff' && item.href.includes('driver-dashboard')) {
        return false;
      }
      return item.roles.includes(userRole);
    })
    // Remove duplicates based on href to ensure we only show each destination once
    .filter((item, index, self) => 
      index === self.findIndex(t => t.href === item.href)
    );
    
  // Main nav items (first 4) plus More button
  const mainNavItems = filteredNavItems.slice(0, 4);
  // Extra items when expanded
  const extraNavItems = filteredNavItems.slice(4);

  return (
    <>
      {/* Fixed bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 md:hidden z-40">
        {mainNavItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div 
              className={cn(
                "p-2 flex flex-col items-center cursor-pointer",
                currentPath === item.href || currentPath.startsWith(item.href + "?") 
                  ? "text-primary" 
                  : "text-gray-500"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </div>
          </Link>
        ))}
        
        {/* More button */}
        <div 
          className="p-2 flex flex-col items-center cursor-pointer text-gray-500"
          onClick={() => setExpanded(!expanded)}
        >
          <MoreHorizontal size={20} />
          <span className="text-xs mt-1">More</span>
        </div>
      </div>
      
      {/* Expanded menu that slides up when More is tapped */}
      {expanded && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-3 md:hidden z-40 shadow-lg rounded-t-xl">
          <div className="w-12 h-1 bg-gray-300 mx-auto mb-4 rounded-full" />
          
          <div className="grid grid-cols-4 gap-4">
            {extraNavItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setExpanded(false)}>
                <div 
                  className={cn(
                    "p-3 flex flex-col items-center cursor-pointer rounded-lg",
                    currentPath === item.href || currentPath.startsWith(item.href + "?") 
                      ? "text-primary bg-primary/10" 
                      : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  <span className="text-xs mt-2 text-center">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-4 pt-2 border-t border-gray-100 flex justify-center">
            <button 
              className="px-4 py-2 text-sm text-gray-500 flex items-center gap-2"
              onClick={() => setExpanded(false)}
            >
              <span>Close</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Overlay to close the expanded menu when clicking outside */}
      {expanded && (
        <div 
          className="fixed inset-0 bg-black/30 md:hidden z-30"
          onClick={() => setExpanded(false)}
        />
      )}
    </>
  );
};

export default MobileNav;
