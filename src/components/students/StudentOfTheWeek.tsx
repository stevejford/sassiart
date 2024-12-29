import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function StudentOfTheWeek() {
  const { data: featuredStudent } = useQuery({
    queryKey: ["featuredStudent"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("students")
        .select(`
          id,
          name,
          photo_url,
          about_text,
          featured_until,
          artwork (
            id,
            title,
            image_url
          )
        `)
        .eq("is_featured", true)
        .gt("featured_until", now)
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!featuredStudent) {
    return null;
  }

  return (
    <div className="bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Student of the Week
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Image */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <div className="aspect-[3/4] relative">
              <img
                src={featuredStudent.photo_url || "/placeholder.svg"}
                alt={featuredStudent.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="col-span-12 md:col-span-7 lg:col-span-4">
            <div className="h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-3">{featuredStudent.name}</h3>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed flex-grow">
                {featuredStudent.about_text}
              </p>
              <div className="flex gap-4">
                <Button 
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  asChild
                >
                  <Link to={`/student/${featuredStudent.id}`}>
                    View Gallery
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-blue-400 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-transparent"
                  asChild
                >
                  <Link to={`/products?student=${featuredStudent.id}`}>
                    Shop Products
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Artwork Grid */}
          <div className="col-span-12 lg:col-span-4">
            <div className="grid grid-cols-2 gap-3">
              {featuredStudent.artwork?.slice(0, 4).map((art) => (
                <Link
                  key={art.id}
                  to={`/artwork/${art.id}`}
                  className="relative group"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={art.image_url}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                    <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2 text-center">
                      {art.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
