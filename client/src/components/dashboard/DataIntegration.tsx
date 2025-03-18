import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUpload, Box, Globe, BarChart3, Check } from "lucide-react";

const DataIntegration = () => {
  return (
    <Card className="shadow mb-6">
      <CardHeader className="p-4 border-b border-gray-200">
        <CardTitle className="font-bold text-gray-800">Data Integration</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Upload Data</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <CloudUpload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Drag and drop files here or click to browse</p>
              <p className="text-xs text-gray-500 mb-4">Supported formats: CSV, XLS, JSON</p>
              <Button className="bg-primary hover:bg-primary/90">
                <CloudUpload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">API Integration</h4>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-200">
                <div className="flex items-center">
                  <Box className="text-gray-500 mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Available Integrations</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center mr-3">
                      <Box className="text-blue-600 h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">ERP System</p>
                      <p className="text-xs text-gray-500">Connect to your enterprise data</p>
                    </div>
                  </div>
                  <Button variant="link" className="text-primary text-sm">
                    Connect
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center mr-3">
                      <Globe className="text-green-600 h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Weather API</p>
                      <p className="text-xs text-gray-500">Real-time weather updates</p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-500 text-sm">
                    <Check className="h-4 w-4 mr-1" />
                    Connected
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center mr-3">
                      <BarChart3 className="text-purple-600 h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Analytics Platform</p>
                      <p className="text-xs text-gray-500">Advanced data analysis</p>
                    </div>
                  </div>
                  <Button variant="link" className="text-primary text-sm">
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataIntegration;
