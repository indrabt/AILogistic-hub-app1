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
      
      // The most direct way to navigate, bypassing any router
      window.location.href = targetRoute;
      
      // Mark as successful, though we won't see this if navigation works
      setSuccessful(true);
    } catch (error) {
      console.error("Debug navigation error:", error);
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