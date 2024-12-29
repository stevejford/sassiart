import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "@/pages/Index"
import Cart from "@/pages/Cart"
import ProductDetail from "@/pages/ProductDetail"
import Admin from "@/pages/Admin"
import AdminLogin from "@/pages/AdminLogin"
import AdminSignup from "@/pages/AdminSignup"
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <Admin />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App