import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { ArtworkTable } from "@/components/admin/ArtworkTable"

export default function Gallery() {
  const [searchParams] = useSearchParams()
  const studentId = searchParams.get('student')

  const { data: artwork, refetch } = useQuery({
    queryKey: ['admin-artwork', studentId],
    queryFn: async () => {
      let query = supabase
        .from('artwork')
        .select(`
          *,
          student:students(name)
        `)
        .order('created_at', { ascending: false })

      if (studentId) {
        query = query.eq('student_id', studentId)
      }

      const { data } = await query
      return data || []
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gallery Management</h2>
        <p className="text-muted-foreground">
          {studentId ? "Manage student's artwork" : "Manage all artwork and galleries"}
        </p>
      </div>

      {artwork && <ArtworkTable artwork={artwork} onUpdate={refetch} />}
    </div>
  )
}