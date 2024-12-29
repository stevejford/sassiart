import { Student } from "@/types/database"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Eye, Image, Share2, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface StudentTableProps {
  students: Student[]
  onEdit: (student: Student) => void
  onDelete: (id: string) => void
}

export const StudentTable = ({ students, onEdit, onDelete }: StudentTableProps) => {
  const formatGalleryUrl = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-')
  }

  const handleCopyGalleryLink = async (student: Student) => {
    const formattedName = formatGalleryUrl(student.name)
    const url = `${window.location.origin}/gallery/${formattedName}`
    await navigator.clipboard.writeText(url)
    toast.success("Gallery link copied to clipboard!")
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Admin Status</TableHead>
          <TableHead>Gallery</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.is_admin ? 'Admin' : 'Student'}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Link to={`/gallery/${formatGalleryUrl(student.name)}`}>
                  <Button variant="outline" size="icon" title="View Gallery">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to={`/admin/gallery?student=${student.id}`}>
                  <Button variant="outline" size="icon" title="Manage Artwork">
                    <Image className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleCopyGalleryLink(student)}
                  title="Copy Gallery Link"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(student)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(student.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}