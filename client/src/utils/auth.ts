// Define UserRole type matching the one in shared/schema.ts
export type UserRole = "warehouse_staff" | "logistics_manager" | "driver" | "sales" | "business_owner" | "retail_store_owner";

export function checkPermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function getDefaultRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    warehouse_staff: "/warehouse-dashboard",
    logistics_manager: "/dashboard",
    driver: "/driver-dashboard",
    sales: "/western-sydney-users",
    business_owner: "/business-dashboard",
    retail_store_owner: "/retail-dashboard" // New route for retail store owners
  };
  return routes[role] || "/login";
}

// Define which routes each role can access
export const routePermissions: Record<string, UserRole[]> = {
  "/warehouse-receiving": ["warehouse_staff", "logistics_manager"],
  "/warehouse-putaway": ["warehouse_staff", "logistics_manager"],
  "/warehouse-picking": ["warehouse_staff", "logistics_manager"],
  "/warehouse-packing": ["warehouse_staff", "logistics_manager"],
  "/warehouse-shipping": ["warehouse_staff", "logistics_manager"],
  "/": ["logistics_manager"], // Root path redirects to default dashboard
  "/dashboard": ["logistics_manager"],
  "/warehouse-dashboard": ["warehouse_staff", "logistics_manager"],
  "/driver-dashboard": ["driver"],
  "/driver-schedule": ["driver"],
  "/driver-routes": ["driver"],
  "/driver-navigation": ["driver"],
  "/driver-weather": ["driver"],
  "/driver-settings": ["driver"],
  "/business-dashboard": ["business_owner"],
  "/business-metrics": ["business_owner"], // New page for business owner only
  "/retail-dashboard": ["retail_store_owner"], // New dashboard for retail store owners
  "/demand-prediction": ["retail_store_owner"], // Feature 1: Simplified Event and Weather Demand Prediction
  "/local-sourcing": ["retail_store_owner"], // Feature 2: Low-Cost Local Sourcing Connector
  "/pricing-assistant": ["retail_store_owner"], // Feature 3: Dynamic Pricing Assistant
  "/inventory-tracker": ["retail_store_owner"], // Feature 4: Perishable Inventory Tracker
  "/loyalty-program": ["retail_store_owner"], // Feature 5: One-Click Loyalty Program
  "/waste-management": ["retail_store_owner"], // Feature 6: Waste Management Lite
  "/integration-kit": ["retail_store_owner"], // Feature 7: Plug-and-Play Integration Kit
  "/staff-training": ["retail_store_owner"], // Feature 8: Staff Training Tutorials
  "/routes": ["logistics_manager", "driver", "retail_store_owner"],
  "/hyper-local-routing": ["logistics_manager", "driver", "retail_store_owner"],
  "/supply-chain": ["warehouse_staff", "logistics_manager", "retail_store_owner"],
  "/demand-forecasting": ["logistics_manager", "business_owner", "retail_store_owner"],
  "/weather-impact": ["warehouse_staff", "logistics_manager", "driver", "retail_store_owner"],
  "/real-time-dashboard": ["logistics_manager", "business_owner", "retail_store_owner"],
  "/ai-analytics": ["logistics_manager", "business_owner", "retail_store_owner"],
  "/supply-chain-resilience": ["logistics_manager", "business_owner", "retail_store_owner"],
  "/sustainability": ["logistics_manager", "business_owner", "retail_store_owner"],
  "/cybersecurity": ["logistics_manager", "business_owner"],
  "/multi-modal-logistics": ["logistics_manager", "retail_store_owner"],
  "/western-sydney-users": ["sales"], // Only sales can access this page now
  "/reports": ["logistics_manager", "business_owner", "retail_store_owner"],
  "/order-management": ["logistics_manager", "business_owner", "warehouse_staff", "retail_store_owner"],
  "/orders-direct": ["logistics_manager", "business_owner", "warehouse_staff", "retail_store_owner"],
  "/orders-direct-test": ["logistics_manager", "business_owner", "warehouse_staff", "retail_store_owner"],
  "/orders-direct-minimal": ["logistics_manager", "business_owner", "warehouse_staff", "retail_store_owner"],
  "/settings": ["warehouse_staff", "logistics_manager", "driver", "sales", "business_owner", "retail_store_owner"],
  "/login": ["warehouse_staff", "logistics_manager", "driver", "sales", "business_owner", "retail_store_owner"]
};

// Get user from session storage with role validation
/**
 * Determine the correct role based on username pattern
 * This is the single source of truth for role determination
 */
export function determineRoleFromUsername(username: string, currentRole?: UserRole): UserRole {
  // Default to logistics manager if no role is provided
  let role: UserRole = currentRole || "logistics_manager";
  
  // Check username patterns to determine appropriate role
  // Order matters - check more specific patterns first
  if (username.toLowerCase().includes('warehouse')) {
    role = 'warehouse_staff';
  } 
  else if (username.toLowerCase().includes('driver')) {
    role = 'driver';
  }
  else if (username.toLowerCase().includes('store') || username.toLowerCase().includes('retail')) {
    role = 'retail_store_owner';
  }
  else if (username.toLowerCase().includes('owner')) {
    role = 'business_owner';
  }
  else if (username.toLowerCase().includes('sales')) {
    role = 'sales';
  }
  else if (username.toLowerCase().includes('manager')) {
    role = 'logistics_manager';
  }
  
  return role;
}

/**
 * Synchronize the user's role in session storage to match username-based role
 */
export function syncUserRole(user: any): void {
  if (!user || !user.username) return;
  
  const username = user.username;
  const currentRole = user.role as UserRole;
  const correctRole = determineRoleFromUsername(username, currentRole);
  
  // If role determined from username doesn't match stored role, update it
  if (correctRole !== currentRole) {
    console.log(`Role mismatch detected - username: ${username}, stored role: ${currentRole}`);
    console.log(`Enforcing ${correctRole} role based on username pattern`);
    
    // Update session storage with corrected role
    const correctedUser = {...user, role: correctRole};
    sessionStorage.setItem('user', JSON.stringify(correctedUser));
  }
}

export function getCurrentUser(): { role: UserRole; username: string; name?: string; id: number } | null {
  try {
    const userData = sessionStorage.getItem('user');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    const username = user.username || "";
    
    // Set default role if none exists
    if (!user.role) {
      user.role = "logistics_manager";
    }
    
    // Ensure user has correct role based on username
    const effectiveRole = determineRoleFromUsername(username, user.role);
    
    // Update session storage if needed
    if (effectiveRole !== user.role) {
      syncUserRole(user);
    }
    
    return {
      role: effectiveRole,
      username: username,
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
  
  // Additional logging to help with debugging
  console.log(`Checking access for route: ${baseRoute}`);
  console.log(`User role: ${user.role}`);
  console.log(`Allowed roles: ${allowedRoles ? allowedRoles.join(', ') : 'none'}`);
  
  // If route isn't defined in permissions, deny access
  if (!allowedRoles) {
    console.log('Route not in permissions, access denied');
    return false;
  }
  
  // Explicit check for warehouse staff trying to access driver dashboard
  if (user.role === 'warehouse_staff' && baseRoute === '/driver-dashboard') {
    console.log('Explicitly blocking warehouse staff from driver dashboard');
    return false;
  }
  
  // Check if user's role can access this route
  const hasAccess = allowedRoles.includes(user.role);
  console.log(`Access ${hasAccess ? 'granted' : 'denied'}`);
  return hasAccess;
}

// Note: The UserRole type is defined at the top of this file