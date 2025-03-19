import WeatherImpact from "@/pages/weather-impact";
import DriverSidebarLayout from "@/components/layouts/DriverSidebarLayout";

export default function DriverWeather() {
  return (
    <DriverSidebarLayout>
      <div className="container mx-auto p-4 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Weather Alerts</h1>
          <p className="text-muted-foreground">Weather events affecting your routes</p>
        </header>
        
        <WeatherImpact />
      </div>
    </DriverSidebarLayout>
  );
}