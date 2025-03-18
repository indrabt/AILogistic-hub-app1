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
  "/real-time-dashboard": ["logistics_manager", "business_owner"],
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

// Get user from session storage with role validation
export function getCurrentUser(): { role: UserRole; username: string; name?: string; id: number } | null {
  try {
    const userData = sessionStorage.getItem('user');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    const username = user.username || "";
    
    // CRITICAL SECURITY: Determine actual role based on username
    let effectiveRole: UserRole = user.role || "logistics_manager";
    
    // Check if username indicates a specific role and enforce it
    if (username.toLowerCase().includes('warehouse')) {
      // Force warehouse staff role
      effectiveRole = 'warehouse_staff';
      
      // If stored role doesn't match username, fix it in session storage
      if (user.role !== 'warehouse_staff') {
        console.log(`Role mismatch detected in getCurrentUser - username: ${username}, role: ${user.role}`);
        console.log(`Enforcing warehouse_staff role based on username pattern`);
        
        // Update session storage with corrected role
        const correctedUser = {...user, role: 'warehouse_staff'};
        sessionStorage.setItem('user', JSON.stringify(correctedUser));
      }
    } 
    else if (username.toLowerCase().includes('driver')) {
      // Force driver role
      effectiveRole = 'driver';
      
      // If stored role doesn't match username, fix it in session storage
      if (user.role !== 'driver') {
        console.log(`Role mismatch detected in getCurrentUser - username: ${username}, role: ${user.role}`);
        console.log(`Enforcing driver role based on username pattern`);
        
        // Update session storage with corrected role
        const correctedUser = {...user, role: 'driver'};
        sessionStorage.setItem('user', JSON.stringify(correctedUser));
      }
    }
    else if (username.toLowerCase().includes('manager')) {
      // Force logistics manager role
      effectiveRole = 'logistics_manager';
      
      // If stored role doesn't match username, fix it in session storage
      if (user.role !== 'logistics_manager') {
        console.log(`Role mismatch detected in getCurrentUser - username: ${username}, role: ${user.role}`);
        console.log(`Enforcing logistics_manager role based on username pattern`);
        
        // Update session storage with corrected role
        const correctedUser = {...user, role: 'logistics_manager'};
        sessionStorage.setItem('user', JSON.stringify(correctedUser));
      }
    }
    else if (username.toLowerCase().includes('owner')) {
      // Force business owner role
      effectiveRole = 'business_owner';
      
      // If stored role doesn't match username, fix it in session storage
      if (user.role !== 'business_owner') {
        console.log(`Role mismatch detected in getCurrentUser - username: ${username}, role: ${user.role}`);
        console.log(`Enforcing business_owner role based on username pattern`);
        
        // Update session storage with corrected role
        const correctedUser = {...user, role: 'business_owner'};
        sessionStorage.setItem('user', JSON.stringify(correctedUser));
      }
    }
    else if (username.toLowerCase().includes('sales')) {
      // Force sales role
      effectiveRole = 'sales';
      
      // If stored role doesn't match username, fix it in session storage
      if (user.role !== 'sales') {
        console.log(`Role mismatch detected in getCurrentUser - username: ${username}, role: ${user.role}`);
        console.log(`Enforcing sales role based on username pattern`);
        
        // Update session storage with corrected role
        const correctedUser = {...user, role: 'sales'};
        sessionStorage.setItem('user', JSON.stringify(correctedUser));
      }
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