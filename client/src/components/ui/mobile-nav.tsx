import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Route, Warehouse, MoreHorizontal } from "lucide-react";

interface MobileNavProps {
  currentPath: string;
}

const MobileNav = ({ currentPath }: MobileNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 md:hidden z-40">
      <Link href="/">
        <a className={cn(
          "p-2 flex flex-col items-center",
          currentPath === "/" ? "text-primary" : "text-gray-500"
        )}>
          <LayoutDashboard size={20} />
          <span className="text-xs mt-1">Dashboard</span>
        </a>
      </Link>
      
      <Link href="/routes">
        <a className={cn(
          "p-2 flex flex-col items-center",
          currentPath === "/routes" ? "text-primary" : "text-gray-500"
        )}>
          <Route size={20} />
          <span className="text-xs mt-1">Routes</span>
        </a>
      </Link>
      
      <Link href="/supply-chain">
        <a className={cn(
          "p-2 flex flex-col items-center",
          currentPath === "/supply-chain" ? "text-primary" : "text-gray-500"
        )}>
          <Warehouse size={20} />
          <span className="text-xs mt-1">Supply</span>
        </a>
      </Link>
      
      <div className="relative">
        <Link href="/settings">
          <a className={cn(
            "p-2 flex flex-col items-center",
            ["/demand-forecasting", "/weather-impact", "/reports", "/settings"].includes(currentPath) 
              ? "text-primary" 
              : "text-gray-500"
          )}>
            <MoreHorizontal size={20} />
            <span className="text-xs mt-1">More</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
