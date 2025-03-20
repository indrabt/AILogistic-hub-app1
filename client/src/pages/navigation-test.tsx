import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';

/**
 * Navigation Test Page
 * 
 * This page is dedicated to testing navigation between different pages,
 * especially problematic routes like warehouse picking and packing
 */
export default function NavigationTest() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  // Load test results from sessionStorage
  useEffect(() => {
    const savedResults: Record<string, boolean> = {};
    
    // Check each navigation flag
    if (sessionStorage.getItem("directWarehousePickingAccess") === "true") {
      savedResults.warehousePicking = true;
    }
    
    if (sessionStorage.getItem("directWarehousePackingAccess") === "true") {
      savedResults.warehousePacking = true;
    }
    
    if (sessionStorage.getItem("usingDirectWarehouseAccess") === "true") {
      savedResults.directWarehouseAccess = true;
    }
    
    if (sessionStorage.getItem("orderManagementRedirect") === "true") {
      savedResults.orderManagement = true;
    }
    
    if (sessionStorage.getItem("ordersDirectAccessed") === "true") {
      savedResults.ordersDirect = true;
    }
    
    setTestResults(savedResults);
  }, []);
  
  const runNavigationTest = (testId: string, url: string) => {
    // Set a flag that we'll check when we return
    const flagName = `test_${testId}_ran`;
    sessionStorage.setItem(flagName, "true");
    sessionStorage.setItem(`test_${testId}_timestamp`, new Date().toISOString());
    
    // Record that we started the test
    setTestResults(prev => ({
      ...prev,
      [`${testId}_started`]: true
    }));
    
    // Navigate to the URL
    window.location.href = url;
  };
  
  const handleTestAll = () => {
    setIsRunningTests(true);
    sessionStorage.setItem("navigation_test_running", "true");
    sessionStorage.setItem("navigation_test_timestamp", new Date().toISOString());
    
    // Start with the first test
    runNavigationTest("warehousePicking", "/warehouse-direct-link.html?target=picking");
  };
  
  const clearTestResults = () => {
    // Clear all test-related flags
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith("test_") || 
          key === "directWarehousePickingAccess" ||
          key === "directWarehousePackingAccess" ||
          key === "usingDirectWarehouseAccess" ||
          key === "orderManagementRedirect" ||
          key === "ordersDirectAccessed") {
        sessionStorage.removeItem(key);
      }
    });
    
    setTestResults({});
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Navigation Test Page</h1>
        <div className="flex gap-2">
          <Button onClick={clearTestResults} variant="outline">
            Clear Test Results
          </Button>
          <Button onClick={handleTestAll} disabled={isRunningTests}>
            {isRunningTests ? "Running Tests..." : "Test All Navigation"}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="direct-links">
        <TabsList className="mb-4">
          <TabsTrigger value="direct-links">Direct Links</TabsTrigger>
          <TabsTrigger value="router-links">Router Links</TabsTrigger>
          <TabsTrigger value="test-results">Test Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="direct-links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Direct Links</CardTitle>
              <CardDescription>
                Test direct HTML navigation which bypasses React Router
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium">Warehouse Operations</h3>
                  <a 
                    href="/warehouse-direct-link.html?target=picking"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    onClick={() => {
                      sessionStorage.setItem("test_direct_picking_clicked", "true");
                      sessionStorage.setItem("test_timestamp", new Date().toISOString());
                    }}
                  >
                    Warehouse Picking <ArrowRight size={16} />
                  </a>
                  <a 
                    href="/warehouse-direct-link.html?target=packing"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    onClick={() => {
                      sessionStorage.setItem("test_direct_packing_clicked", "true");
                      sessionStorage.setItem("test_timestamp", new Date().toISOString());
                    }}
                  >
                    Warehouse Packing <ArrowRight size={16} />
                  </a>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium">Order Management</h3>
                  <a 
                    href="/orders-direct"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    onClick={() => {
                      sessionStorage.setItem("test_direct_orders_clicked", "true");
                      sessionStorage.setItem("test_timestamp", new Date().toISOString());
                    }}
                  >
                    Orders Direct <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <p className="text-sm text-gray-500">
                These links navigate directly to the page without using the React Router.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="router-links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Router Links</CardTitle>
              <CardDescription>
                Test navigation using the router's Link component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium">Warehouse Operations</h3>
                  <Link 
                    href="/warehouse-picking"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    onClick={() => {
                      sessionStorage.setItem("test_router_picking_clicked", "true");
                      sessionStorage.setItem("test_timestamp", new Date().toISOString());
                    }}
                  >
                    <a className="flex items-center gap-1">
                      Warehouse Picking <ArrowRight size={16} />
                    </a>
                  </Link>
                  <Link 
                    href="/warehouse-packing"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    onClick={() => {
                      sessionStorage.setItem("test_router_packing_clicked", "true");
                      sessionStorage.setItem("test_timestamp", new Date().toISOString());
                    }}
                  >
                    <a className="flex items-center gap-1">
                      Warehouse Packing <ArrowRight size={16} />
                    </a>
                  </Link>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium">Order Management</h3>
                  <Link 
                    href="/order-management"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    onClick={() => {
                      sessionStorage.setItem("test_router_orders_clicked", "true");
                      sessionStorage.setItem("test_timestamp", new Date().toISOString());
                    }}
                  >
                    <a className="flex items-center gap-1">
                      Order Management <ArrowRight size={16} />
                    </a>
                  </Link>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <p className="text-sm text-gray-500">
                These links use the router's Link component for navigation.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="test-results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Test Results</CardTitle>
              <CardDescription>
                Results from navigation attempts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {Object.keys(testResults).length === 0 ? (
                  <p className="text-center text-gray-500 italic py-8">
                    No test results available. Run some navigation tests first.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(testResults).map(([key, success]) => (
                      <div key={key} className="flex items-center gap-2 p-2 border rounded-md">
                        {success ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : (
                          <XCircle className="text-red-500" size={20} />
                        )}
                        <span>{key.replace('_', ' ')}</span>
                        <Badge variant={success ? "success" : "destructive"}>
                          {success ? "Success" : "Failed"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
              <Button variant="outline" onClick={() => setTestResults({})}>
                Clear Results
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Separator />
      
      <div className="text-sm text-gray-500">
        <p>This page is used to test navigation between different parts of the application.</p>
        <p>Navigation flags in sessionStorage: {Object.keys(sessionStorage).filter(key => 
          key.includes('direct') || key.includes('test_') || key.includes('navigation')
        ).join(', ')}</p>
      </div>
    </div>
  );
}