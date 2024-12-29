import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { ArtworkTable } from "@/components/admin/artwork/ArtworkTable"
import { ArtworkForm } from "@/components/admin/artwork/ArtworkForm"

export default function Gallery() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const { data: artwork, refetch } = useQuery({
    queryKey: ['admin-artwork'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artwork')
        .select(`
          *,
          student:students(name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gallery Management</h2>
          <p className="text-muted-foreground">
            Manage student artwork and galleries
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Artwork
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Artwork</DialogTitle>
            </DialogHeader>
            {students && (
              <ArtworkForm
                students={students}
                onSuccess={() => {
                  setIsAddDialogOpen(false)
                  refetch()
                }}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {artwork && <ArtworkTable artwork={artwork} onUpdate={refetch} />}
    </div>
  )
}