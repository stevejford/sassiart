export interface Student {
  id: string;
  name: string;
  email: string;
  created_at: string;
  is_admin: boolean | null;
}

export interface Artwork {
  id: string;
  student_id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_at: string;
  is_private: boolean | null;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  category: string;
  category_id: string | null;
  image_url: string;
  created_at: string;
  is_popular: boolean | null;
  total_sales: number | null;
  product_categories?: ProductCategory | null;
}

export interface ArtworkWithStudent extends Artwork {
  student: {
    name: string;
  };
}