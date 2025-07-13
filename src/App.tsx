import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// QueryClient wagmi için gerekli
const queryClient = new QueryClient();

// Debug: config'i kontrol et
console.log('App.tsx - Wagmi config:', config);
console.log('App.tsx - Config chains:', config.chains);
console.log('App.tsx - Config connectors:', config.connectors);

const App = () => {
  console.log('App bileşeni render ediliyor...');
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
