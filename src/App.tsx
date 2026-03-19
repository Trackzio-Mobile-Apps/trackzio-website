import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Index";
import AppDetail from "./pages/AppDetail";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import TrackzioTerms from "./pages/TrackzioTerms";
import TrackzioPrivacy from "./pages/TrackzioPrivacy";
import CoinzyPrivacy from "./pages/CoinzyPrivacy";
import CoinzyTerms from "./pages/CoinzyTerms";
import BanknotePrivacy from "./pages/BanknotePrivacy";
import BanknoteTerms from "./pages/BanknoteTerms";
import InsectoPrivacy from "./pages/InsectoPrivacy";
import InsectoTerms from "./pages/InsectoTerms";
import HabitEazyPrivacy from "./pages/HabitEazyPrivacy";
import HabitEazyTerms from "./pages/HabitEazyTerms";
import RockzyPrivacy from "./pages/RockzyPrivacy";
import RockzyTerms from "./pages/RockzyTerms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/apps" element={<Navigate to="/#apps" replace />} />
            <Route path="/apps/:appId" element={<AppDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/trackzio-terms" element={<TrackzioTerms />} />
            <Route path="/trackzio-privacy" element={<TrackzioPrivacy />} />
            <Route path="/coinzy/privacy-policy" element={<CoinzyPrivacy />} />
            <Route path="/coinzy/terms" element={<CoinzyTerms />} />
            <Route path="/banknote-ai/privacy-policy" element={<BanknotePrivacy />} />
            <Route path="/banknote-ai/terms" element={<BanknoteTerms />} />
            <Route path="/insecto-ai/privacy-policy" element={<InsectoPrivacy />} />
            <Route path="/insecto-ai/terms" element={<InsectoTerms />} />
            <Route path="/habit-eazy/privacy-policy" element={<HabitEazyPrivacy />} />
            <Route path="/habit-eazy/terms" element={<HabitEazyTerms />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
