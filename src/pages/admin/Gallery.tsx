import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ArtworkTable } from "@/components/admin/ArtworkTable"

export default function Gallery() {
  const { data: artwork, refetch } = useQuery({
    queryKey: ['admin-artwork'],
    queryFn: async () => {
      const { data } = await supabase
        .from('artwork')
        .select(`
          *,
          student:students(name)
        `)
        .order('created_at', { ascending: false })
      return data || []
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gallery Management</h2>
        <p className="text-muted-foreground">
          Manage student artwork and galleries
        </p>
      </div>

      {artwork && <ArtworkTable artwork={artwork} onUpdate={refetch} />}
    </div>
  )
}