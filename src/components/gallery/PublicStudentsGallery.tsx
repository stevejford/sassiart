import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { toast } from "sonner";

interface PublicStudentsGalleryProps {
  onArtworkSelect?: (artworkId: string) => void;
}

export function PublicStudentsGallery({ onArtworkSelect }: PublicStudentsGalleryProps) {
  const { data: students = [], refetch } = useQuery({
    queryKey: ['public-students'],
    queryFn: async () => {
      console.log('Fetching public students');
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('is_gallery_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching public students:', error);
        return [];
      }

      console.log('Found public students:', data?.length || 0);
      return data || [];
    },
  });

  useEffect(() => {
    console.log('Setting up realtime subscription for public galleries');
    const channel = supabase
      .channel('public-gallery-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'students',
          filter: 'is_gallery_public=true'
        },
        (payload) => {
          console.log('Student gallery change received:', payload);
          refetch();
          toast.info('Gallery updates available');
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up public gallery subscription');
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (!students?.length) {
    console.log('No public students to display');
    return null;
  }

  console.log('Rendering public students gallery:', students.length, 'students');
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {students.map((student) => (
          <CarouselItem key={student.id} className="md:basis-1/3 lg:basis-1/4">
            <Link 
              to={onArtworkSelect ? `#` : `/gallery/${student.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="block group"
              onClick={(e) => {
                if (onArtworkSelect) {
                  console.log('Artwork selected for student:', student.id);
                  e.preventDefault();
                  onArtworkSelect(student.id);
                }
              }}
            >
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                {student.photo_url ? (
                  <img 
                    src={student.photo_url} 
                    alt={student.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error('Error loading student photo:', student.photo_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <User className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                  <h3 className="font-medium">{student.name}</h3>
                  {student.about_text && (
                    <p className="text-sm line-clamp-2">{student.about_text}</p>
                  )}
                  <p className="text-sm mt-1">
                    {onArtworkSelect ? 'Select Artwork →' : 'View Gallery →'}
                  </p>
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