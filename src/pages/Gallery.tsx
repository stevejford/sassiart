import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Share2, Mail, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function Gallery() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [subscribeToGallery, setSubscribeToGallery] = useState(true)
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false)

  const { data: student } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single()
      return data
    },
  })

  const { data: artwork } = useQuery({
    queryKey: ['student-artwork', studentId],
    queryFn: async () => {
      const { data } = await supabase
        .from('artwork')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
      return data
    },
  })

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Gallery link copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  const handleSubscribe = async () => {
    const { error } = await supabase
      .from('subscriptions')
      .insert([
        {
          email,
          student_id: studentId,
          subscribe_to_gallery: subscribeToGallery,
          subscribe_to_newsletter: subscribeToNewsletter,
        }
      ])

    if (error) {
      toast.error("Failed to subscribe")
      return
    }

    toast.success("Successfully subscribed!")
    setEmail("")
  }

  const handleCreateProduct = (artworkId: string) => {
    navigate(`/products/new?artworkId=${artworkId}`)
  }

  if (!student) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{student.name}'s Gallery</h1>
        <div className="flex gap-4">
          <Button onClick={handleShare} variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Gallery
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Subscribe to Updates</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gallery"
                    checked={subscribeToGallery}
                    onCheckedChange={(checked) => setSubscribeToGallery(!!checked)}
                  />
                  <Label htmlFor="gallery">Notify me about new artwork</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={subscribeToNewsletter}
                    onCheckedChange={(checked) => setSubscribeToNewsletter(!!checked)}
                  />
                  <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                </div>
                <Button onClick={handleSubscribe} className="w-full">
                  Subscribe
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artwork?.map((art) => (
          <div key={art.id} className="group relative">
            <img
              src={art.image_url}
              alt={art.title}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="text-white text-center p-4">
                <h3 className="text-xl font-bold mb-2">{art.title}</h3>
                <p className="text-sm">{art.description}</p>
                <Button 
                  variant="secondary" 
                  className="mt-4"
                  onClick={() => handleCreateProduct(art.id)}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Create Custom Product
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}