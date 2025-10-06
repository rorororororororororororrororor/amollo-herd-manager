import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import { getAuthToken } from "./config/api";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getAuthToken();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="farm-settings" element={<div>Farm Settings - Coming Soon</div>} />
            <Route path="animals" element={<div>Animals - Coming Soon</div>} />
            <Route path="milk-records" element={<div>Milk Records - Coming Soon</div>} />
            <Route path="disease-records" element={<div>Disease Records - Coming Soon</div>} />
            <Route path="preventive-health" element={<div>Preventive Health - Coming Soon</div>} />
            <Route path="breeding" element={<div>Breeding - Coming Soon</div>} />
            <Route path="expenses" element={<div>Expenses - Coming Soon</div>} />
            <Route path="reports" element={<div>Reports - Coming Soon</div>} />
            <Route path="profile" element={<div>Profile - Coming Soon</div>} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
