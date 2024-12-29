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
import { toast } from "sonner"
import { Mail, Trash2 } from "lucide-react"

export default function Subscriptions() {
  const { data: subscriptions, refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select(`
          *,
          student:students(name)
        `)
        .order('created_at', { ascending: false })
      return data
    },
  })

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

  const handleSendTestEmail = async (email: string, studentName: string | null) => {
    try {
      const response = await fetch('/api/notify-subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [email],
          subject: 'Test Gallery Notification',
          html: `
            <h1>Test Gallery Notification</h1>
            <p>This is a test notification for ${studentName}'s gallery updates.</p>
          `,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send test email')
      }

      toast.success("Test email sent successfully")
    } catch (error) {
      toast.error("Failed to send test email")
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Gallery Subscriptions</h1>
      
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
                    onClick={() => handleSendTestEmail(subscription.email, subscription.student?.name)}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
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