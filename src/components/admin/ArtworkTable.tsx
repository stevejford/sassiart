import { useState } from "react"
import { ArtworkWithStudent } from "@/types/database"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2 } from "lucide-react"

interface ArtworkTableProps {
  artwork: ArtworkWithStudent[]
  onUpdate: () => void
}

export const ArtworkTable = ({ artwork, onUpdate }: ArtworkTableProps) => {
  const { toast } = useToast()
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkWithStudent | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
  })

  const handleEdit = (art: ArtworkWithStudent) => {
    setSelectedArtwork(art)
    setEditForm({
      title: art.title,
      description: art.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("artwork")
      .delete()
      .eq("id", id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete artwork",
      })
      return
    }

    toast({
      title: "Success",
      description: "Artwork deleted successfully",
    })
    onUpdate()
  }

  const handleUpdate = async () => {
    if (!selectedArtwork) return

    const { error } = await supabase
      .from("artwork")
      .update({
        title: editForm.title,
        description: editForm.description,
      })
      .eq("id", selectedArtwork.id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update artwork",
      })
      return
    }

    toast({
      title: "Success",
      description: "Artwork updated successfully",
    })
    setIsEditDialogOpen(false)
    onUpdate()
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artwork.map((art) => (
            <TableRow key={art.id}>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Artwork</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}