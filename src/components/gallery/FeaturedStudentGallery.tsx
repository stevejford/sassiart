import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface FeaturedStudentGalleryProps {
  studentId: string;
}

export function FeaturedStudentGallery({ studentId }: FeaturedStudentGalleryProps) {
  const { data: artwork } = useQuery({
    queryKey: ['featured-student-artwork', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artwork')
        .select(`
          *,
          student:students(name)
        `)
        .eq('student_id', studentId)
        .eq('is_private', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!studentId,
  });

  if (!artwork?.length) return null;

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {artwork.map((art) => (
          <CarouselItem key={art.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="relative group overflow-hidden rounded-lg">
              <img
                src={art.image_url}
                alt={art.title}
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                <h3 className="font-medium">{art.title}</h3>
                <p className="text-sm mb-2">{art.description}</p>
                <Link to={`/product/new?artwork=${art.id}`}>
                  <Button variant="secondary" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Customize Product
                  </Button>
                </Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}