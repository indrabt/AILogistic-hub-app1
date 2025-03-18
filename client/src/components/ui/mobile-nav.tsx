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
  Calendar
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
  
  // Common items across roles
  { icon: <Route size={20} />, label: "Routes", href: "/routes", roles: ["logistics_manager", "driver"] },
  { icon: <Navigation size={20} />, label: "Local", href: "/hyper-local-routing", roles: ["logistics_manager", "driver"] },
  { icon: <Warehouse size={20} />, label: "Supply", href: "/supply-chain", roles: ["warehouse_staff", "logistics_manager"] },
  { icon: <Cloud size={20} />, label: "Weather", href: "/weather-impact", roles: ["warehouse_staff", "logistics_manager", "driver"] },
  
  // Role-specific items
  { icon: <Package size={20} />, label: "Inventory", href: "/supply-chain", roles: ["warehouse_staff"] },
  { icon: <Calendar size={20} />, label: "Schedule", href: "/driver-dashboard?view=schedule", roles: ["driver"] },
  { icon: <User size={20} />, label: "Clients", href: "/western-sydney-users", roles: ["sales", "business_owner"] },
  { icon: <TrendingUp size={20} />, label: "Forecast", href: "/demand-forecasting", roles: ["sales", "logistics_manager", "business_owner"] },
  { icon: <FileText size={20} />, label: "Reports", href: "/reports", roles: ["logistics_manager", "sales", "business_owner"] },
  
  // More options for all roles
  { icon: <MoreHorizontal size={20} />, label: "More", href: "/settings", roles: ["warehouse_staff", "logistics_manager", "driver", "sales", "business_owner"] },
];

const MobileNav = ({ currentPath }: MobileNavProps) => {
  const [userRole, setUserRole] = useState<UserRole>("logistics_manager");

  useEffect(() => {
    // Get user info from session storage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role || "logistics_manager");
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  }, []);

  // Filter navigation items by user role
  const filteredNavItems = mobileNavItems
    .filter(item => item.roles.includes(userRole))
    // Remove duplicates based on href to ensure we only show each destination once
    .filter((item, index, self) => 
      index === self.findIndex(t => t.href === item.href)
    )
    // Limit to 5 items for mobile
    .slice(0, 5);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 md:hidden z-40">
      {filteredNavItems.map((item) => (
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
    </div>
  );
};

export default MobileNav;
