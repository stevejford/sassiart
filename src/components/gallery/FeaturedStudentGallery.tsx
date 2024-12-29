import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface FeaturedStudentGalleryProps {
  studentId?: string;
}

export function FeaturedStudentGallery({ studentId }: FeaturedStudentGalleryProps) {
  const { data: featuredArtwork = [], refetch } = useQuery({
    queryKey: ['featured-artwork', studentId],
    queryFn: async () => {
      console.log('Fetching featured artwork for studentId:', studentId || 'all students');
      
      let query = supabase
        .from('students')
        .select('id')
        .eq('is_featured', true)
        .eq('is_gallery_public', true);

      // If studentId is provided, filter for that specific student
      if (studentId) {
        console.log('Filtering for specific student:', studentId);
        query = query.eq('id', studentId);
      }

      const { data: featuredStudents, error: studentsError } = await query;

      if (studentsError) {
        console.error('Error fetching featured students:', studentsError);
        return [];
      }

      console.log('Found featured students:', featuredStudents?.length || 0);

      if (!featuredStudents?.length) {
        console.log('No featured students found');
        return [];
      }

      const studentIds = featuredStudents.map(student => student.id);
      console.log('Fetching artwork for student IDs:', studentIds);

      const { data: artwork, error: artworkError } = await supabase
        .from('artwork')
        .select(`
          *,
          student:students(
            name,
            photo_url,
            about_text
          )
        `)
        .in('student_id', studentIds)
        .eq('is_private', false)
        .order('created_at', { ascending: false });

      if (artworkError) {
        console.error('Error fetching featured artwork:', artworkError);
        return [];
      }

      console.log('Found featured artwork:', artwork?.length || 0);
      return artwork || [];
    },
  });

  useEffect(() => {
    console.log('Setting up realtime subscription for featured gallery');
    const channel = supabase
      .channel('featured-gallery-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'students',
          filter: 'is_featured=true'
        },
        (payload) => {
          console.log('Featured student change received:', payload);
          refetch();
          toast.info('Featured gallery updates available');
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up featured gallery subscription');
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (!featuredArtwork?.length) {
    console.log('No featured artwork to display');
    return null;
  }

  console.log('Rendering featured artwork gallery:', featuredArtwork.length, 'items');
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {featuredArtwork.map((artwork) => (
          <CarouselItem key={artwork.id} className="md:basis-1/2 lg:basis-1/3">
            <Link 
              to={`/gallery/${artwork.student.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="block group"
            >
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                <img 
                  src={artwork.image_url} 
                  alt={artwork.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                  <h3 className="font-medium">{artwork.student.name}</h3>
                  <p className="text-sm font-medium">{artwork.title}</p>
                  {artwork.description && (
                    <p className="text-sm line-clamp-2">{artwork.description}</p>
                  )}
                  <p className="text-sm mt-1">View Gallery →</p>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}