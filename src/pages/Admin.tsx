import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Product, Student, ArtworkWithStudent } from "@/types/database"

export default function Admin() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [artwork, setArtwork] = useState<ArtworkWithStudent[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdminStatus()
    fetchData()
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
    // Fetch products
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
    if (productsData) setProducts(productsData)

    // Fetch artwork with student info
    const { data: artworkData } = await supabase
      .from('artwork')
      .select('*, student:students(name)')
    if (artworkData) setArtwork(artworkData as ArtworkWithStudent[])

    // Fetch students
    const { data: studentsData } = await supabase
      .from('students')
      .select('*')
    if (studentsData) setStudents(studentsData)
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating product",
        description: error.message
      })
    } else {
      toast({
        title: "Product updated",
        description: "The product has been updated successfully."
      })
      fetchData()
    }
  }

  if (!isAdmin) return null

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div>
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Input
                    defaultValue={product.name}
                    onBlur={(e) => updateProduct(product.id, { name: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Textarea
                    defaultValue={product.description || ''}
                    onBlur={(e) => updateProduct(product.id, { description: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={product.base_price}
                    onBlur={(e) => updateProduct(product.id, { base_price: parseFloat(e.target.value) })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    defaultValue={product.category}
                    onBlur={(e) => updateProduct(product.id, { category: e.target.value })}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Artwork</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artwork.map((art) => (
              <TableRow key={art.id}>
                <TableCell>{art.title}</TableCell>
                <TableCell>{art.student.name}</TableCell>
                <TableCell>{art.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Students</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Admin Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.is_admin ? 'Admin' : 'Student'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}