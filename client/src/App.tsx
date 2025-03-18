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
import HyperLocalRouting from "@/pages/hyper-local-routing";
import AIAnalytics from "@/pages/ai-analytics";

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
        <Route path="/hyper-local-routing" component={HyperLocalRouting} />
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
