import { Artwork, Student } from "@/types/database"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "./ImageUpload"
import { Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface ArtworkTableProps {
  artwork: (Artwork & { student: Pick<Student, 'name'> })[]
  onUpdate: () => void
}

export const ArtworkTable = ({ artwork, onUpdate }: ArtworkTableProps) => {
  const updateArtwork = async (id: string, updates: Partial<Artwork>) => {
    const { error } = await supabase
      .from('artwork')
      .update(updates)
      .eq('id', id)

    if (error) {
      toast.error("Failed to update artwork")
      console.error(error)
      return
    }

    toast.success("Artwork updated successfully")
    onUpdate()
  }

  const deleteArtwork = async (id: string) => {
    const { error } = await supabase
      .from('artwork')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error("Failed to delete artwork")
      console.error(error)
      return
    }

    toast.success("Artwork deleted successfully")
    onUpdate()
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {artwork.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <ImageUpload
                currentImage={item.image_url}
                onUpload={(url) => updateArtwork(item.id, { image_url: url })}
              />
            </TableCell>
            <TableCell>
              <Input
                defaultValue={item.title}
                onBlur={(e) => updateArtwork(item.id, { title: e.target.value })}
              />
            </TableCell>
            <TableCell>
              <Textarea
                defaultValue={item.description || ''}
                onBlur={(e) => updateArtwork(item.id, { description: e.target.value })}
              />
            </TableCell>
            <TableCell>{item.student.name}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteArtwork(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}