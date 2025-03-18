import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Lightbulb, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

const QuickHelp = () => {
  return (
    <Card className="shadow mb-6">
      <CardHeader className="p-4 border-b border-gray-200">
        <CardTitle className="font-bold text-gray-800">Quick Help & Resources</CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <GraduationCap className="text-primary mr-2 h-5 w-5" />
            <h4 className="font-medium">Getting Started</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            New to AI Logistics Hub? Check out these tutorials to get started quickly.
          </p>
          <Button variant="link" className="text-primary text-sm font-medium p-0 h-auto">
            View Tutorials
          </Button>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Lightbulb className="text-primary mr-2 h-5 w-5" />
            <h4 className="font-medium">Best Practices</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Learn how to optimize your logistics operations with AI-powered insights.
          </p>
          <Button variant="link" className="text-primary text-sm font-medium p-0 h-auto">
            View Best Practices
          </Button>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Headphones className="text-primary mr-2 h-5 w-5" />
            <h4 className="font-medium">Support</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Need help? Contact our support team for assistance with any issues.
          </p>
          <Button variant="link" className="text-primary text-sm font-medium p-0 h-auto">
            Get Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickHelp;
