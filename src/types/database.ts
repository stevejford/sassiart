export interface Student {
  id: string
  name: string
  email: string
  is_admin: boolean
  created_at: string
  is_gallery_public: boolean
  is_featured: boolean
  featured_until: string | null
}

export interface ProductCategory {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  base_price: number
  category: string
  image_url: string
  created_at: string
  category_id: string | null
  total_sales: number
  is_popular: boolean
  product_categories?: ProductCategory | null
}

export interface Artwork {
  id: string
  student_id: string
  title: string
  description: string | null
  image_url: string
  created_at: string
  is_private: boolean
}

export interface ArtworkWithStudent extends Artwork {
  student: {
    name: string
  }
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_address: string
  total_amount: number
  status: string
  created_at: string
  notification_email: string | null
  order_status: string | null
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  artwork_id: string
  quantity: number
  unit_price: number
  created_at: string
}

export interface Subscription {
  id: string
  email: string
  student_id: string | null
  subscribe_to_gallery: boolean
  subscribe_to_newsletter: boolean
  created_at: string
}