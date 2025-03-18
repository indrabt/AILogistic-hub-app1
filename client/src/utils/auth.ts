
import { UserRole } from "@/shared/types";

export function checkPermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function getDefaultRoute(role: UserRole): string {
  const routes = {
    warehouse_staff: "/warehouse",
    logistics_manager: "/logistics",
    driver: "/routes",
    sales: "/clients",
    business_owner: "/dashboard"
  };
  return routes[role] || "/dashboard";
}
