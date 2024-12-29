import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { ArtworkTable } from "@/components/admin/ArtworkTable"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export default function Gallery() {
  const [searchParams] = useSearchParams()
  const studentId = searchParams.get('student')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    description: "",
    student_id: studentId || "",
  })

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

      const { data, error } = await query
      if (error) {
        toast.error("Failed to fetch artwork")
        return []
      }
      return data || []
    },
  })

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name')
      
      if (error) {
        toast.error("Failed to fetch students")
        return []
      }
      return data || []
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleAddArtwork = async () => {
    if (!selectedFile || !newArtwork.student_id) {
      toast.error("Please fill in all required fields and select an image")
      return
    }

    try {
      // Upload image
      const fileExt = selectedFile.name.split('.').pop()
      const filePath = `${crypto.randomUUID()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, selectedFile)

      if (uploadError) {
        throw uploadError
      }

      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      // Create artwork record
      const { error: insertError } = await supabase
        .from('artwork')
        .insert([
          {
            ...newArtwork,
            image_url: urlData.publicUrl,
          }
        ])

      if (insertError) {
        throw insertError
      }

      toast.success("Artwork added successfully")
      setIsAddDialogOpen(false)
      setSelectedFile(null)
      setNewArtwork({
        title: "",
        description: "",
        student_id: studentId || "",
      })
      refetch()
    } catch (error) {
      toast.error("Failed to add artwork")
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gallery Management</h2>
          <p className="text-muted-foreground">
            {studentId ? "Manage student's artwork" : "Manage all artwork and galleries"}
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newArtwork.title}
                  onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newArtwork.description}
                  onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
                />
              </div>
              {!studentId && (
                <div className="space-y-2">
                  <Label htmlFor="student">Student</Label>
                  <Select
                    value={newArtwork.student_id}
                    onValueChange={(value) => setNewArtwork({ ...newArtwork, student_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <Button onClick={handleAddArtwork} className="w-full">
                Add Artwork
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {artwork && <ArtworkTable artwork={artwork} onUpdate={refetch} />}
    </div>
  )
}