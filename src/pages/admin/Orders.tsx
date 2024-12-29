import { useEffect, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { format } from "date-fns"

const orderStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]

export default function Orders() {
  const { data: orders, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*), artwork(*))")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  const updateOrderStatus = async (orderId: string, newStatus: string, customerEmail: string, customerName: string) => {
    try {
      const { error } = await supabase.functions.invoke("notify-order-status", {
        body: { orderId, newStatus, customerEmail, customerName }
      })

      if (error) throw error
      
      toast.success("Order status updated and customer notified")
      refetch()
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      <div className="bg-white rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono">{order.id.slice(0, 8)}</TableCell>
                <TableCell>{format(new Date(order.created_at), "PPp")}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-sm text-gray-500">{order.customer_email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="text-sm">
                        {item.quantity}x {item.products.name} 
                        <span className="text-gray-500"> (Artwork: {item.artwork.title})</span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>${order.total_amount}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.order_status}
                    onValueChange={(value) => 
                      updateOrderStatus(order.id, value, order.customer_email, order.customer_name)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}