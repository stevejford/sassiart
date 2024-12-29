import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Student } from "@/types/database"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Pencil, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddStudentDialog } from "@/components/admin/students/AddStudentDialog"
import { EditStudentDialog } from "@/components/admin/students/EditStudentDialog"

export default function Students() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

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

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("students").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete student")
      return
    }

    toast.success("Student deleted successfully")
    refetch()
  }

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">Manage your students</p>
        </div>
        <AddStudentDialog onStudentAdded={refetch} />
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

      <EditStudentDialog
        student={selectedStudent}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onStudentUpdated={refetch}
      />
    </div>
  )
}