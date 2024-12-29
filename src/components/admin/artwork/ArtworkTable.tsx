import { useState } from "react"
import { ArtworkWithStudent } from "@/types/database"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { EditArtworkDialog } from "./EditArtworkDialog"

interface ArtworkTableProps {
  artwork: ArtworkWithStudent[]
  onUpdate: () => void
}

export const ArtworkTable = ({ artwork, onUpdate }: ArtworkTableProps) => {
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkWithStudent | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return

    const { error } = await supabase
      .from("artwork")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error("Failed to delete artwork")
      return
    }

    toast.success("Artwork deleted successfully")
    onUpdate()
  }

  const handleEdit = (art: ArtworkWithStudent) => {
    setSelectedArtwork(art)
    setIsEditDialogOpen(true)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artwork.map((art) => (
            <TableRow key={art.id}>
              <TableCell>
                <img
                  src={art.image_url}
                  alt={art.title}
                  className="w-16 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell>{art.title}</TableCell>
              <TableCell>{art.student.name}</TableCell>
              <TableCell>{art.description}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(art)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(art.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditArtworkDialog
        artwork={selectedArtwork}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={onUpdate}
      />
    </>
  )
}