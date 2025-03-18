import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema, UserRole, userRoles } from "@shared/schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type LoginFormData = z.infer<typeof loginUserSchema> & {
  role: UserRole;
};

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [_, setLocation] = useLocation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(
      loginUserSchema.extend({
        role: z.enum(["warehouse_staff", "logistics_manager", "driver", "sales", "business_owner"]),
      })
    ),
    defaultValues: {
      username: "",
      password: "",
      role: "driver",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);

    try {
      // Perform role validation based on username
      let validatedRole = data.role;
      
      // Force correct roles based on username for testing convenience
      if (data.username.toLowerCase().includes('warehouse')) {
        validatedRole = 'warehouse_staff';
        console.log('Login: Username contains "warehouse", enforcing warehouse_staff role');
      } else if (data.username.toLowerCase().includes('driver')) {
        validatedRole = 'driver';
        console.log('Login: Username contains "driver", enforcing driver role');
      }
      
      // In a real app, we would authenticate with the server
      // For demo purposes, we'll simulate a login and store user info in session storage
      const userData = {
        username: data.username,
        role: validatedRole, // Use validated role
        name: `${data.username}`,
        id: Date.now(),
      };

      // Store user data in sessionStorage
      console.log('Storing user data with role:', userData.role);
      sessionStorage.setItem("user", JSON.stringify(userData));
      
      // Force clear any stale permissions
      sessionStorage.removeItem("permissions");

      // Show success message
      toast({
        title: "Login successful",
        description: `Welcome, ${data.username}!`,
      });

      // Route based on validated role, not the form selection
      if (validatedRole === "driver") {
        setLocation("/driver-dashboard");
      } else if (validatedRole === "business_owner") {
        setLocation("/business-dashboard");
      } else if (validatedRole === "warehouse_staff") {
        setLocation("/warehouse-dashboard");
      } else if (validatedRole === "logistics_manager") {
        setLocation("/dashboard");
      } else if (validatedRole === "sales") {
        setLocation("/western-sydney-users");
      } else {
        setLocation("/business-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            AI Logistics Hub
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your username" 
                        {...field} 
                        autoComplete="username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        {...field} 
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="warehouse_staff">Warehouse Staff</SelectItem>
                        <SelectItem value="logistics_manager">Logistics Manager</SelectItem>
                        <SelectItem value="business_owner">Business Owner</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Western Sydney's AI-powered logistics solution
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}