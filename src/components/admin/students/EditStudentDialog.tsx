import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  })

  // Update form when student changes or dialog opens
  useEffect(() => {
    if (student && isOpen) {
      setForm({
        name: student.name,
        email: student.email,
      })
    }
  }, [student, isOpen])

  const handleEdit = async () => {
    if (!student) return

    const { error } = await supabase
      .from("students")
      .update({
        name: form.name,
        email: form.email,
      })
      .eq("id", student.id)

    if (error) {
      toast.error("Failed to update student")
      return
    }

    toast.success("Student updated successfully")
    onOpenChange(false)
    onStudentUpdated()
  }

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
          <Button onClick={handleEdit}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}