import { ProductGrid } from "@/components/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { FeaturedStudentGallery } from "@/components/gallery/FeaturedStudentGallery";
import { PublicStudentsGallery } from "@/components/gallery/PublicStudentsGallery";
import { NewsletterSubscription } from "@/components/NewsletterSubscription";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const Index = () => {
  const { data: featuredStudent } = useQuery({
    queryKey: ['featured-students'],
    queryFn: async () => {
      console.log('Fetching featured students');
      const { data, error } = await supabase
        .from('students')
        .select('id, name')
        .eq('is_featured', true)
        .gt('featured_until', new Date().toISOString())
        .order('featured_until', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error fetching featured students:", error);
        toast.error("Failed to load featured student");
        return null;
      }
      
      console.log('Featured student data:', data);
      return data?.[0] || null;
    },
  });

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 space-y-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Student Artwork Shop</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Support young artists by purchasing their artwork on custom products
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link to="/gallery">
              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Browse Student Galleries
              </Button>
            </Link>
          </div>
        </header>

        {featuredStudent && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold">Student of the Week: {featuredStudent.name}</h2>
              <Link 
                to={`/gallery/${featuredStudent.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-primary hover:underline"
              >
                View Full Gallery →
              </Link>
            </div>
            <FeaturedStudentGallery studentId={featuredStudent.id} />
          </section>
        )}

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold">Featured Student Galleries</h2>
            <Link to="/gallery" className="text-primary hover:underline">
              View All Galleries →
            </Link>
          </div>
          <PublicStudentsGallery />
        </section>

        <section>
          <h2 className="text-2xl font-serif font-bold mb-6">Our Products</h2>
          <ProductGrid />
        </section>

        <section className="bg-muted rounded-lg p-8">
          <NewsletterSubscription />
        </section>
      </main>
    </div>
  );
};

export default Index;