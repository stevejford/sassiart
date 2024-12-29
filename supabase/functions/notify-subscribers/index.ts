import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { artworkId } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get artwork details with student info
    const { data: artwork } = await supabase
      .from('artwork')
      .select(`
        *,
        student:students(name)
      `)
      .eq('id', artworkId)
      .single()

    if (!artwork) {
      throw new Error('Artwork not found')
    }

    // Get subscribers for this student's gallery
    const { data: subscribers } = await supabase
      .from('subscriptions')
      .select('email')
      .eq('student_id', artwork.student_id)
      .eq('subscribe_to_gallery', true)

    if (!subscribers?.length) {
      return new Response(
        JSON.stringify({ message: 'No subscribers to notify' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send email to each subscriber
    const emailPromises = subscribers.map(async (subscriber) => {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        },
        body: JSON.stringify({
          from: 'Art Gallery <notifications@yourdomain.com>',
          to: subscriber.email,
          subject: `New Artwork by ${artwork.student.name}`,
          html: `
            <h1>New Artwork Added!</h1>
            <p>${artwork.student.name} has added a new piece titled "${artwork.title}"</p>
            <img src="${artwork.image_url}" alt="${artwork.title}" style="max-width: 500px;" />
            <p>${artwork.description || ''}</p>
            <a href="${Deno.env.get('PUBLIC_SITE_URL')}/gallery/${artwork.student_id}">
              View Gallery
            </a>
          `,
        }),
      })

      if (!res.ok) {
        console.error(`Failed to send email to ${subscriber.email}`)
      }
    })

    await Promise.all(emailPromises)

    return new Response(
      JSON.stringify({ message: 'Notifications sent successfully' }),
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