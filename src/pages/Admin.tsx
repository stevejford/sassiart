import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Product, Student, ArtworkWithStudent } from "@/types/database"
import { ProductTable } from "@/components/admin/ProductTable"
import { ArtworkTable } from "@/components/admin/ArtworkTable"
import { StudentTable } from "@/components/admin/StudentTable"
import { AddProductDialog } from "@/components/admin/AddProductDialog"
import { toast } from "sonner"

export default function Admin() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [artwork, setArtwork] = useState<ArtworkWithStudent[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdminStatus()
    fetchData()

    // Set up real-time subscriptions
    const channel = supabase
      .channel('admin-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Product change received:', payload)
          fetchData()
          toast.info('Products updated')
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'artwork' },
        (payload) => {
          console.log('Artwork change received:', payload)
          fetchData()
          toast.info('Artwork updated')
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        (payload) => {
          console.log('Student change received:', payload)
          fetchData()
          toast.info('Students updated')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/')
      return
    }

    const { data: studentData } = await supabase
      .from('students')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!studentData?.is_admin) {
      navigate('/')
      return
    }

    setIsAdmin(true)
  }

  const fetchData = async () => {
    // Fetch products with category info
    const { data: productsData } = await supabase
      .from('products')
      .select('*, product_categories(*)')
      .order('created_at', { ascending: false })
    if (productsData) setProducts(productsData)

    // Fetch artwork with student info
    const { data: artworkData } = await supabase
      .from('artwork')
      .select('*, student:students(name)')
      .order('created_at', { ascending: false })
    if (artworkData) setArtwork(artworkData as ArtworkWithStudent[])

    // Fetch students
    const { data: studentsData } = await supabase
      .from('students')
      .select('*')
    if (studentsData) setStudents(studentsData)
  }

  const handleEditStudent = (student: Student) => {
    console.log('Edit student:', student)
  }

  const handleDeleteStudent = async (id: string) => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error("Failed to delete student")
      return
    }

    toast.success("Student deleted successfully")
    fetchData()
  }

  if (!isAdmin) return null

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Products</h2>
          <AddProductDialog onProductAdded={fetchData} />
        </div>
        <ProductTable products={products} onUpdate={fetchData} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Artwork</h2>
        <ArtworkTable artwork={artwork} onUpdate={fetchData} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Students</h2>
        <StudentTable 
          students={students} 
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />
      </div>
    </div>
  )
}