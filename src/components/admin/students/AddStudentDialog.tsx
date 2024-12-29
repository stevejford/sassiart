import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface AddStudentDialogProps {
  onStudentAdded: () => void
}

export function AddStudentDialog({ onStudentAdded }: AddStudentDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
  })

  const handleAdd = async () => {
    const { error } = await supabase.from("students").insert([
      {
        name: form.name,
        email: form.email,
      },
    ])

    if (error) {
      toast.error("Failed to add student")
      return
    }

    toast.success("Student added successfully")
    setIsOpen(false)
    setForm({ name: "", email: "" })
    onStudentAdded()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <Button onClick={handleAdd}>Add Student</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}