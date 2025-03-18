import { cn } from "@/lib/utils";
import { LayoutDashboard, Route, Warehouse, MoreHorizontal, Navigation } from "lucide-react";

interface MobileNavProps {
  currentPath: string;
}

const MobileNav = ({ currentPath }: MobileNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 md:hidden z-40">
      <div 
        className={cn(
          "p-2 flex flex-col items-center cursor-pointer",
          currentPath === "/" ? "text-primary" : "text-gray-500"
        )}
        onClick={() => window.location.href = "/"}
      >
        <LayoutDashboard size={20} />
        <span className="text-xs mt-1">Dashboard</span>
      </div>
      
      <div 
        className={cn(
          "p-2 flex flex-col items-center cursor-pointer",
          currentPath === "/routes" ? "text-primary" : "text-gray-500"
        )}
        onClick={() => window.location.href = "/routes"}
      >
        <Route size={20} />
        <span className="text-xs mt-1">Routes</span>
      </div>
      
      <div 
        className={cn(
          "p-2 flex flex-col items-center cursor-pointer",
          currentPath === "/hyper-local-routing" ? "text-primary" : "text-gray-500"
        )}
        onClick={() => window.location.href = "/hyper-local-routing"}
      >
        <Navigation size={20} />
        <span className="text-xs mt-1">Local</span>
      </div>
      
      <div 
        className={cn(
          "p-2 flex flex-col items-center cursor-pointer",
          currentPath === "/supply-chain" ? "text-primary" : "text-gray-500"
        )}
        onClick={() => window.location.href = "/supply-chain"}
      >
        <Warehouse size={20} />
        <span className="text-xs mt-1">Supply</span>
      </div>
      
      <div 
        className={cn(
          "p-2 flex flex-col items-center cursor-pointer",
          ["/demand-forecasting", "/weather-impact", "/ai-analytics", "/reports", "/settings", 
           "/supply-chain-resilience", "/sustainability", "/cybersecurity", "/multi-modal-logistics"].includes(currentPath) 
            ? "text-primary" 
            : "text-gray-500"
        )}
        onClick={() => window.location.href = "/settings"}
      >
        <MoreHorizontal size={20} />
        <span className="text-xs mt-1">More</span>
      </div>
    </div>
  );
};

export default MobileNav;
