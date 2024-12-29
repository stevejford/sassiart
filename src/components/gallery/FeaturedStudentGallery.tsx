import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
        .select('id, name, photo_url, about_text')
        .eq('is_featured', true)
        .eq('is_gallery_public', true);

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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <Carousel className="w-full">
            <CarouselContent>
              {featuredArtwork.map((artwork) => (
                <CarouselItem key={artwork.id}>
                  <Link 
                    to={`/gallery/${artwork.student.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block group"
                  >
                    <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                      <div className="sticky top-24">
                        <div className="aspect-square overflow-hidden rounded-lg border bg-white relative">
                          {artwork.student.photo_url ? (
                            <img 
                              src={artwork.student.photo_url} 
                              alt={artwork.student.name}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : artwork.image_url ? (
                            <img 
                              src={artwork.image_url} 
                              alt={artwork.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted">
                              <User className="w-12 h-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        
        <div className="lg:col-span-5 space-y-8">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              {featuredArtwork.map((artwork) => (
                <div key={artwork.id} className="space-y-4">
                  <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">{artwork.student.name}</h1>
                    {artwork.student.about_text && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <h2 className="text-lg font-serif font-semibold mb-2">About the Artist</h2>
                          <p className="text-muted-foreground leading-relaxed">{artwork.student.about_text}</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="pt-4">
                    <Link 
                      to={`/gallery/${artwork.student.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-block w-full text-center bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90 transition-colors"
                    >
                      View Gallery
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}