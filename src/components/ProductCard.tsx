import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  artist: string;
  price: number;
}

export const ProductCard = ({ id, image, title, artist, price }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden group animate-fadeIn">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-4">
        <div className="flex flex-col">
          <h3 className="font-serif text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">by {artist}</p>
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="font-medium">${price}</span>
          <Button 
            variant="secondary"
            onClick={() => navigate(`/product/${id}`)}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};