
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { AuthProvider, ProtectedRoute } from "@/hooks/use-auth";
import Navbar from "@/components/layout/Navbar";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "./pages/Index";
import Assets from "./pages/Assets";
import Employees from "./pages/Employees";
import AssetDetail from "./pages/AssetDetail";
import EmployeeDetail from "./pages/EmployeeDetail";
import History from "./pages/History";
import PoolAssets from "./pages/PoolAssets";
import CreateEditAsset from "./pages/CreateEditAsset";
import CreateEditEmployee from "./pages/CreateEditEmployee";
import NotFound from "./pages/NotFound";
import Reporting from "./pages/Reporting";
import Depreciation from "./pages/Depreciation";
import HardwareOrder from "./pages/HardwareOrder";
import AssetBookings from "./pages/AssetBookings";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Roles from "./pages/admin/Roles";
import Logs from "./pages/admin/Logs";
import Intune from "./pages/admin/Intune";

const queryClient = new QueryClient();

const AppContent = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative min-h-screen">
      <Toaster />
      <Sonner />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Admin Routes with Admin Layout */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/roles" element={<Roles />} />
                    <Route path="/logs" element={<Logs />} />
                    <Route path="/intune" element={<Intune />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } 
          />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Main App Routes with Navbar */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <main className={`${isMobile ? 'pt-16' : 'md:pl-64'} max-w-full w-full`}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/assets" element={<Assets />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/asset/:id" element={<AssetDetail />} />
                    <Route path="/employee/:id" element={<EmployeeDetail />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/pool-assets" element={<PoolAssets />} />
                    <Route path="/asset/create" element={<CreateEditAsset />} />
                    <Route path="/asset/edit/:id" element={<CreateEditAsset />} />
                    <Route path="/employee/create" element={<CreateEditEmployee />} />
                    <Route path="/employee/edit/:id" element={<CreateEditEmployee />} />
                    <Route path="/reporting" element={<Reporting />} />
                    <Route path="/depreciation" element={<Depreciation />} />
                    <Route path="/hardware-order" element={<HardwareOrder />} />
                    <Route path="/bookings" element={<AssetBookings />} />
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
