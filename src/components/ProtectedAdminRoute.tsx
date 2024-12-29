import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      const { data: studentData } = await supabase
        .from("students")
        .select("is_admin")
        .eq("email", session.user.email)
        .single()

      setIsAdmin(studentData?.is_admin || false)
      setIsLoading(false)
    }

    checkAdmin()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}