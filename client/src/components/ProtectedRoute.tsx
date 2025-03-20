import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { canAccessRoute, getCurrentUser, getDefaultRoute, determineRoleFromUsername, syncUserRole } from '@/utils/auth';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [location, setLocation] = useLocation();
  const user = getCurrentUser();
  
  // User will already have the correct role from getCurrentUser() which uses determineRoleFromUsername()
  // No need to re-implement role determination logic here

  useEffect(() => {
    console.log(`Protected route check for path: ${location}`);
    console.log(`Current user role: ${user?.role || 'not authenticated'}`);
  }, [location, user]);

  // Redirect from root path to role-specific dashboard
  useEffect(() => {
    if (user && location === '/') {
      const defaultRoute = getDefaultRoute(user.role);
      console.log(`Redirecting from root to default route: ${defaultRoute}`);
      setLocation(defaultRoute);
    }
  }, [location, setLocation, user]);

  useEffect(() => {
    // Check if user is authenticated (except for login page)
    if (!user && location !== '/login') {
      console.log('Authentication required - redirecting to login');
      toast({
        title: 'Authentication required',
        description: 'Please log in to access this page.',
        variant: 'destructive',
      });
      setLocation('/login');
      return;
    }

    // IMPORTANT: Special case hardcoded protection
    // This is a redundant, last-resort check specifically for warehouse staff 
    // trying to access driver dashboard, which has been problematic
    if (user && user.role === 'warehouse_staff' && 
        (location.startsWith('/driver-dashboard') || location.includes('driver'))) {
      console.log('HARD BLOCK: Preventing warehouse staff from accessing driver areas');
      toast({
        title: 'Access denied',
        description: 'Warehouse staff cannot access driver areas.',
        variant: 'destructive',
      });
      setLocation('/warehouse-dashboard');
      return;
    }

    // Check for bypass flags - this allows direct access from HTML pages
    const ordersAccessOverride = sessionStorage.getItem("overrideOrdersAccess") === "true";
    const directWarehouseAccess = sessionStorage.getItem("directWarehouseAccess") === "true";
    const directWarehouseDashboardAccess = sessionStorage.getItem("directWarehouseDashboardAccess") === "true";
    const directWarehouseReceivingAccess = sessionStorage.getItem("directWarehouseReceivingAccess") === "true";
    const directWarehousePutawayAccess = sessionStorage.getItem("directWarehousePutawayAccess") === "true";
    const bypassRouter = sessionStorage.getItem("bypassRouter") === "true";
    
    // Check for specific routes
    const isOrdersRoute = location.includes("orders-direct");
    const isWarehouseDashboardRoute = location === "/warehouse-dashboard";
    const isWarehouseReceivingRoute = location === "/warehouse-receiving";
    const isWarehousePutawayRoute = location === "/warehouse-putaway";
    
    // Log enhanced debugging information
    console.log(`Access check details:
      - User role: ${user?.role}
      - Current path: ${location}
      - Orders override flag: ${ordersAccessOverride}
      - Warehouse override flag: ${directWarehouseAccess}
      - Warehouse Dashboard flag: ${directWarehouseDashboardAccess}
      - Warehouse Receiving flag: ${directWarehouseReceivingAccess}
      - Warehouse Putaway flag: ${directWarehousePutawayAccess}
      - Bypass router flag: ${bypassRouter}
      - Is orders route: ${isOrdersRoute}
      - Is warehouse dashboard: ${isWarehouseDashboardRoute}
      - Is warehouse receiving: ${isWarehouseReceivingRoute}
      - Is warehouse putaway: ${isWarehousePutawayRoute}`);
    
    // If authenticated, check if user has permission to access this route
    // Skip this check for root path or if bypass flags are set
    const hasOrdersOverride = isOrdersRoute && (ordersAccessOverride || bypassRouter);
    const hasWarehouseDashboardOverride = isWarehouseDashboardRoute && (directWarehouseDashboardAccess || directWarehouseAccess || bypassRouter);
    const hasWarehouseReceivingOverride = isWarehouseReceivingRoute && (directWarehouseReceivingAccess || directWarehouseAccess || bypassRouter);
    const hasWarehousePutawayOverride = isWarehousePutawayRoute && (directWarehousePutawayAccess || directWarehouseAccess || bypassRouter);
    
    // Enhanced logging for put-away navigation
    if (isWarehousePutawayRoute) {
      console.log('Warehouse Put-Away route detected!');
      console.log(`Override flags: directWarehouseAccess=${directWarehouseAccess}, directWarehousePutawayAccess=${directWarehousePutawayAccess}, bypassRouter=${bypassRouter}`);
      console.log(`Override active: ${hasWarehousePutawayOverride}`);
    }
    
    if (user && 
        location !== '/' && 
        !canAccessRoute(location) && 
        !hasOrdersOverride &&
        !hasWarehouseDashboardOverride &&
        !hasWarehouseReceivingOverride &&
        !hasWarehousePutawayOverride) {
      
      console.log(`Access denied for user role: ${user.role} trying to access ${location}`);
      
      // Log additional details for debugging
      console.log(`Session storage user data: ${JSON.stringify(sessionStorage.getItem('user'))}`);
      
      // Special handling for orders direct access
      if (isOrdersRoute) {
        console.log("Orders access denied despite being an orders route");
        console.log(`Override flags: ordersAccessOverride=${ordersAccessOverride}, bypassRouter=${bypassRouter}`);
      }
      
      // Special handling for warehouse routes
      if (isWarehouseDashboardRoute || isWarehouseReceivingRoute || isWarehousePutawayRoute) {
        console.log("Warehouse access denied despite being a warehouse route");
        console.log(`Override flags: directWarehouseAccess=${directWarehouseAccess}, directWarehouseDashboardAccess=${directWarehouseDashboardAccess}, directWarehouseReceivingAccess=${directWarehouseReceivingAccess}, directWarehousePutawayAccess=${directWarehousePutawayAccess}, bypassRouter=${bypassRouter}`);
      }
      
      toast({
        title: 'Access denied',
        description: 'You do not have permission to access this page.',
        variant: 'destructive',
      });
      
      // Redirect to default route for user's role
      const defaultRoute = getDefaultRoute(user.role);
      console.log(`Redirecting to default route: ${defaultRoute}`);
      setLocation(defaultRoute);
    }
    
    // If we're on orders route and have override flags, clear them after successful access
    if (hasOrdersOverride && user) {
      console.log("Successfully accessed orders with override flags, clearing flags");
      setTimeout(() => {
        // Clear after a delay to ensure navigation completes
        sessionStorage.removeItem("overrideOrdersAccess");
        sessionStorage.removeItem("bypassRouter");
      }, 3000);
    }
    
    // If we're on warehouse routes and have override flags, clear them after successful access
    if ((hasWarehouseDashboardOverride || hasWarehouseReceivingOverride || hasWarehousePutawayOverride) && user) {
      console.log("Successfully accessed warehouse with override flags, clearing flags");
      setTimeout(() => {
        // Clear after a delay to ensure navigation completes
        sessionStorage.removeItem("directWarehouseAccess");
        sessionStorage.removeItem("directWarehouseDashboardAccess");
        sessionStorage.removeItem("directWarehouseReceivingAccess");
        sessionStorage.removeItem("directWarehousePutawayAccess");
        sessionStorage.removeItem("bypassRouter");
      }, 3000);
    }
  }, [location, setLocation, user]);

  // If on login page and already authenticated, redirect to default route
  useEffect(() => {
    if (user && location === '/login') {
      const defaultRoute = getDefaultRoute(user.role);
      console.log(`Already authenticated, redirecting from login to: ${defaultRoute}`);
      setLocation(defaultRoute);
    }
  }, [location, setLocation, user]);

  return <>{children}</>;
}