import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DownloadIcon, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, ChevronUp, ChevronDown } from "lucide-react";

const generateForecastData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const historicalData = [420, 380, 450, 510, 480, 520, 550, 590, 610, 640, 660, 680];
  const forecastData = [700, 730, 750, 790, 810, 840];
  
  return {
    labels: [...months, ...months.slice(0, 6).map(m => `${m} (Forecast)`)],
    historicalData,
    forecastData
  };
};

const ProductForecastTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-4 font-medium text-sm text-gray-600">Product</th>
            <th className="text-left p-4 font-medium text-sm text-gray-600">Current</th>
            <th className="text-left p-4 font-medium text-sm text-gray-600">Next Month</th>
            <th className="text-left p-4 font-medium text-sm text-gray-600">Trend</th>
            <th className="text-left p-4 font-medium text-sm text-gray-600">Confidence</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-4">
              <div>
                <p className="font-medium text-sm">Electronics</p>
                <p className="text-xs text-gray-500">Smart devices, components</p>
              </div>
            </td>
            <td className="p-4 text-sm">1,245 units</td>
            <td className="p-4">
              <div className="flex items-center">
                <span className="text-sm">1,380 units</span>
                <span className="ml-2 text-green-500 text-xs flex items-center">
                  <ArrowUpRight size={12} /> 10.8%
                </span>
              </div>
            </td>
            <td className="p-4">
              <span className="inline-block w-20 h-8">
                <svg viewBox="0 0 100 30" className="w-full h-full">
                  <path d="M0,25 L20,20 L40,15 L60,10 L80,5 L100,2" fill="none" stroke="#10b981" strokeWidth="2" />
                </svg>
              </span>
            </td>
            <td className="p-4">
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">High (92%)</span>
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-4">
              <div>
                <p className="font-medium text-sm">Apparel</p>
                <p className="text-xs text-gray-500">Clothing, accessories</p>
              </div>
            </td>
            <td className="p-4 text-sm">3,850 units</td>
            <td className="p-4">
              <div className="flex items-center">
                <span className="text-sm">4,220 units</span>
                <span className="ml-2 text-green-500 text-xs flex items-center">
                  <ArrowUpRight size={12} /> 9.6%
                </span>
              </div>
            </td>
            <td className="p-4">
              <span className="inline-block w-20 h-8">
                <svg viewBox="0 0 100 30" className="w-full h-full">
                  <path d="M0,15 L20,17 L40,12 L60,5 L80,7 L100,2" fill="none" stroke="#10b981" strokeWidth="2" />
                </svg>
              </span>
            </td>
            <td className="p-4">
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">High (89%)</span>
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-4">
              <div>
                <p className="font-medium text-sm">Furniture</p>
                <p className="text-xs text-gray-500">Home, office furnishings</p>
              </div>
            </td>
            <td className="p-4 text-sm">920 units</td>
            <td className="p-4">
              <div className="flex items-center">
                <span className="text-sm">880 units</span>
                <span className="ml-2 text-red-500 text-xs flex items-center">
                  <ArrowDownRight size={12} /> 4.3%
                </span>
              </div>
            </td>
            <td className="p-4">
              <span className="inline-block w-20 h-8">
                <svg viewBox="0 0 100 30" className="w-full h-full">
                  <path d="M0,10 L20,12 L40,15 L60,20 L80,22 L100,25" fill="none" stroke="#ef4444" strokeWidth="2" />
                </svg>
              </span>
            </td>
            <td className="p-4">
              <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Medium (76%)</span>
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-4">
              <div>
                <p className="font-medium text-sm">Food & Beverage</p>
                <p className="text-xs text-gray-500">Perishable goods</p>
              </div>
            </td>
            <td className="p-4 text-sm">5,120 units</td>
            <td className="p-4">
              <div className="flex items-center">
                <span className="text-sm">5,230 units</span>
                <span className="ml-2 text-green-500 text-xs flex items-center">
                  <ArrowUpRight size={12} /> 2.1%
                </span>
              </div>
            </td>
            <td className="p-4">
              <span className="inline-block w-20 h-8">
                <svg viewBox="0 0 100 30" className="w-full h-full">
                  <path d="M0,15 L20,14 L40,16 L60,14 L80,13 L100,12" fill="none" stroke="#10b981" strokeWidth="2" />
                </svg>
              </span>
            </td>
            <td className="p-4">
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">High (88%)</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default function DemandForecasting() {
  const [forecastPeriod, setForecastPeriod] = useState("6");
  const [productCategory, setProductCategory] = useState("all");
  const { labels, historicalData, forecastData } = generateForecastData();
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Demand Forecasting</h2>
        <p className="text-gray-600">AI-powered demand prediction and trend analysis</p>
      </div>

      {/* Filters and Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center bg-white rounded-lg border border-gray-200 px-3 py-1">
            <Calendar className="text-gray-500 mr-2 h-4 w-4" />
            <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
              <SelectTrigger className="text-sm text-gray-600 bg-transparent border-none shadow-none h-auto py-1 w-40">
                <SelectValue placeholder="Forecast period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Next 3 Months</SelectItem>
                <SelectItem value="6">Next 6 Months</SelectItem>
                <SelectItem value="12">Next 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="inline-flex items-center bg-white rounded-lg border border-gray-200 px-3 py-1">
            <Select value={productCategory} onValueChange={setProductCategory}>
              <SelectTrigger className="text-sm text-gray-600 bg-transparent border-none shadow-none h-auto py-1 w-40">
                <SelectValue placeholder="Product Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="apparel">Apparel</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="food">Food & Beverage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button variant="secondary" className="bg-green-700 hover:bg-green-800 text-white">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export Forecast
        </Button>
      </div>

      {/* Demand Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Current Month Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">11,135</div>
              <span className="text-green-500 text-sm flex items-center">
                <ArrowUpRight size={14} className="mr-1" /> 
                8.2%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">vs. Previous Month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Next Month Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">11,710</div>
              <span className="text-green-500 text-sm flex items-center">
                <ArrowUpRight size={14} className="mr-1" /> 
                5.2%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Expected Growth</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Forecast Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">92.4%</div>
              <span className="text-green-500 text-sm flex items-center">
                <ArrowUpRight size={14} className="mr-1" /> 
                1.8%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Last 3 Month Average</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Forecast Chart */}
      <Card className="mb-6">
        <CardHeader className="border-b border-gray-200">
          <div className="flex justify-between">
            <CardTitle>Demand Forecast Trend</CardTitle>
            <Tabs defaultValue="units">
              <TabsList>
                <TabsTrigger value="units">Units</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-80 w-full">
            {/* This would use a proper chart library in production */}
            <svg viewBox="0 0 1000 350" width="100%" height="100%" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="50" y1="320" x2="950" y2="320" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="50" y1="240" x2="950" y2="240" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="50" y1="160" x2="950" y2="160" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="50" y1="80" x2="950" y2="80" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              
              {/* Y-axis labels */}
              <text x="45" y="320" textAnchor="end" fill="#6b7280" fontSize="12">0</text>
              <text x="45" y="240" textAnchor="end" fill="#6b7280" fontSize="12">250</text>
              <text x="45" y="160" textAnchor="end" fill="#6b7280" fontSize="12">500</text>
              <text x="45" y="80" textAnchor="end" fill="#6b7280" fontSize="12">750</text>
              
              {/* X-axis labels (months) */}
              {labels.map((month, i) => {
                const x = 50 + (i * 900 / (labels.length - 1));
                return (
                  <text 
                    key={i} 
                    x={x} 
                    y="340" 
                    textAnchor="middle" 
                    fill="#6b7280" 
                    fontSize="12"
                  >
                    {month}
                  </text>
                );
              })}
              
              {/* Historical data line */}
              <polyline 
                points={historicalData.map((value, i) => {
                  const x = 50 + (i * 900 / (labels.length - 1));
                  const y = 320 - (value / 750 * 240);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#1a237e"
                strokeWidth="3"
              />
              
              {/* Forecast data line (dashed) */}
              <polyline 
                points={forecastData.map((value, i) => {
                  const x = 50 + ((i + historicalData.length) * 900 / (labels.length - 1));
                  const y = 320 - (value / 750 * 240);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#1a237e"
                strokeWidth="3"
                strokeDasharray="5,5"
              />
              
              {/* Forecast confidence interval */}
              <path 
                d={`
                  M ${50 + (historicalData.length * 900 / (labels.length - 1))},${320 - (forecastData[0] / 750 * 240 - 20)}
                  ${forecastData.map((value, i) => {
                    const x = 50 + ((i + historicalData.length) * 900 / (labels.length - 1));
                    const y = 320 - (value / 750 * 240 - 20);
                    return `L ${x},${y}`;
                  }).join(' ')}
                  ${forecastData.slice().reverse().map((value, i) => {
                    const idx = forecastData.length - 1 - i;
                    const x = 50 + ((idx + historicalData.length) * 900 / (labels.length - 1));
                    const y = 320 - (value / 750 * 240 + 20);
                    return `L ${x},${y}`;
                  }).join(' ')}
                  Z
                `}
                fill="rgba(26, 35, 126, 0.1)"
              />
              
              {/* Data points for historical data */}
              {historicalData.map((value, i) => {
                const x = 50 + (i * 900 / (labels.length - 1));
                const y = 320 - (value / 750 * 240);
                return <circle key={i} cx={x} cy={y} r="4" fill="#1a237e" />;
              })}
              
              {/* Data points for forecast data */}
              {forecastData.map((value, i) => {
                const x = 50 + ((i + historicalData.length) * 900 / (labels.length - 1));
                const y = 320 - (value / 750 * 240);
                return <circle key={i} cx={x} cy={y} r="4" fill="#1a237e" stroke="#ffffff" strokeWidth="2" />;
              })}
              
              {/* Legend */}
              <circle cx="750" cy="30" r="4" fill="#1a237e" />
              <text x="760" y="35" fill="#6b7280" fontSize="12">Historical Data</text>
              
              <circle cx="750" cy="50" r="4" fill="#1a237e" stroke="#ffffff" strokeWidth="2" />
              <text x="760" y="55" fill="#6b7280" fontSize="12">Forecast Data</text>
              
              <rect x="750" y="65" width="10" height="10" fill="rgba(26, 35, 126, 0.1)" />
              <text x="770" y="75" fill="#6b7280" fontSize="12">Confidence Interval (±5%)</text>
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Product Category Forecasts */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle>Product Category Forecasts</CardTitle>
            <Button variant="outline" size="sm">
              <TrendingUp className="mr-2 h-4 w-4" /> 
              Run Advanced Analysis
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ProductForecastTable />
        </CardContent>
      </Card>
    </div>
  );
}
