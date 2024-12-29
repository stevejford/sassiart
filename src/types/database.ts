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
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  category: string;
  image_url: string;
  created_at: string;
}

// Type for artwork with joined student data
export interface ArtworkWithStudent extends Artwork {
  student: {
    name: string;
  };
}