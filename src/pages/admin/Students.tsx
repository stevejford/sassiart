import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Student } from "@/types/database"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Pencil, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Students() {
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
  })

  const { data: students, refetch } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false })
      return data as Student[]
    },
  })

  const handleAdd = async () => {
    const { error } = await supabase.from("students").insert([
      {
        name: form.name,
        email: form.email,
      },
    ])

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add student",
      })
      return
    }

    toast({
      title: "Success",
      description: "Student added successfully",
    })
    setIsAddDialogOpen(false)
    setForm({ name: "", email: "" })
    refetch()
  }

  const handleEdit = async () => {
    if (!selectedStudent) return

    const { error } = await supabase
      .from("students")
      .update({
        name: form.name,
        email: form.email,
      })
      .eq("id", selectedStudent.id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update student",
      })
      return
    }

    toast({
      title: "Success",
      description: "Student updated successfully",
    })
    setIsEditDialogOpen(false)
    setSelectedStudent(null)
    refetch()
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("students").delete().eq("id", id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete student",
      })
      return
    }

    toast({
      title: "Success",
      description: "Student deleted successfully",
    })
    refetch()
  }

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student)
    setForm({
      name: student.name,
      email: student.email,
    })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">Manage your students</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
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
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Admin Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.is_admin ? "Admin" : "Student"}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditDialog(student)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(student.id)}
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
    </div>
  )
}