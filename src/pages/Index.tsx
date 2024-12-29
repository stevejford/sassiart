import { ProductGrid } from "@/components/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArtworkWithStudent } from "@/types/database";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FeaturedStudentGallery } from "@/components/gallery/FeaturedStudentGallery";
import { PublicStudentsGallery } from "@/components/gallery/PublicStudentsGallery";
import { NewsletterSubscription } from "@/components/NewsletterSubscription";

const Index = () => {
  const { data: featuredStudents } = useQuery({
    queryKey: ['featured-students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('id, name')
        .eq('is_featured', true)
        .gt('featured_until', new Date().toISOString())
        .order('featured_until', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error fetching featured students:", error);
        return null;
      }
      
      return data[0];
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
        </header>

        {featuredStudents && (
          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold">Student of the Week: {featuredStudents.name}</h2>
              <Link 
                to={`/gallery/${featuredStudents.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-primary hover:underline"
              >
                View Full Gallery →
              </Link>
            </div>
            <FeaturedStudentGallery studentId={featuredStudents.id} />
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-6">Featured Student Galleries</h2>
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