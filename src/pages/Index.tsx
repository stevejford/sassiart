import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";
import { ProductGrid } from "@/components/ProductGrid";
import { PublicStudentsGallery } from "@/components/gallery/PublicStudentsGallery";
import { FeaturedStudentGallery } from "@/components/gallery/FeaturedStudentGallery";

export default function Index() {
  console.log('Shop Index: Initializing component');

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section>
        <h2 className="text-3xl font-serif font-bold mb-8">Featured Artists</h2>
        <FeaturedStudentGallery />
      </section>

      <section>
        <h2 className="text-3xl font-serif font-bold mb-8">Shop Our Products</h2>
        <ProductGrid />
      </section>

      <section>
        <h2 className="text-3xl font-serif font-bold mb-8">Student Galleries</h2>
        <PublicStudentsGallery />
      </section>
    </div>
  );
}