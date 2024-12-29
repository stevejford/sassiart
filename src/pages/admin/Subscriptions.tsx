import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Mail, Trash2 } from "lucide-react"

export default function Subscriptions() {
  const [bulkEmails, setBulkEmails] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<string>("all")

  const { data: subscriptions, refetch } = useQuery({
    queryKey: ['subscriptions', selectedStudent],
    queryFn: async () => {
      let query = supabase
        .from('subscriptions')
        .select(`
          *,
          student:students(id, name)
        `)
        .order('created_at', { ascending: false })

      if (selectedStudent !== "all") {
        query = query.eq('student_id', selectedStudent)
      }

      const { data } = await query
      return data
    },
  })

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data } = await supabase
        .from('students')
        .select('id, name')
        .order('name')
      return data
    },
  })

  const handleBulkInvite = async () => {
    const emails = bulkEmails
      .split('\n')
      .map(email => email.trim())
      .filter(email => email.length > 0)

    if (emails.length === 0) {
      toast.error("Please enter at least one email address")
      return
    }

    const { error } = await supabase
      .from('subscriptions')
      .insert(
        emails.map(email => ({
          email,
          student_id: selectedStudent !== "all" ? selectedStudent : null,
          subscribe_to_gallery: true,
          subscribe_to_newsletter: true,
        }))
      )

    if (error) {
      toast.error("Failed to add subscriptions")
      return
    }

    toast.success("Subscriptions added successfully")
    setBulkEmails("")
    refetch()
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error("Failed to delete subscription")
      return
    }

    toast.success("Subscription deleted successfully")
    refetch()
  }

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Gallery Subscriptions</h1>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Add New Subscribers</h2>
            <Textarea
              placeholder="Enter email addresses (one per line)"
              value={bulkEmails}
              onChange={(e) => setBulkEmails(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="flex gap-4">
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {students?.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleBulkInvite}>Add Subscribers</Button>
            </div>
          </div>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Student Gallery</TableHead>
            <TableHead>Gallery Updates</TableHead>
            <TableHead>Newsletter</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions?.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>{subscription.email}</TableCell>
              <TableCell>{subscription.student?.name || 'General Subscription'}</TableCell>
              <TableCell>{subscription.subscribe_to_gallery ? 'Yes' : 'No'}</TableCell>
              <TableCell>{subscription.subscribe_to_newsletter ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(subscription.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}