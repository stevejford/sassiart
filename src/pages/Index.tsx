import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";
import { ProductGrid } from "@/components/ProductGrid";
import { PublicStudentsGallery } from "@/components/gallery/PublicStudentsGallery";
import { FeaturedStudentGallery } from "@/components/gallery/FeaturedStudentGallery";
import { StudentOfTheWeek } from "@/components/students/StudentOfTheWeek";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export default function Index() {
  // Fetch popular artwork for hero section
  const { data: heroArtwork } = useQuery({
    queryKey: ["heroArtwork"],
    queryFn: async () => {
      const { data: artwork, error } = await supabase
        .from("artwork")
        .select(`
          id,
          title,
          description,
          image_url,
          student_id,
          students (
            name
          )
        `)
        .eq("is_private", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return artwork;
    },
  });

  // Fetch popular products
  const { data: popularProducts } = useQuery({
    queryKey: ["popularProducts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          base_price,
          image_url,
          category
        `)
        .eq("is_popular", true)
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroArtwork?.image_url || "/placeholder.svg"}
            alt={heroArtwork?.title || "Student artwork"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            Support Young Artists
          </h1>
          <p className="text-xl mb-8 text-white/90 animate-fade-in-delay">
            Transform their artwork into beautiful products while supporting their creative journey
          </p>
          <div className="flex gap-4 justify-center animate-fade-in-delay-2">
            <Button 
              size="lg" 
              className="bg-blue-600 text-white hover:bg-blue-700 transition-transform hover:scale-105"
              asChild
            >
              <Link to="/gallery">Explore Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Student of the Week */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <StudentOfTheWeek />
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">Featured Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in-delay">
              Discover our curated selection of student artwork
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Paintings */}
            <div className="group relative overflow-hidden rounded-lg aspect-[4/5] animate-fade-in-delay-2">
              <img
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80"
                alt="Paintings Collection"
                className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2">Paintings</h3>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-black transition-transform hover:scale-105"
                  asChild
                >
                  <Link to="/gallery?medium=painting">View Collection</Link>
                </Button>
              </div>
            </div>

            {/* Digital Art */}
            <div className="group relative overflow-hidden rounded-lg aspect-[4/5] animate-fade-in-delay-2">
              <img
                src="https://images.unsplash.com/photo-1633186710895-309db2eca9e4?auto=format&fit=crop&q=80"
                alt="Digital Art Collection"
                className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2">Digital Art</h3>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-black transition-transform hover:scale-105"
                  asChild
                >
                  <Link to="/gallery?medium=digital">View Collection</Link>
                </Button>
              </div>
            </div>

            {/* Photography */}
            <div className="group relative overflow-hidden rounded-lg aspect-[4/5] animate-fade-in-delay-2">
              <img
                src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80"
                alt="Photography Collection"
                className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2">Photography</h3>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-black transition-transform hover:scale-105"
                  asChild
                >
                  <Link to="/gallery?medium=photography">View Collection</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="products" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProductGrid />
        </div>
      </section>

      {/* Public Students Gallery */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <PublicStudentsGallery />
        </div>
      </section>
    </div>
  );
}