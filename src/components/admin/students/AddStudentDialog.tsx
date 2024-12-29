import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { ImageUpload } from "@/components/admin/artwork/ImageUpload"

interface AddStudentDialogProps {
  onStudentAdded: () => void
}

export function AddStudentDialog({ onStudentAdded }: AddStudentDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    about_text: "",
    photo_url: "",
  })

  const handleAdd = async () => {
    const { error } = await supabase.from("students").insert([{
      name: form.name,
      email: form.email,
      about_text: form.about_text,
      photo_url: form.photo_url,
    }])

    if (error) {
      toast.error("Failed to add student")
      return
    }

    toast.success("Student added successfully")
    setIsOpen(false)
    setForm({ name: "", email: "", about_text: "", photo_url: "" })
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
          <div className="space-y-2">
            <Label htmlFor="about">About Me</Label>
            <Textarea
              id="about"
              value={form.about_text}
              onChange={(e) => setForm({ ...form, about_text: e.target.value })}
              placeholder="Tell us about the student..."
            />
          </div>
          <ImageUpload
            onUpload={(url) => setForm({ ...form, photo_url: url })}
            currentImage={form.photo_url}
          />
          <Button onClick={handleAdd}>Add Student</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}