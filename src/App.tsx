
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, ProtectedRoute } from "@/hooks/use-auth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Assets from "./pages/Assets";
import CreateEditAsset from "./pages/CreateEditAsset";
import AssetDetail from "./pages/AssetDetail";
import Employees from "./pages/Employees";
import CreateEditEmployee from "./pages/CreateEditEmployee";
import EmployeeDetail from "./pages/EmployeeDetail";
import Depreciation from "./pages/Depreciation";
import Reporting from "./pages/Reporting";
import History from "./pages/History";
import PoolAssets from "./pages/PoolAssets";
import HardwareOrder from "./pages/HardwareOrder";
import AssetBookings from "./pages/AssetBookings";
import PurchaseList from "./pages/PurchaseList";
import DamageManagement from "./pages/DamageManagement";
import LicenseManagement from "./pages/LicenseManagement";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

// Report pages
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

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminRoles from "./pages/admin/Roles";
import AdminLogs from "./pages/admin/Logs";
import AdminIntune from "./pages/admin/Intune";
import AdminLandingPageImages from "./pages/admin/LandingPageImages";
import AdminDocuments from "./pages/admin/Documents";
import AdminLayout from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/assets" element={
                <ProtectedRoute>
                  <Assets />
                </ProtectedRoute>
              } />
              <Route path="/assets/new" element={
                <ProtectedRoute>
                  <CreateEditAsset />
                </ProtectedRoute>
              } />
              <Route path="/assets/:id" element={
                <ProtectedRoute>
                  <AssetDetail />
                </ProtectedRoute>
              } />
              <Route path="/assets/:id/edit" element={
                <ProtectedRoute>
                  <CreateEditAsset />
                </ProtectedRoute>
              } />
              <Route path="/employees" element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              } />
              <Route path="/employees/new" element={
                <ProtectedRoute>
                  <CreateEditEmployee />
                </ProtectedRoute>
              } />
              <Route path="/employees/:id" element={
                <ProtectedRoute>
                  <EmployeeDetail />
                </ProtectedRoute>
              } />
              <Route path="/employees/:id/edit" element={
                <ProtectedRoute>
                  <CreateEditEmployee />
                </ProtectedRoute>
              } />
              <Route path="/depreciation" element={
                <ProtectedRoute>
                  <Depreciation />
                </ProtectedRoute>
              } />
              <Route path="/reporting" element={
                <ProtectedRoute>
                  <Reporting />
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
              <Route path="/damage-management" element={
                <ProtectedRoute>
                  <DamageManagement />
                </ProtectedRoute>
              } />
              <Route path="/license-management" element={
                <ProtectedRoute>
                  <LicenseManagement />
                </ProtectedRoute>
              } />
              
              {/* Reporting routes */}
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
              
              {/* Admin routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="roles" element={<AdminRoles />} />
                      <Route path="logs" element={<AdminLogs />} />
                      <Route path="intune" element={<AdminIntune />} />
                      <Route path="landing-page-images" element={<AdminLandingPageImages />} />
                      <Route path="documents" element={<AdminDocuments />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
