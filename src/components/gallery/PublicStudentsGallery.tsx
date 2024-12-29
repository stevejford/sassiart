import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

export function PublicStudentsGallery() {
  const { data: students } = useQuery({
    queryKey: ['public-students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('is_gallery_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (!students?.length) return null;

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {students.map((student) => (
          <CarouselItem key={student.id} className="md:basis-1/3 lg:basis-1/4">
            <Link 
              to={`/gallery/${student.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="block group"
            >
              <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-600" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-gray-300">View Gallery →</p>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="text-white border-white hover:bg-white hover:text-black" />
      <CarouselNext className="text-white border-white hover:bg-white hover:text-black" />
    </Carousel>
  );
}