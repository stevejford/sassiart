import { Routes as RouterRoutes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import ProductDetail from "@/pages/ProductDetail";
import Gallery from "@/pages/Gallery";
import NewProduct from "@/pages/NewProduct";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Students from "@/pages/admin/Students";
import Subscriptions from "@/pages/admin/Subscriptions";
import AdminGallery from "@/pages/admin/Gallery";
import AdminProducts from "@/pages/admin/Products";
import AdminLogin from "@/pages/AdminLogin";
import AdminSignup from "@/pages/AdminSignup";
import AdminResetPassword from "@/pages/AdminResetPassword";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/gallery/:studentName" element={<Gallery />} />
      <Route path="/products/new" element={<NewProduct />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/reset-password" element={<AdminResetPassword />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="products" element={<AdminProducts />} />
      </Route>
    </RouterRoutes>
  );
}