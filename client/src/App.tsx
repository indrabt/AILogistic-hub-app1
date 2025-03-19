import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import SidebarLayout from "@/components/layouts/SidebarLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "@/pages/dashboard";
import Routes from "@/pages/routes";
import SupplyChain from "@/pages/supply-chain";
import DemandForecasting from "@/pages/demand-forecasting";
import WeatherImpact from "@/pages/weather-impact";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import HyperLocalRouting from "@/pages/hyper-local-routing";
import AIAnalytics from "@/pages/ai-analytics";
import SupplyChainResilience from "@/pages/supply-chain-resilience";
import Sustainability from "@/pages/sustainability";
import Cybersecurity from "@/pages/cybersecurity";
import MultiModalLogistics from "@/pages/multi-modal-logistics";
import BusinessDashboard from "@/pages/business-dashboard";
import BusinessMetrics from "@/pages/business-metrics"; // New business metrics page
import WesternSydneyUsers from "@/pages/western-sydney-users";
import Login from "@/pages/login";
import DriverDashboard from "@/pages/driver-dashboard";
import WarehouseDashboard from "@/pages/warehouse-dashboard";
import RealTimeDashboard from "@/pages/real-time-dashboard";
import RetailDashboard from "@/pages/retail-dashboard";

function Router() {
  const [location] = useLocation();
  
  // Don't use SidebarLayout for the login page
  const noSidebarPaths = ['/login'];
  const showSidebar = !noSidebarPaths.includes(location);
  
  const RouterContent = () => {
    console.log('Rendering route component for path:', location);
    
    return (
      <ProtectedRoute>
        <Switch>
          {/* More specific routes first */}
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={() => {
            console.log('Dashboard component rendered for logistics manager');
            return <Dashboard />;
          }} />
          <Route path="/routes" component={Routes} />
          <Route path="/supply-chain" component={SupplyChain} />
          <Route path="/demand-forecasting" component={DemandForecasting} />
          <Route path="/weather-impact" component={WeatherImpact} />
          <Route path="/ai-analytics" component={AIAnalytics} />
          <Route path="/hyper-local-routing" component={HyperLocalRouting} />
          <Route path="/supply-chain-resilience" component={SupplyChainResilience} />
          <Route path="/sustainability" component={Sustainability} />
          <Route path="/cybersecurity" component={Cybersecurity} />
          <Route path="/multi-modal-logistics" component={MultiModalLogistics} />
          <Route path="/business-dashboard" component={BusinessDashboard} />
          <Route path="/business-metrics" component={BusinessMetrics} />
          <Route path="/western-sydney-users" component={WesternSydneyUsers} />
          <Route path="/driver-dashboard" component={DriverDashboard} />
          <Route path="/warehouse-dashboard" component={WarehouseDashboard} />
          <Route path="/real-time-dashboard" component={RealTimeDashboard} />
          <Route path="/reports" component={Reports} />
          <Route path="/settings" component={Settings} />
          {/* Root path */}
          <Route path="/" component={() => {
            console.log('Root path component rendered - explicit placement at end');
            return <Dashboard />;
          }} />
          {/* Catch-all route for 404 at the end */}
          <Route component={NotFound} />
        </Switch>
      </ProtectedRoute>
    );
  };
  
  return showSidebar ? (
    <SidebarLayout>
      <RouterContent />
    </SidebarLayout>
  ) : (
    <RouterContent />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <Router />
        <Toaster />
      </WebSocketProvider>
    </QueryClientProvider>
  );
}

export default App;
