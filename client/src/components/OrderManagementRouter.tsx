/**
 * Order Management Router Component
 * 
 * This component provides a router-independent way to access Order Management functionality.
 * It serves as a simple wrapper to avoid React Router/wouter dependencies and ensure
 * the Order Management page is always accessible regardless of routing issues.
 */

import React from 'react';
import OrdersDirectAccess from '../pages/orders-direct';

interface OrderManagementRouterProps {
  // Add any props if needed in the future
}

export default function OrderManagementRouter({}: OrderManagementRouterProps) {
  return (
    <div className="order-management-router">
      <OrdersDirectAccess />
    </div>
  );
}

// This is a utility function to navigate to the Order Management page directly
// without relying on any router
export function navigateToOrderManagement() {
  // We could use different strategies here:
  // 1. Use window.location to navigate to a dedicated URL
  // 2. Set a flag in localStorage/sessionStorage to activate the component
  // 3. Use a pub/sub pattern to trigger showing the component
  
  // For now, we'll use the simplest approach - direct navigation
  window.location.href = '/orders-direct';
}