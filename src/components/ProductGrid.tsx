import { ProductCard } from "./ProductCard";

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    image: "/placeholder.svg",
    title: "Abstract Dreams",
    artist: "Emma Thompson",
    price: 24.99,
  },
  {
    id: 2,
    image: "/placeholder.svg",
    title: "Ocean Waves",
    artist: "Michael Chen",
    price: 29.99,
  },
  {
    id: 3,
    image: "/placeholder.svg",
    title: "Forest Whispers",
    artist: "Sarah Johnson",
    price: 19.99,
  },
  {
    id: 4,
    image: "/placeholder.svg",
    title: "Urban Life",
    artist: "David Kim",
    price: 34.99,
  },
];

export const ProductGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {SAMPLE_PRODUCTS.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};