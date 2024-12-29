import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { GalleryHeader } from "@/components/gallery/GalleryHeader"
import { ArtworkGrid } from "@/components/gallery/ArtworkGrid"
import { ProductGrid } from "@/components/gallery/ProductGrid"
import { useState } from "react"
import { Product } from "@/types/database"

export default function Gallery() {
  const { studentName } = useParams()
  const navigate = useNavigate()
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(null)
  const [showProducts, setShowProducts] = useState(false)

  const { data: student } = useQuery({
    queryKey: ['student', studentName],
    queryFn: async () => {
      const { data } = await supabase
        .from('students')
        .select('*')
        .ilike('name', studentName?.replace('-', ' ') || '')
        .single()
      return data
    },
  })

  const { data: artwork } = useQuery({
    queryKey: ['student-artwork', student?.id],
    queryFn: async () => {
      if (!student?.id) return null
      const { data } = await supabase
        .from('artwork')
        .select('*')
        .eq('student_id', student.id)
        .order('created_at', { ascending: false })
      return data
    },
    enabled: !!student?.id,
  })

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('*, product_categories(*)')
      return data as Product[]
    },
    enabled: showProducts,
  })

  const handleArtworkSelect = (artworkId: string) => {
    setSelectedArtwork(artworkId)
    setShowProducts(true)
  }

  const handleProductSelect = (productId: string) => {
    if (!selectedArtwork) return
    navigate(`/product/${productId}?artworkId=${selectedArtwork}`)
  }

  if (!student) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <GalleryHeader studentName={student.name} studentId={student.id} />
      
      {!showProducts ? (
        <ArtworkGrid 
          artwork={artwork || []} 
          onArtworkSelect={handleArtworkSelect} 
        />
      ) : (
        <ProductGrid 
          products={products || []}
          onBack={() => {
            setShowProducts(false)
            setSelectedArtwork(null)
          }}
          onProductSelect={handleProductSelect}
        />
      )}
    </div>
  )
}