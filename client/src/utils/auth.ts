// Define UserRole type matching the one in shared/schema.ts
export type UserRole = "warehouse_staff" | "logistics_manager" | "driver" | "sales" | "business_owner";

export function checkPermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function getDefaultRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    warehouse_staff: "/warehouse-dashboard",
    logistics_manager: "/dashboard",
    driver: "/driver-dashboard",
    sales: "/dashboard",
    business_owner: "/business-dashboard"
  };
  return routes[role] || "/dashboard";
}

// Note: The UserRole type is defined at the top of this file