import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Student } from "@/types/database"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { AddStudentDialog } from "@/components/admin/students/AddStudentDialog"
import { EditStudentDialog } from "@/components/admin/students/EditStudentDialog"
import { StudentTable } from "@/components/admin/StudentTable"

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

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage your students and their galleries
          </p>
        </div>
        <AddStudentDialog onStudentAdded={refetch} />
      </div>

      {students && (
        <StudentTable 
          students={students} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
        />
      )}

      <EditStudentDialog
        student={selectedStudent}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onStudentUpdated={refetch}
      />
    </div>
  )
}