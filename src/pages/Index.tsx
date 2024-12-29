import { ProductGrid } from "@/components/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArtworkWithStudent } from "@/types/database";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [email, setEmail] = useState("");

  const { data: featuredStudents } = useQuery({
    queryKey: ['featured-students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('id, name')
        .eq('is_featured', true)
        .order('featured_until', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error fetching featured students:", error);
        return null;
      }
      
      return data[0];
    },
  });

  const { data: featuredArtwork, error: artworkError } = useQuery({
    queryKey: ['featured-artwork', featuredStudents?.id],
    queryFn: async () => {
      if (!featuredStudents) return [];
      
      const { data, error } = await supabase
        .from('artwork')
        .select(`
          *,
          student:students(name)
        `)
        .eq('student_id', featuredStudents.id)
        .limit(3);
      
      if (error) {
        console.error("Supabase error:", error);
        toast.error("Failed to load featured artwork");
        return [];
      }
      
      return data as ArtworkWithStudent[];
    },
    enabled: !!featuredStudents,
  });

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
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Student Artwork Shop</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Support young artists by purchasing their artwork on custom products
          </p>
        </header>

        {featuredStudents && (
          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold">Featured Artist: {featuredStudents.name}</h2>
              <Link 
                to={`/gallery/${featuredStudents.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-primary hover:underline"
              >
                View Full Gallery →
              </Link>
            </div>
            
            {artworkError && (
              <div className="text-center text-red-500 mb-8">
                Failed to load featured artwork. Please try again later.
              </div>
            )}

            {featuredArtwork && featuredArtwork.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredArtwork.map((artwork) => (
                  <div key={artwork.id} className="relative group overflow-hidden rounded-lg">
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                      <h3 className="font-medium">{artwork.title}</h3>
                      <p className="text-sm">by {artwork.student.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="mb-16 bg-muted p-8 rounded-lg">
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
        </section>

        <section>
          <h2 className="text-2xl font-serif font-bold mb-6">Our Products</h2>
          <ProductGrid />
        </section>
      </main>
    </div>
  );
};

export default Index;