import { Navbar } from "@/components/Navbar";
import { ProductGrid } from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Student Artwork Shop</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover unique artwork created by talented students and support their artistic journey
          </p>
        </header>
        <ProductGrid />
      </main>
    </div>
  );
};

export default Index;