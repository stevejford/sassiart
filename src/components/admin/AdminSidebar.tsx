import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Bell,
  Image,
  ShoppingBag,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  return (
    <div className="w-64 min-h-screen border-r bg-white">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admin Dashboard
          </h2>
          <div className="space-y-1">
            <NavLink to="/admin" end>
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              )}
            </NavLink>
          </div>
        </div>
        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-sm font-medium text-gray-500">
            Users & Subscriptions
          </h3>
          <div className="space-y-1">
            <NavLink to="/admin/students">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Students
                </Button>
              )}
            </NavLink>
            <NavLink to="/admin/subscriptions">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Subscriptions
                </Button>
              )}
            </NavLink>
          </div>
        </div>
        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-sm font-medium text-gray-500">
            Content Management
          </h3>
          <div className="space-y-1">
            <NavLink to="/admin/gallery">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Image className="mr-2 h-4 w-4" />
                  Gallery
                </Button>
              )}
            </NavLink>
            <NavLink to="/admin/products">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Products
                </Button>
              )}
            </NavLink>
            <NavLink to="/admin/orders">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </Button>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}