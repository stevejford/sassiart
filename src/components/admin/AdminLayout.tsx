import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "./AdminSidebar"
import { Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function AdminLayout() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Error signing out")
      return
    }
    navigate("/admin/login")
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-white h-16 flex items-center justify-end px-4">
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}