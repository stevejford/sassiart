import { ArtworkWithStudent } from "@/types/database"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ArtworkTableProps {
  artwork: ArtworkWithStudent[]
}

export const ArtworkTable = ({ artwork }: ArtworkTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {artwork.map((art) => (
          <TableRow key={art.id}>
            <TableCell>{art.title}</TableCell>
            <TableCell>{art.student.name}</TableCell>
            <TableCell>{art.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}