import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Student } from "@/types/database"

interface EditStudentDialogProps {
  student: Student | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStudentUpdated: () => void
}

export function EditStudentDialog({
  student,
  isOpen,
  onOpenChange,
  onStudentUpdated,
}: EditStudentDialogProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    is_gallery_public: false,
    is_featured: false,
  })

  // Update form when student changes or dialog opens
  useEffect(() => {
    if (student && isOpen) {
      console.log('Setting initial form state:', {
        name: student.name,
        email: student.email,
        is_gallery_public: Boolean(student.is_gallery_public),
        is_featured: Boolean(student.is_featured),
      });
      
      setForm({
        name: student.name,
        email: student.email,
        is_gallery_public: Boolean(student.is_gallery_public),
        is_featured: Boolean(student.is_featured),
      })
    }
  }, [student, isOpen])

  const handleEdit = async () => {
    if (!student) return

    console.log('Saving student with data:', form);

    const { error } = await supabase
      .from("students")
      .update({
        name: form.name,
        email: form.email,
        is_gallery_public: form.is_gallery_public,
        is_featured: form.is_featured,
      })
      .eq("id", student.id)

    if (error) {
      console.error('Error updating student:', error);
      toast.error("Failed to update student")
      return
    }

    toast.success("Student updated successfully")
    onOpenChange(false)
    onStudentUpdated()
  }

  const handleToggleChange = (field: 'is_gallery_public' | 'is_featured', checked: boolean) => {
    console.log(`Toggling ${field} to:`, checked);
    setForm(prev => ({ ...prev, [field]: checked }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="gallery-public">Public Gallery</Label>
            <Switch
              id="gallery-public"
              checked={form.is_gallery_public}
              onCheckedChange={(checked) => handleToggleChange('is_gallery_public', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="featured">Featured Student</Label>
            <Switch
              id="featured"
              checked={form.is_featured}
              onCheckedChange={(checked) => handleToggleChange('is_featured', checked)}
            />
          </div>
          <Button onClick={handleEdit} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}