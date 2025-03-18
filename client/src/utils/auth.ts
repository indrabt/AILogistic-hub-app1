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
    business_owner: "/dashboard",
    warehouse_operator: "/warehouse-operator", // Added route for warehouse operator
    manufacturer: "/manufacturer",           // Added route for manufacturer
    courier: "/courier",                     // Added route for courier
    government_official: "/government"       // Added route for government official
  };
  return routes[role] || "/dashboard";
}

export type UserRole = "warehouse_staff" | "logistics_manager" | "driver" | "sales" | "business_owner" | "warehouse_operator" | "manufacturer" | "courier" | "government_official";