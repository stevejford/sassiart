import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function NewsletterSubscription() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    const { error } = await supabase
      .from('subscriptions')
      .insert([
        {
          email,
          subscribe_to_newsletter: true,
        }
      ]);

    if (error) {
      toast.error("Failed to subscribe. Please try again.");
      return;
    }

    toast.success("Successfully subscribed to the newsletter!");
    setEmail("");
  };

  return (
    <div className="max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-serif font-bold mb-4">Subscribe to Our Newsletter</h2>
      <p className="mb-6 text-muted-foreground">
        Stay updated with new artwork and featured students
      </p>
      <div className="flex gap-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSubscribe}>Subscribe</Button>
      </div>
    </div>
  );
}