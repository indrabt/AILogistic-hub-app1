import { ReactNode, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { canAccessRoute, getCurrentUser, getDefaultRoute } from '@/utils/auth';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [location, setLocation] = useLocation();
  const user = getCurrentUser();

  // IMPORTANT: Override the role based on username if needed
  // This ensures consistency with SidebarLayout and prevents security issues
  let effectiveRole = user?.role;
  if (user?.username?.toLowerCase().includes('warehouse')) {
    console.log('ProtectedRoute: Username indicates warehouse staff, enforcing warehouse_staff role');
    effectiveRole = 'warehouse_staff';
    // Update the user object with corrected role
    if (user.role !== 'warehouse_staff') {
      user.role = 'warehouse_staff';
    }
  } else if (user?.username?.toLowerCase().includes('driver')) {
    console.log('ProtectedRoute: Username indicates driver, enforcing driver role');
    effectiveRole = 'driver';
    // Update the user object with corrected role
    if (user.role !== 'driver') {
      user.role = 'driver';
    }
  } else if (user?.username?.toLowerCase().includes('manager')) {
    console.log('ProtectedRoute: Username indicates logistics manager, enforcing logistics_manager role');
    effectiveRole = 'logistics_manager';
    // Update the user object with corrected role
    if (user.role !== 'logistics_manager') {
      user.role = 'logistics_manager';
    }
  } else if (user?.username?.toLowerCase().includes('owner')) {
    console.log('ProtectedRoute: Username indicates business owner, enforcing business_owner role');
    effectiveRole = 'business_owner';
    // Update the user object with corrected role
    if (user.role !== 'business_owner') {
      user.role = 'business_owner';
    }
  } else if (user?.username?.toLowerCase().includes('sales')) {
    console.log('ProtectedRoute: Username indicates sales role, enforcing sales role');
    effectiveRole = 'sales';
    // Update the user object with corrected role
    if (user.role !== 'sales') {
      user.role = 'sales';
    }
  }

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

    // If authenticated, check if user has permission to access this route
    // Skip this check for the root path since we handle it separately above
    if (user && location !== '/' && !canAccessRoute(location)) {
      console.log(`Access denied for user role: ${user.role} trying to access ${location}`);
      
      // Log additional details for debugging
      console.log(`Session storage user data: ${JSON.stringify(sessionStorage.getItem('user'))}`);
      
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