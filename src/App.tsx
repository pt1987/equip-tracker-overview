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
import LandingPage from "./pages/LandingPage";
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
import DamageManagement from "./pages/DamageManagement";
import PurchaseList from "./pages/PurchaseList";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Roles from "./pages/admin/Roles";
import Logs from "./pages/admin/Logs";
import Intune from "./pages/admin/Intune";

// Import new report pages
import ReportingOverview from "./pages/reports/ReportingOverview";
import OrderTimeline from "./pages/reports/OrderTimeline";
import YearlyBudget from "./pages/reports/YearlyBudget";
import YearlyPurchases from "./pages/reports/YearlyPurchases";
import UsageDuration from "./pages/reports/UsageDuration";
import WarrantyDefects from "./pages/reports/WarrantyDefects";
import FixedAssets from "./pages/reports/FixedAssets";
import EmployeeBudget from "./pages/reports/EmployeeBudget";
import VendorAnalysis from "./pages/reports/VendorAnalysis";
import AssetLifecycle from "./pages/reports/AssetLifecycle";
import MaintenanceCost from "./pages/reports/MaintenanceCost";
import SoftwareLicense from "./pages/reports/SoftwareLicense";
import DepartmentAssets from "./pages/reports/DepartmentAssets";
import AssetUtilization from "./pages/reports/AssetUtilization";
import ReplacementPlanning from "./pages/reports/ReplacementPlanning";
import CarbonFootprint from "./pages/reports/CarbonFootprint";
import ROII from "./pages/reports/ROII";
import VendorComparison from "./pages/reports/VendorComparison";

import "./styles/landing.css";
import "./styles/compatibility.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const isMobile = useIsMobile();
  
  console.log("Rendering AppContent component");
  
  return (
    <div className="relative min-h-screen">
      <Toaster />
      <Sonner />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes - Not protected */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
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

          {/* Main App Routes with Navbar */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <main className={`${isMobile ? 'pt-16' : 'md:pl-64'} max-w-full w-full`}>
                  <Routes>
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Keep other protected routes */}
                    <Route path="/assets" element={
                      <ProtectedRoute>
                        <Assets />
                      </ProtectedRoute>
                    } />
                    <Route path="/employees" element={
                      <ProtectedRoute>
                        <Employees />
                      </ProtectedRoute>
                    } />
                    <Route path="/asset/:id" element={
                      <ProtectedRoute>
                        <AssetDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/employee/:id" element={
                      <ProtectedRoute>
                        <EmployeeDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/history" element={
                      <ProtectedRoute>
                        <History />
                      </ProtectedRoute>
                    } />
                    <Route path="/pool-assets" element={
                      <ProtectedRoute>
                        <PoolAssets />
                      </ProtectedRoute>
                    } />
                    <Route path="/asset/create" element={
                      <ProtectedRoute>
                        <CreateEditAsset />
                      </ProtectedRoute>
                    } />
                    <Route path="/asset/edit/:id" element={
                      <ProtectedRoute>
                        <CreateEditAsset />
                      </ProtectedRoute>
                    } />
                    <Route path="/employee/create" element={
                      <ProtectedRoute>
                        <CreateEditEmployee />
                      </ProtectedRoute>
                    } />
                    <Route path="/employee/edit/:id" element={
                      <ProtectedRoute>
                        <CreateEditEmployee />
                      </ProtectedRoute>
                    } />
                    
                    {/* Updated Reporting Routes */}
                    <Route path="/reporting" element={
                      <ProtectedRoute>
                        <ReportingOverview />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/order-timeline" element={
                      <ProtectedRoute>
                        <OrderTimeline />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/yearly-budget" element={
                      <ProtectedRoute>
                        <YearlyBudget />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/yearly-purchases" element={
                      <ProtectedRoute>
                        <YearlyPurchases />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/usage-duration" element={
                      <ProtectedRoute>
                        <UsageDuration />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/warranty-defects" element={
                      <ProtectedRoute>
                        <WarrantyDefects />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/fixed-assets" element={
                      <ProtectedRoute>
                        <FixedAssets />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/employee-budget" element={
                      <ProtectedRoute>
                        <EmployeeBudget />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/vendor-analysis" element={
                      <ProtectedRoute>
                        <VendorAnalysis />
                      </ProtectedRoute>
                    } />
                    
                    {/* Add missing report routes */}
                    <Route path="/reporting/asset-lifecycle" element={
                      <ProtectedRoute>
                        <AssetLifecycle />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/maintenance-cost" element={
                      <ProtectedRoute>
                        <MaintenanceCost />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/software-license" element={
                      <ProtectedRoute>
                        <SoftwareLicense />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/department-assets" element={
                      <ProtectedRoute>
                        <DepartmentAssets />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/asset-utilization" element={
                      <ProtectedRoute>
                        <AssetUtilization />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/replacement-planning" element={
                      <ProtectedRoute>
                        <ReplacementPlanning />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/carbon-footprint" element={
                      <ProtectedRoute>
                        <CarbonFootprint />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/roii" element={
                      <ProtectedRoute>
                        <ROII />
                      </ProtectedRoute>
                    } />
                    <Route path="/reporting/vendor-comparison" element={
                      <ProtectedRoute>
                        <VendorComparison />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/depreciation" element={
                      <ProtectedRoute>
                        <Depreciation />
                      </ProtectedRoute>
                    } />
                    <Route path="/damage-management" element={
                      <ProtectedRoute>
                        <DamageManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/hardware-order" element={
                      <ProtectedRoute>
                        <HardwareOrder />
                      </ProtectedRoute>
                    } />
                    <Route path="/bookings" element={
                      <ProtectedRoute>
                        <AssetBookings />
                      </ProtectedRoute>
                    } />
                    <Route path="/purchase-list" element={
                      <ProtectedRoute>
                        <PurchaseList />
                      </ProtectedRoute>
                    } />
                    
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

const App = () => {
  console.log("Rendering App component - initializing providers");
  
  return (
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
};

export default App;
