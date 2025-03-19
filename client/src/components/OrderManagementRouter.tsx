/**
 * Order Management Router Component
 * 
 * This is a special component that provides direct access to the Order Management page,
 * bypassing any routing issues by acting as a direct entry point.
 * 
 * It uses a standalone approach that doesn't rely on React Router or wouter,
 * and has extra redundancy built in to ensure it always works.
 */

import { useEffect, useState } from "react";
import OrderManagement from "@/pages/order-management";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export default function OrderManagementRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated with console logs for better debugging
    console.log("OrderManagementRouter initializing");
    const storedUser = sessionStorage.getItem('user');
    
    console.log("Authentication check - user object:", storedUser ? "exists" : "not found");
    
    if (storedUser) {
      console.log("User authenticated, rendering Order Management");
      console.log("Current URL: " + window.location.href);
      console.log("Current path: " + window.location.pathname);
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
          <Button variant="outline" size="sm" onClick={() => {
            console.log("Navigating back to dashboard");
            window.location.href = "/";
          }}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            console.log("Navigating to main dashboard");
            window.location.href = "/dashboard";
          }}>
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Main Dashboard
          </Button>
        </div>
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded mb-4">
          <p className="text-sm font-medium">You are using the direct access Order Management page</p>
        </div>
      </div>
      <OrderManagement />
    </div>
  );
}