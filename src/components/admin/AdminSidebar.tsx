import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Bell,
  Image,
  ShoppingBag,
} from "lucide-react"

export function AdminSidebar() {
  return (
    <div className="pb-12 min-h-screen w-64 border-r border-gray-200 bg-white">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-gray-900">
            Admin Dashboard
          </h2>
          <div className="space-y-1">
            <NavLink to="/admin">
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
          <h3 className="mb-2 px-4 text-sm font-semibold tracking-tight text-gray-500">
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
          <h3 className="mb-2 px-4 text-sm font-semibold tracking-tight text-gray-500">
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
          </div>
        </div>
      </div>
    </div>
  )
}