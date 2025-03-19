/**
 * Order Management Direct Test Page
 * 
 * Simple page to test direct navigation to Order Management
 */

import React from 'react';
import { Button } from "@/components/ui/button";

export default function OrdersDirectTest() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Order Management Navigation Test</h1>
      
      <div className="grid gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Test Direct Navigation</h2>
          <p className="mb-4 text-gray-700">
            Click the buttons below to test different navigation methods to the Order Management page.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Using direct URL (window.location.href)</h3>
              <Button 
                onClick={() => {
                  console.log("Navigating to /orders-direct using window.location.href");
                  window.location.href = "/orders-direct";
                }}
              >
                Navigate to /orders-direct
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Using direct URL to original page</h3>
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log("Navigating to /order-management using window.location.href");
                  window.location.href = "/order-management";
                }}
              >
                Navigate to /order-management
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Navigation Status</h3>
              <div className="p-3 bg-green-100 text-green-800 rounded">
                <p>Current URL: {window.location.href}</p>
                <p>Current Path: {window.location.pathname}</p>
                <p>Timestamp: {new Date().toISOString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}