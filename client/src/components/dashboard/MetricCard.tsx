import { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change: {
    value: string;
    trend: "up" | "down";
  };
  iconBgColor: string;
  iconColor: string;
}

const MetricCard = ({
  title,
  value,
  icon,
  change,
  iconBgColor,
  iconColor,
}: MetricCardProps) => {
  const isPositiveTrend = change.trend === "up";
  const colorClass = isPositiveTrend ? "text-green-500" : "text-red-500";

  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      <div
        className={cn(
          "rounded-full h-12 w-12 flex items-center justify-center mr-4",
          iconBgColor
        )}
      >
        <span className={iconColor}>{icon}</span>
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <div className={cn("flex items-center text-xs", colorClass)}>
          {isPositiveTrend ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
          <span>{change.value}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
