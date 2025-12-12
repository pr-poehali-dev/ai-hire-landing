
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import CRM from "./pages/CRM";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WebhookLogs from "./pages/WebhookLogs";
import NotFound from "./pages/NotFound";
import CanonicalUrl from "./components/CanonicalUrl";
import SalesManagers from "./pages/SalesManagers";
import ITSpecialists from "./pages/ITSpecialists";
import MarketplaceManagers from "./pages/MarketplaceManagers";
import Accountants from "./pages/Accountants";
import Marketers from "./pages/Marketers";
import Directors from "./pages/Directors";
import RetailSales from "./pages/RetailSales";
import PhoneWidget from "./components/PhoneWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CanonicalUrl />
        <PhoneWidget />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sales-managers" element={<SalesManagers />} />
          <Route path="/it-specialists" element={<ITSpecialists />} />
          <Route path="/marketplace-managers" element={<MarketplaceManagers />} />
          <Route path="/accountants" element={<Accountants />} />
          <Route path="/marketers" element={<Marketers />} />
          <Route path="/directors" element={<Directors />} />
          <Route path="/retail-sales" element={<RetailSales />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/crm/webhooks" element={<WebhookLogs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;