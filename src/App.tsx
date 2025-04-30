
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { ThemeProvider } from "./components/ThemeProvider";
import { TypedLogoAnimation } from "./components/TypedLogoAnimation";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Favorites from "./pages/Favorites";
import News from "./pages/News";
import FAQ from "./pages/FAQ";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import Account from "./pages/Account";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  
  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };
  
  if (showAnimation) {
    return <TypedLogoAnimation onComplete={handleAnimationComplete} />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/markets" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
      <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
      <Route path="/portfolio/:id" element={<ProtectedRoute><PortfolioDetail /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      <Route path="/account/membership" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      <Route path="/account/access" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      <Route path="/account/security" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="crypto-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
