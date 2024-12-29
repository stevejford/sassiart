import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Image,
  FileText,
  Settings,
  Mail,
} from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    title: "Students",
    icon: Users,
    path: "/admin/students",
  },
  {
    title: "Products",
    icon: ShoppingBag,
    path: "/admin/products",
  },
  {
    title: "Artwork",
    icon: Image,
    path: "/admin/artwork",
  },
  {
    title: "Orders",
    icon: FileText,
    path: "/admin/orders",
  },
  {
    title: "Newsletter",
    icon: Mail,
    path: "/admin/newsletter",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
]

export function AdminSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-6">
          <h1 className="text-xl font-bold">Sassi Art Admin</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    className={
                      location.pathname === item.path
                        ? "bg-primary/10 text-primary"
                        : ""
                    }
                    asChild
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}