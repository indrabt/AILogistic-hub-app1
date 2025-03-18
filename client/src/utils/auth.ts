// Define UserRole type matching the one in shared/schema.ts
export type UserRole = "warehouse_staff" | "logistics_manager" | "driver" | "sales" | "business_owner";

export function checkPermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function getDefaultRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    warehouse_staff: "/warehouse-dashboard",
    logistics_manager: "/dashboard",
    driver: "/driver-dashboard",
    sales: "/western-sydney-users",
    business_owner: "/business-dashboard"
  };
  return routes[role] || "/login";
}

// Define which routes each role can access
export const routePermissions: Record<string, UserRole[]> = {
  "/": ["logistics_manager"], // Root path redirects to default dashboard
  "/dashboard": ["logistics_manager"],
  "/warehouse-dashboard": ["warehouse_staff"],
  "/driver-dashboard": ["driver"],
  "/business-dashboard": ["business_owner"],
  "/business-metrics": ["business_owner"], // New page for business owner only
  "/routes": ["logistics_manager", "driver"],
  "/hyper-local-routing": ["logistics_manager", "driver"],
  "/supply-chain": ["warehouse_staff", "logistics_manager"],
  "/demand-forecasting": ["logistics_manager", "business_owner"],
  "/weather-impact": ["warehouse_staff", "logistics_manager", "driver"],
  "/ai-analytics": ["logistics_manager", "business_owner"],
  "/supply-chain-resilience": ["logistics_manager", "business_owner"],
  "/sustainability": ["logistics_manager", "business_owner"],
  "/cybersecurity": ["logistics_manager", "business_owner"],
  "/multi-modal-logistics": ["logistics_manager"],
  "/western-sydney-users": ["sales"], // Only sales can access this page now
  "/reports": ["logistics_manager", "business_owner"],
  "/settings": ["warehouse_staff", "logistics_manager", "driver", "sales", "business_owner"],
  "/login": ["warehouse_staff", "logistics_manager", "driver", "sales", "business_owner"]
};

// Get user from session storage
export function getCurrentUser(): { role: UserRole; username: string; name?: string; id: number } | null {
  try {
    const userData = sessionStorage.getItem('user');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    return {
      role: user.role || "logistics_manager",
      username: user.username || "",
      name: user.name,
      id: user.id
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Check if user can access a specific route
export function canAccessRoute(route: string): boolean {
  const user = getCurrentUser();
  if (!user) return route === "/login";
  
  // Extract base route without query parameters
  const baseRoute = route.split('?')[0];
  
  // Special case for login page - accessible to everyone including unauthenticated users
  if (baseRoute === "/login") return true;
  
  // Get allowed roles for this route
  const allowedRoles = routePermissions[baseRoute];
  
  // If route isn't defined in permissions, deny access
  if (!allowedRoles) return false;
  
  // Check if user's role can access this route
  return allowedRoles.includes(user.role);
}

// Note: The UserRole type is defined at the top of this file