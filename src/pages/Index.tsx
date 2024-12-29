import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";
import { ProductGrid } from "@/components/ProductGrid";
import { PublicStudentsGallery } from "@/components/gallery/PublicStudentsGallery";
import { FeaturedStudentGallery } from "@/components/gallery/FeaturedStudentGallery";

export default function Index() {
  console.log('Shop Index: Initializing component');

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Shop Index: Fetching products');
      const { data, error } = await supabase
        .from('products')
        .select('*, product_categories(*)')
        .order('total_sales', { ascending: false });

      if (error) {
        console.error('Shop Index: Error fetching products:', error);
        throw error;
      }

      console.log('Shop Index: Successfully fetched products:', data?.length || 0, 'items');
      return data as Product[];
    },
  });

  if (error) {
    console.error('Shop Index: Rendering error state:', error);
    return <div>Error loading products</div>;
  }

  if (isLoading) {
    console.log('Shop Index: Rendering loading state');
    return <div>Loading...</div>;
  }

  console.log('Shop Index: Rendering products grid with', products?.length || 0, 'products');
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section>
        <h2 className="text-3xl font-serif font-bold mb-8">Featured Artists</h2>
        <FeaturedStudentGallery />
      </section>

      <section>
        <h2 className="text-3xl font-serif font-bold mb-8">Shop Our Products</h2>
        <ProductGrid products={products || []} />
      </section>

      <section>
        <h2 className="text-3xl font-serif font-bold mb-8">Student Galleries</h2>
        <PublicStudentsGallery />
      </section>
    </div>
  );
}