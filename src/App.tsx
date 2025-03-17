
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Dashboard from "./pages/Index";
import Assets from "./pages/Assets";
import Employees from "./pages/Employees";
import AssetDetail from "./pages/AssetDetail";
import EmployeeDetail from "./pages/EmployeeDetail";
import AssetGroups from "./pages/AssetGroups";
import History from "./pages/History";
import PoolAssets from "./pages/PoolAssets";
import CreateEditAsset from "./pages/CreateEditAsset";
import CreateEditEmployee from "./pages/CreateEditEmployee";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/asset/:id" element={<AssetDetail />} />
            <Route path="/employee/:id" element={<EmployeeDetail />} />
            <Route path="/asset-groups" element={<AssetGroups />} />
            <Route path="/history" element={<History />} />
            <Route path="/pool-assets" element={<PoolAssets />} />
            <Route path="/asset/create" element={<CreateEditAsset />} />
            <Route path="/asset/edit/:id" element={<CreateEditAsset />} />
            <Route path="/employee/create" element={<CreateEditEmployee />} />
            <Route path="/employee/edit/:id" element={<CreateEditEmployee />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
