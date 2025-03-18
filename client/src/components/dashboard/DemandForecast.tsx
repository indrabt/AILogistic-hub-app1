import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface ForecastData {
  lastWeek: {
    value: number;
    label: string;
  };
  currentWeek: {
    value: number;
    label: string;
  };
  nextWeek: {
    value: number;
    label: string;
  };
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

const DemandForecast = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<any>(null);
  
  const { data: forecastData, isLoading } = useQuery<ForecastData>({
    queryKey: ["/api/forecast"],
  });

  // This is a simple SVG chart simulation - in a real app, we would use a proper charting library like Chart.js
  const generateSVGPath = () => {
    // Sample data points
    const points = [60, 65, 70, 68, 72, 78, 82];
    const width = 400;
    const height = 200;
    const padding = 20;
    const availableWidth = width - (padding * 2);
    const availableHeight = height - (padding * 2);
    
    const xStep = availableWidth / (points.length - 1);
    const maxValue = Math.max(...points);
    const yScale = availableHeight / maxValue;
    
    let path = `M ${padding} ${height - (points[0] * yScale) - padding}`;
    
    for (let i = 1; i < points.length; i++) {
      const x = padding + (i * xStep);
      const y = height - (points[i] * yScale) - padding;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  return (
    <Card className="shadow h-full">
      <CardHeader className="p-4 border-b border-gray-200 flex-row flex items-center justify-between space-y-0">
        <CardTitle className="font-bold text-gray-800">Demand Forecast</CardTitle>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary focus:outline-none">
          <MoreVertical size={18} />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64 w-full bg-gray-50 rounded-md overflow-hidden">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading forecast data...</span>
            </div>
          ) : (
            <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="none">
              {/* Chart grid */}
              <line x1="20" y1="20" x2="20" y2="180" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="20" y1="180" x2="380" y2="180" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="20" y1="140" x2="380" y2="140" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              <line x1="20" y1="100" x2="380" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              <line x1="20" y1="60" x2="380" y2="60" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              
              {/* Axis labels */}
              <text x="15" y="180" fontSize="8" textAnchor="end" fill="#6b7280">0</text>
              <text x="15" y="140" fontSize="8" textAnchor="end" fill="#6b7280">100</text>
              <text x="15" y="100" fontSize="8" textAnchor="end" fill="#6b7280">200</text>
              <text x="15" y="60" fontSize="8" textAnchor="end" fill="#6b7280">300</text>
              <text x="15" y="20" fontSize="8" textAnchor="end" fill="#6b7280">400</text>
              
              {/* Data line */}
              <path d={generateSVGPath()} fill="none" stroke="#1a237e" strokeWidth="2" />
              
              {/* Forecast area */}
              <path d="M273 118 L330 107 L380 98 L380 180 L273 180 Z" fill="rgba(26, 35, 126, 0.1)" />
              
              {/* Data points */}
              <circle cx="20" cy="120" r="3" fill="#1a237e" />
              <circle cx="78" cy="115" r="3" fill="#1a237e" />
              <circle cx="136" cy="110" r="3" fill="#1a237e" />
              <circle cx="194" cy="112" r="3" fill="#1a237e" />
              <circle cx="252" cy="108" r="3" fill="#1a237e" />
              <circle cx="310" cy="102" r="3" fill="#1a237e" stroke="#ffffff" strokeWidth="1" />
              <circle cx="368" cy="98" r="3" fill="#1a237e" stroke="#ffffff" strokeWidth="1" />
            </svg>
          )}
        </div>
        
        <div className="flex justify-between mt-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500">Last Week</p>
            <p className="font-bold">421 units</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">This Week</p>
            <p className="font-bold">465 units</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Next Week</p>
            <p className="font-bold text-primary">503 units</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandForecast;
