import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import SidebarLayout from "@/components/layouts/SidebarLayout";
import Dashboard from "@/pages/dashboard";
import Routes from "@/pages/routes";
import SupplyChain from "@/pages/supply-chain";
import DemandForecasting from "@/pages/demand-forecasting";
import WeatherImpact from "@/pages/weather-impact";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

// Placeholder for AI Analytics while fixing issues
const AIAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Predictive Analytics</h1>
          <p className="text-muted-foreground">
            Advanced AI-driven insights, predictions, and anomaly detection
          </p>
        </div>
      </div>
      <div className="p-6 border rounded-md bg-background">
        <p>AI analytics dashboard is currently being implemented.</p>
      </div>
    </div>
  );
};

function Router() {
  return (
    <SidebarLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/routes" component={Routes} />
        <Route path="/supply-chain" component={SupplyChain} />
        <Route path="/demand-forecasting" component={DemandForecasting} />
        <Route path="/weather-impact" component={WeatherImpact} />
        <Route path="/ai-analytics" component={AIAnalytics} />
        <Route path="/reports" component={Reports} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </SidebarLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
