import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { toast } from "@/hooks/use-toast";

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  
  // Show a user-friendly toast notification
  toast({
    title: 'Application Error',
    description: 'An unexpected error occurred. Please try again or contact support if the issue persists.',
    variant: 'destructive',
  });
  
  // Prevent the default browser error handling
  event.preventDefault();
});

// Global error handler for uncaught exceptions
window.addEventListener('error', (event) => {
  console.error('Uncaught Error:', event.error);
  
  // Show a user-friendly toast notification (if it's not already shown for this error)
  if (!event.error?._toastShown) {
    toast({
      title: 'Application Error',
      description: 'An unexpected error occurred. Please try again or contact support if the issue persists.',
      variant: 'destructive',
    });
    
    // Mark this error as having shown a toast to prevent duplicate notifications
    if (event.error) {
      event.error._toastShown = true;
    }
  }
  
  // Prevent the default browser error handling
  event.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
