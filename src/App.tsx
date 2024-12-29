import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/CartContext";
import { Routes } from "./Routes";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter>
          <Routes />
          <Toaster position="top-right" />
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;