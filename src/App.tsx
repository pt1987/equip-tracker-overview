
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

const queryClient = new QueryClient();

const AppContent = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative min-h-screen">
      <Toaster />
      <Sonner />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />
          
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
                    <Route path="/dashboard" element={<Dashboard />} />
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
                    
                    {/* Updated Reporting Routes */}
                    <Route path="/reporting" element={<ReportingOverview />} />
                    <Route path="/reporting/order-timeline" element={<OrderTimeline />} />
                    <Route path="/reporting/yearly-budget" element={<YearlyBudget />} />
                    <Route path="/reporting/yearly-purchases" element={<YearlyPurchases />} />
                    <Route path="/reporting/usage-duration" element={<UsageDuration />} />
                    <Route path="/reporting/warranty-defects" element={<WarrantyDefects />} />
                    <Route path="/reporting/fixed-assets" element={<FixedAssets />} />
                    <Route path="/reporting/employee-budget" element={<EmployeeBudget />} />
                    <Route path="/reporting/vendor-analysis" element={<VendorAnalysis />} />
                    
                    {/* Add missing report routes */}
                    <Route path="/reporting/asset-lifecycle" element={<AssetLifecycle />} />
                    <Route path="/reporting/maintenance-cost" element={<MaintenanceCost />} />
                    <Route path="/reporting/software-license" element={<SoftwareLicense />} />
                    <Route path="/reporting/department-assets" element={<DepartmentAssets />} />
                    <Route path="/reporting/asset-utilization" element={<AssetUtilization />} />
                    <Route path="/reporting/replacement-planning" element={<ReplacementPlanning />} />
                    <Route path="/reporting/carbon-footprint" element={<CarbonFootprint />} />
                    <Route path="/reporting/roii" element={<ROII />} />
                    <Route path="/reporting/vendor-comparison" element={<VendorComparison />} />
                    
                    <Route path="/depreciation" element={<Depreciation />} />
                    <Route path="/damage-management" element={<DamageManagement />} />
                    <Route path="/hardware-order" element={<HardwareOrder />} />
                    <Route path="/bookings" element={<AssetBookings />} />
                    <Route path="/purchase-list" element={<PurchaseList />} />
                    
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
