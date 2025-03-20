/**
 * Debug Navigation Component
 * 
 * Directly injects navigation options to help troubleshoot routing issues.
 * This component is for development purposes only and should be removed in production.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ThumbsUp, X, Info } from "lucide-react";

interface DebugNavProps {
  targetRoute?: string;
}

export default function DebugNav({ targetRoute = "/orders-direct" }: DebugNavProps) {
  const [visible, setVisible] = useState(true);
  const [successful, setSuccessful] = useState<boolean | null>(null);

  const handleDirectNavigation = () => {
    try {
      console.log("Debug direct navigation to:", targetRoute);
      // Log the current location for debugging
      console.log("Current location before navigation:", window.location.href);
      
      // Add diagnostic data to session storage
      sessionStorage.setItem("debugNavTriggered", "true");
      sessionStorage.setItem("debugNavTimestamp", new Date().toISOString());
      sessionStorage.setItem("debugNavTarget", targetRoute);
      sessionStorage.setItem("debugNavOrigin", window.location.href);
      
      // For orders-direct route, add specific tracking
      if (targetRoute === "/orders-direct") {
        sessionStorage.setItem("usingDirectOrdersAccess", "true");
        sessionStorage.setItem("orderAccessMethod", "debug-navigation");
      }
      
      // The most direct way to navigate, bypassing any router
      window.location.href = targetRoute;
      
      // Mark as successful, though we won't see this if navigation works
      setSuccessful(true);
    } catch (error) {
      console.error("Debug navigation error:", error);
      sessionStorage.setItem("debugNavError", String(error));
      setSuccessful(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-red-50 border-2 border-red-500 p-4 rounded-md shadow-lg max-w-xs">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <AlertCircle className="text-red-500 mr-2" />
          <h3 className="font-bold text-red-700">Navigation Debug Tool</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 hover:bg-red-200" 
          onClick={() => setVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-sm text-red-700 mb-3">
        This tool helps diagnose navigation issues. Click the button below to attempt direct navigation.
      </p>
      
      <div className="space-y-2">
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full" 
          onClick={handleDirectNavigation}
        >
          Navigate to {targetRoute}
        </Button>
        
        {/* Additional links to other pages */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="col-span-2 bg-slate-100 rounded px-2 py-1 mb-1">
            <p className="text-xs font-medium text-slate-500 mb-1">Order Pages:</p>
            <div className="grid grid-cols-2 gap-1">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  sessionStorage.setItem("usingDirectOrdersAccess", "true");
                  window.location.href = "/orders-direct";
                }}
              >
                Orders Direct
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  sessionStorage.setItem("usingMinimalOrdersAccess", "true");
                  window.location.href = "/orders-direct-minimal";
                }}
              >
                Orders Minimal
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  sessionStorage.setItem("usingOrdersTest", "true");
                  window.location.href = "/orders-direct-test";
                }}
              >
                Orders Test
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  sessionStorage.setItem("usingOrderManagement", "true");
                  window.location.href = "/order-management";
                }}
              >
                Order Management
              </Button>
            </div>
          </div>
          
          <div className="col-span-2 bg-slate-100 rounded px-2 py-1">
            <p className="text-xs font-medium text-slate-500 mb-1">Warehouse Pages:</p>
            <div className="grid grid-cols-2 gap-1">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  sessionStorage.setItem("directWarehouseAccess", "true");
                  sessionStorage.setItem("directWarehouseDashboardAccess", "true");
                  window.location.href = "/warehouse-direct.html?target=dashboard";
                }}
              >
                Warehouse Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  sessionStorage.setItem("directWarehouseAccess", "true");
                  sessionStorage.setItem("directWarehouseReceivingAccess", "true");
                  window.location.href = "/warehouse-direct.html?target=receiving";
                }}
              >
                Warehouse Receiving
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  sessionStorage.setItem("directWarehouseAccess", "true");
                  sessionStorage.setItem("directWarehousePutawayAccess", "true");
                  window.location.href = "/warehouse-direct.html?target=putaway";
                }}
              >
                Warehouse Put-Away
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  sessionStorage.setItem("directWarehouseAccess", "true");
                  window.location.href = "/warehouse-dashboard";
                }}
              >
                Dashboard Direct
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  sessionStorage.setItem("directWarehouseAccess", "true");
                  window.location.href = "/warehouse-receiving";
                }}
              >
                Receiving Direct
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  sessionStorage.setItem("directWarehouseAccess", "true");
                  sessionStorage.setItem("directWarehousePutawayAccess", "true");
                  window.location.href = "/warehouse-putaway";
                }}
              >
                Put-Away Direct
              </Button>
            </div>
          </div>
        </div>
        
        {successful === true && (
          <div className="flex items-center text-green-600 text-sm p-2 bg-green-50 rounded">
            <ThumbsUp className="h-4 w-4 mr-2" />
            Navigation successfully triggered!
          </div>
        )}
        
        {successful === false && (
          <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
            Navigation failed. Check console for details.
          </div>
        )}
      </div>
    </div>
  );
}