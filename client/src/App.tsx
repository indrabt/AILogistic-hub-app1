import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import SidebarLayout from "@/components/layouts/SidebarLayout";
import DriverSidebarLayout from "@/components/layouts/DriverSidebarLayout";
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
import DriverWeather from "@/pages/driver-weather";
import DriverSettings from "@/pages/driver-settings";
import DriverRoutes from "@/pages/driver-routes";
import DriverNavigation from "@/pages/driver-navigation";
import DriverSchedule from "@/pages/driver-schedule";
import WarehouseDashboard from "@/pages/warehouse-dashboard";
import RealTimeDashboard from "@/pages/real-time-dashboard";
import RetailDashboard from "@/pages/retail-dashboard";
import LocalSourcing from "@/pages/local-sourcing";
import IntegrationKit from "@/pages/integration-kit";
import InventoryTracker from "@/pages/inventory-tracker";
import OrderManagement from "@/pages/order-management";
import OrderManagementRouter from "@/components/OrderManagementRouter";
import OrdersDirectTest from "@/pages/orders-direct-test";
import OrdersDirect from "@/pages/orders-direct";

function Router() {
  const [location] = useLocation();
  
  // Don't use SidebarLayout for certain pages
  const noSidebarPaths = ['/login'];
  // Don't use main SidebarLayout for driver pages since they have their own sidebar
  const driverPaths = [
    '/driver-dashboard', 
    '/driver-schedule',
    '/driver-routes',
    '/driver-navigation',
    '/driver-weather',
    '/driver-settings'
  ];
  const showSidebar = !noSidebarPaths.includes(location) && !driverPaths.some(path => location.startsWith(path));
  
  const RouterContent = () => {
    console.log('Rendering route component for path:', location);
    
    return (
      <ProtectedRoute>
        <Switch>
          {/* More specific routes first */}
          <Route path="/login" component={Login} />
          <Route path="/orders-direct" component={() => {
            console.log('Orders Direct Access component being rendered directly');
            console.log('Current path:', window.location.pathname);
            console.log('Rendering timestamp:', new Date().toISOString());
            // Insert a flag in session storage to track successful loads
            sessionStorage.setItem("ordersDirectAccessed", "true");
            return <OrdersDirect />;
          }} />
          <Route path="/orders-direct-test" component={OrdersDirectTest} />
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
          <Route path="/order-management" component={() => {
            console.log('Order Management component being rendered');
            console.log('Current path:', window.location.pathname);
            console.log('Current URL:', window.location.href);
            console.log('Rendering timestamp:', new Date().toISOString());
            return <OrderManagement />;
          }} />
          <Route path="/driver-dashboard" component={DriverDashboard} />
          <Route path="/driver-schedule" component={DriverSchedule} />
          <Route path="/driver-routes" component={DriverRoutes} />
          <Route path="/driver-navigation" component={DriverNavigation} />
          <Route path="/driver-weather" component={DriverWeather} />
          <Route path="/driver-settings" component={DriverSettings} />
          <Route path="/warehouse-dashboard" component={WarehouseDashboard} />
          <Route path="/real-time-dashboard" component={RealTimeDashboard} />
          <Route path="/retail-dashboard" component={RetailDashboard} />
          <Route path="/demand-prediction" component={RetailDashboard} />
          <Route path="/local-sourcing" component={LocalSourcing} />
          <Route path="/pricing-assistant" component={RetailDashboard} />
          <Route path="/inventory-tracker" component={InventoryTracker} />
          <Route path="/loyalty-program" component={RetailDashboard} />
          <Route path="/waste-management" component={RetailDashboard} />
          <Route path="/integration-kit" component={IntegrationKit} />
          <Route path="/staff-training" component={RetailDashboard} />
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
