import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * Navigation Test Page
 * 
 * This page is dedicated to testing navigation between different pages,
 * especially problematic routes like warehouse picking and packing
 */
export default function NavigationTest() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isTesting, setIsTesting] = useState(false);

  // Test direct navigation with window.location
  const testDirectNavigation = (path: string, name: string) => {
    setIsTesting(true);
    
    // Create an iframe to test navigation without leaving the page
    const iframe = document.createElement('iframe');
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.position = 'absolute';
    
    // Set up a listener to capture if navigation succeeds
    const timeoutId = setTimeout(() => {
      document.body.removeChild(iframe);
      setTestResults(prev => ({
        ...prev,
        [name]: false
      }));
      setIsTesting(false);
    }, 3000); // 3 second timeout

    iframe.onload = () => {
      try {
        // If we can access the iframe's contentWindow, navigation worked
        const iframeLocation = iframe.contentWindow?.location.pathname;
        const success = iframeLocation === path;
        
        // Update test results
        setTestResults(prev => ({
          ...prev,
          [name]: success
        }));
        
        // Clean up
        clearTimeout(timeoutId);
        document.body.removeChild(iframe);
        setIsTesting(false);
      } catch (e) {
        console.error("Failed to check iframe location:", e);
        setTestResults(prev => ({
          ...prev,
          [name]: false
        }));
        clearTimeout(timeoutId);
        document.body.removeChild(iframe);
        setIsTesting(false);
      }
    };

    // Start the test
    document.body.appendChild(iframe);
    iframe.src = path;
  };

  const clearResults = () => {
    setTestResults({});
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Navigation Test Page</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Navigation Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Direct Links</h3>
              <div className="space-y-2">
                <div>
                  <a
                    href="/warehouse-picking"
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Warehouse Picking (Direct link)
                  </a>
                </div>
                <div>
                  <a
                    href="/warehouse-packing"
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Warehouse Packing (Direct link)
                  </a>
                </div>
                <div>
                  <a
                    href="/dashboard"
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Dashboard (Control - should work)
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Wouter Navigation</h3>
              <div className="space-y-2">
                <div>
                  <Link href="/warehouse-picking">
                    <a className="text-blue-500 underline">
                      Warehouse Picking (Wouter Link)
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href="/warehouse-packing">
                    <a className="text-blue-500 underline">
                      Warehouse Packing (Wouter Link)
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href="/dashboard">
                    <a className="text-blue-500 underline">
                      Dashboard (Wouter - Control)
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Automated Tests</h3>
            <div className="flex gap-4 mb-4">
              <Button
                onClick={() => testDirectNavigation("/warehouse-picking", "warehouse-picking")}
                disabled={isTesting}
              >
                Test Warehouse Picking
              </Button>
              <Button
                onClick={() => testDirectNavigation("/warehouse-packing", "warehouse-packing")}
                disabled={isTesting}
              >
                Test Warehouse Packing
              </Button>
              <Button
                onClick={() => testDirectNavigation("/dashboard", "dashboard-control")}
                disabled={isTesting}
              >
                Test Dashboard (Control)
              </Button>
              <Button
                onClick={clearResults}
                variant="outline"
              >
                Clear Results
              </Button>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-md">
              <h4 className="font-medium mb-2">Test Results:</h4>
              {Object.keys(testResults).length === 0 ? (
                <p className="text-gray-500">No tests run yet</p>
              ) : (
                <ul className="space-y-2">
                  {Object.entries(testResults).map(([name, success]) => (
                    <li key={name} className="flex items-center">
                      <span className={`inline-block w-4 h-4 rounded-full mr-2 ${success ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span>{name}: {success ? 'Success' : 'Failed'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Direct Window.Location Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={() => {
                window.location.href = "/warehouse-picking";
              }}
              variant="secondary"
            >
              Go to Warehouse Picking (window.location)
            </Button>
            
            <Button 
              onClick={() => {
                window.location.href = "/warehouse-packing";
              }}
              variant="secondary"
              className="ml-4"
            >
              Go to Warehouse Packing (window.location)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}