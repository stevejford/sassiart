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
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Trash2 } from "lucide-react"

interface ArtworkTableProps {
  artwork: ArtworkWithStudent[]
  onUpdate: () => void
}

export const ArtworkTable = ({ artwork, onUpdate }: ArtworkTableProps) => {
  const { toast } = useToast()
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkWithStudent | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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
    if (!confirm("Are you sure you want to delete this artwork?")) return

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpdate = async () => {
    if (!selectedArtwork) return

    try {
      let imageUrl = selectedArtwork.image_url

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const filePath = `${crypto.randomUUID()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, selectedFile)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath)

        imageUrl = urlData.publicUrl
      }

      const { error } = await supabase
        .from("artwork")
        .update({
          title: editForm.title,
          description: editForm.description,
          image_url: imageUrl,
        })
        .eq("id", selectedArtwork.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Artwork updated successfully",
      })
      setIsEditDialogOpen(false)
      setSelectedFile(null)
      onUpdate()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update artwork",
      })
      console.error(error)
    }
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Artwork</DialogTitle>
            <DialogDescription>
              Make changes to the artwork details below.
            </DialogDescription>
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
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              {selectedArtwork && (
                <div className="mb-2">
                  <img
                    src={selectedArtwork.image_url}
                    alt={selectedArtwork.title}
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <Button onClick={handleUpdate} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}