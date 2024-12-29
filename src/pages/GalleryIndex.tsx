import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

export default function GalleryIndex() {
  const { data: students, isLoading } = useQuery({
    queryKey: ['public-students-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          name,
          photo_url,
          about_text,
          artwork (count)
        `)
        .eq('is_gallery_public', true)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[200px] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold mb-4">Student Galleries</h1>
        <p className="text-lg text-muted-foreground">
          Browse through our talented students' artwork collections
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {students?.map((student) => (
          <Link
            key={student.id}
            to={`/gallery/${student.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="block group"
          >
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border hover:border-primary transition-colors">
              {student.photo_url ? (
                <img 
                  src={student.photo_url}
                  alt={student.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm p-4">
                <h3 className="font-medium text-lg">{student.name}</h3>
                {student.about_text && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                    {student.about_text}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {student.artwork[0].count} Artworks
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}