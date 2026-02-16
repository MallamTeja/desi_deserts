import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Payment from "./pages/Payment";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Buy from "./pages/Buy";
import DessertDetails from "./pages/DessertDetails";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/desserts/:id" element={<DessertDetails />} />
            {/* Keeping old routes for now or redirecting? User didn't specify, but new flow replaces them. keeping /admin */}
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
