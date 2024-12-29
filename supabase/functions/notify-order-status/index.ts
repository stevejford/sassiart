import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderStatusUpdate {
  orderId: string;
  newStatus: string;
  customerEmail: string;
  customerName: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { orderId, newStatus, customerEmail, customerName }: OrderStatusUpdate = await req.json()

    // Send email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: 'Art Gallery <orders@yourdomain.com>',
        to: [customerEmail],
        subject: `Order Status Update - ${newStatus}`,
        html: `
          <h1>Order Status Update</h1>
          <p>Hello ${customerName},</p>
          <p>Your order status has been updated to: <strong>${newStatus}</strong></p>
          <p>Order ID: ${orderId}</p>
          <p>Thank you for your business!</p>
        `,
      }),
    })

    if (!res.ok) {
      throw new Error('Failed to send email')
    }

    // Update order status in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: updateError } = await supabase
      .from('orders')
      .update({ order_status: newStatus })
      .eq('id', orderId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ message: 'Order status updated and notification sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})