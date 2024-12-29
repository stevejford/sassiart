import { Button } from "@/components/ui/button"
import { Share2, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

interface GalleryHeaderProps {
  studentName: string
  studentId: string
}

export function GalleryHeader({ studentName, studentId }: GalleryHeaderProps) {
  const [email, setEmail] = useState("")
  const [subscribeToGallery, setSubscribeToGallery] = useState(true)
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false)

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

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">{studentName}'s Gallery</h1>
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
  )
}