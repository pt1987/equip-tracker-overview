
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
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
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/assets/new" element={<CreateEditAsset />} />
            <Route path="/assets/:id" element={<AssetDetail />} />
            <Route path="/assets/:id/edit" element={<CreateEditAsset />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/new" element={<CreateEditEmployee />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
            <Route path="/employees/:id/edit" element={<CreateEditEmployee />} />
            <Route path="/depreciation" element={<Depreciation />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/history" element={<History />} />
            <Route path="/pool-assets" element={<PoolAssets />} />
            <Route path="/hardware-order" element={<HardwareOrder />} />
            <Route path="/bookings" element={<AssetBookings />} />
            <Route path="/purchase-list" element={<PurchaseList />} />
            <Route path="/damage-management" element={<DamageManagement />} />
            <Route path="/license-management" element={<LicenseManagement />} />
            
            {/* Reporting routes */}
            <Route path="/reporting" element={<ReportingOverview />} />
            <Route path="/reporting/order-timeline" element={<OrderTimeline />} />
            <Route path="/reporting/yearly-budget" element={<YearlyBudget />} />
            <Route path="/reporting/yearly-purchases" element={<YearlyPurchases />} />
            <Route path="/reporting/usage-duration" element={<UsageDuration />} />
            <Route path="/reporting/warranty-defects" element={<WarrantyDefects />} />
            <Route path="/reporting/fixed-assets" element={<FixedAssets />} />
            <Route path="/reporting/employee-budget" element={<EmployeeBudget />} />
            <Route path="/reporting/vendor-analysis" element={<VendorAnalysis />} />
            <Route path="/reporting/asset-lifecycle" element={<AssetLifecycle />} />
            <Route path="/reporting/maintenance-cost" element={<MaintenanceCost />} />
            <Route path="/reporting/software-license" element={<SoftwareLicense />} />
            <Route path="/reporting/department-assets" element={<DepartmentAssets />} />
            <Route path="/reporting/asset-utilization" element={<AssetUtilization />} />
            <Route path="/reporting/replacement-planning" element={<ReplacementPlanning />} />
            <Route path="/reporting/carbon-footprint" element={<CarbonFootprint />} />
            <Route path="/reporting/roii" element={<ROII />} />
            <Route path="/reporting/vendor-comparison" element={<VendorComparison />} />
            
            {/* Admin routes */}
            <Route path="/admin/*" element={
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
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
