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

  // Redirect from root path to role-specific dashboard
  useEffect(() => {
    if (user && location === '/') {
      const defaultRoute = getDefaultRoute(user.role);
      setLocation(defaultRoute);
    }
  }, [location, setLocation, user]);

  useEffect(() => {
    // Check if user is authenticated (except for login page)
    if (!user && location !== '/login') {
      toast({
        title: 'Authentication required',
        description: 'Please log in to access this page.',
        variant: 'destructive',
      });
      setLocation('/login');
      return;
    }

    // If authenticated, check if user has permission to access this route
    // Skip this check for the root path since we handle it separately above
    if (user && location !== '/' && !canAccessRoute(location)) {
      console.log(`Access denied for user role: ${user.role} trying to access ${location}`);
      
      toast({
        title: 'Access denied',
        description: 'You do not have permission to access this page.',
        variant: 'destructive',
      });
      
      // Redirect to default route for user's role
      const defaultRoute = getDefaultRoute(user.role);
      setLocation(defaultRoute);
    }
  }, [location, setLocation, user]);

  // If on login page and already authenticated, redirect to default route
  useEffect(() => {
    if (user && location === '/login') {
      const defaultRoute = getDefaultRoute(user.role);
      setLocation(defaultRoute);
    }
  }, [location, setLocation, user]);

  return <>{children}</>;
}