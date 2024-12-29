import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "@/pages/Index"
import Cart from "@/pages/Cart"
import Checkout from "@/pages/Checkout"
import ProductDetail from "@/pages/ProductDetail"
import Admin from "@/pages/Admin"
import AdminLogin from "@/pages/AdminLogin"
import AdminSignup from "@/pages/AdminSignup"
import AdminResetPassword from "@/pages/AdminResetPassword"
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <Admin />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App