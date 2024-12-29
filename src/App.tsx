import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { CartProvider } from "@/contexts/CartContext"
import { Navbar } from "@/components/Navbar"
import Index from "@/pages/Index"
import Cart from "@/pages/Cart"
import ProductDetail from "@/pages/ProductDetail"
import Admin from "@/pages/Admin"
import AdminLogin from "@/pages/AdminLogin"
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <Admin />
                    </ProtectedAdminRoute>
                  }
                />
              </Routes>
            </main>
          </div>
          <Toaster />
        </Router>
      </CartProvider>
    </QueryClientProvider>
  )
}

export default App