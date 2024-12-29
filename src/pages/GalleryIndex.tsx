import { useSearchParams, useNavigate } from "react-router-dom";
import { PublicStudentsGallery } from "@/components/gallery/PublicStudentsGallery";
import { FeaturedStudentGallery } from "@/components/gallery/FeaturedStudentGallery";

export default function GalleryIndex() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('productId');

  const handleArtworkSelect = (artworkId: string) => {
    if (productId) {
      navigate(`/product/${productId}?artworkId=${artworkId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section>
        <h2 className="text-3xl font-serif font-bold mb-8">Featured Artists</h2>
        <FeaturedStudentGallery />
      </section>

      <section>
        <h2 className="text-3xl font-serif font-bold mb-8">Student Galleries</h2>
        <PublicStudentsGallery onArtworkSelect={handleArtworkSelect} />
      </section>
    </div>
  );
}