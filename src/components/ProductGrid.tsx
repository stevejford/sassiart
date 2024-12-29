import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ProductGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const { data: popularProducts } = useQuery<Product[]>({
    queryKey: ["popular-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_categories(*)")
        .eq("is_popular", true)
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const { data: bestSellers } = useQuery<Product[]>({
    queryKey: ["best-sellers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_categories(*)")
        .order("total_sales", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products", searchQuery, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, product_categories(*)")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      if (selectedCategory && selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <Icons.alertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Failed to load products</h3>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <Icons.package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground">Check back soon for new items</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {popularProducts && popularProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-serif font-bold mb-6">Popular Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="group block"
                >
                  <div className="aspect-[4/5] relative rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                    <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <Button size="sm" className="bg-white text-black hover:bg-white/90">
                        Quick view
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 transition-colors duration-300 group-hover:text-blue-600">
                      {product.name}
                    </h3>
                    <p className="text-lg font-medium text-gray-900">
                      {formatPrice(product.base_price)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {bestSellers && bestSellers.length > 0 && (
        <div>
          <h2 className="text-2xl font-serif font-bold mb-6">Best Sellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="group block"
                >
                  <div className="aspect-[4/5] relative rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                    <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <Button size="sm" className="bg-white text-black hover:bg-white/90">
                        Quick view
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 transition-colors duration-300 group-hover:text-blue-600">
                      {product.name}
                    </h3>
                    <p className="text-lg font-medium text-gray-900">
                      {formatPrice(product.base_price)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-serif font-bold mb-6">All Products</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="max-w-[200px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link
                to={`/product/${product.id}`}
                className="group block"
              >
                <div className="aspect-[4/5] relative rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                  <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <Button size="sm" className="bg-white text-black hover:bg-white/90">
                      Quick view
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-1 transition-colors duration-300 group-hover:text-blue-600">
                    {product.name}
                  </h3>
                  <p className="text-lg font-medium text-gray-900">
                    {formatPrice(product.base_price)}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};