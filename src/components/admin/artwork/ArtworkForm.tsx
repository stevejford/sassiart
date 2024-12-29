import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Student } from "@/types/database"
import { ImageUpload } from "./ImageUpload"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

interface ArtworkFormProps {
  students: Student[]
  onSuccess: () => void
  onCancel: () => void
}

export const ArtworkForm = ({ students, onSuccess, onCancel }: ArtworkFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    student_id: "",
    image_url: ""
  })

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.student_id || !formData.image_url) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    const { error } = await supabase
      .from('artwork')
      .insert([formData])

    setIsSubmitting(false)
    if (error) {
      toast.error("Failed to create artwork")
      console.error(error)
      return
    }

    toast.success("Artwork created successfully")
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="student">Student</Label>
        <Select
          value={formData.student_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, student_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a student" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <ImageUpload onUpload={handleImageUpload} />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Artwork"}
        </Button>
      </div>
    </form>
  )
}