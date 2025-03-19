/**
 * Order Management Router Component
 * 
 * This is a special component that provides direct access to the Order Management page,
 * bypassing any routing issues by acting as a direct entry point.
 */

import { useEffect, useState } from "react";
import OrderManagement from "@/pages/order-management";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export default function OrderManagementRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const storedUser = sessionStorage.getItem('user');
    
    if (storedUser) {
      console.log("User authenticated, rendering Order Management");
      setIsAuthenticated(true);
    } else {
      console.log("User not authenticated, will redirect to login");
      // Redirect to login
      window.location.href = "/login";
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="p-8 rounded-lg shadow-lg bg-white max-w-md w-full">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p className="text-center text-lg mt-4">Loading Order Management System...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="p-8 rounded-lg shadow-lg bg-white max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-4">Authentication Required</h2>
          <p className="text-center mb-6">You need to be logged in to access the Order Management system.</p>
          <div className="flex justify-center">
            <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="container py-4">
        <div className="flex gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/"}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/dashboard"}>
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Main Dashboard
          </Button>
        </div>
      </div>
      <OrderManagement />
    </div>
  );
}