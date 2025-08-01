import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute, { PublicOnlyRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Zones from "./pages/Zones";
import Praesidia from "./pages/Praesidia";
import Officers from "./pages/Officers";
import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import Finances from "./pages/Finances";
import Alerts from "./pages/Alerts";
import Manifestations from "./pages/Manifestations";
import Settings from "./pages/Settings";
import CouncilOfficers from "./pages/CouncilOfficers";
import Archives from "./pages/Archives";
import Approvals from "./pages/Approvals";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AccountManagement from "./pages/AccountManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Routes publiques */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicOnlyRoute>
                    <Register />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicOnlyRoute>
                    <ForgotPassword />
                  </PublicOnlyRoute>
                }
              />

              {/* Routes protégées */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Index />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/zones"
                element={
                  <ProtectedRoute requiredPermission="view_all_praesidia">
                    <Layout>
                      <Zones />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/praesidia"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Praesidia />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/officers"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Officers />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Members />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Attendance />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finances"
                element={
                  <ProtectedRoute requiredPermission="view_finances">
                    <Layout>
                      <Finances />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alerts"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Alerts />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/meetings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Manifestations />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/council-officers"
                element={
                  <ProtectedRoute requiredPermission="view_all_praesidia">
                    <Layout>
                      <CouncilOfficers />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/archives"
                element={
                  <ProtectedRoute requiredPermission="view_all_reports">
                    <Layout>
                      <Archives />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approvals"
                element={
                  <ProtectedRoute requiredPermission="approve_accounts">
                    <Layout>
                      <Approvals />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <NotFound />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Éviter le double mounting en développement
const rootElement = document.getElementById("root");
if (rootElement) {
  // Vérifier si un root existe déjà pour éviter la double création
  if (!rootElement._reactRootContainer) {
    const reactRoot = createRoot(rootElement);
    rootElement._reactRootContainer = reactRoot;
    reactRoot.render(<App />);
  }
}
