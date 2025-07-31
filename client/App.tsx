import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Meetings from "./pages/Meetings";
import Settings from "./pages/Settings";
import CouncilOfficers from "./pages/CouncilOfficers";
import Archives from "./pages/Archives";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/zones" element={<Layout><Zones /></Layout>} />
          <Route path="/praesidia" element={<Layout><Praesidia /></Layout>} />
          <Route path="/officers" element={<Layout><Officers /></Layout>} />
          <Route path="/members" element={<Layout><Members /></Layout>} />
          <Route path="/attendance" element={<Layout><Attendance /></Layout>} />
          <Route path="/finances" element={<Layout><Finances /></Layout>} />
          <Route path="/alerts" element={<Layout><Alerts /></Layout>} />
          <Route path="/meetings" element={<Layout><Meetings /></Layout>} />
          <Route path="/council-officers" element={<Layout><CouncilOfficers /></Layout>} />
          <Route path="/archives" element={<Layout><Archives /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
