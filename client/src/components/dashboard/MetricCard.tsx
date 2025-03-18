import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: {
    value: string;
    trend: "up" | "down";
  };
  iconBgColor?: string;
  iconColor?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  change,
  iconBgColor = "bg-primary/20",
  iconColor = "text-primary",
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-full p-2 ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {change.trend === "up" ? (
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span
              className={
                change.trend === "up" ? "text-green-500" : "text-red-500"
              }
            >
              {change.value}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}