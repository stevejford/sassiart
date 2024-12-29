import { Input } from "@/components/ui/input"
import { Product } from "@/types/database"

interface PriceFieldsProps {
  product: Product
  onUpdate: (updates: Partial<Product>) => Promise<void>
}

export const PriceFields = ({ product, onUpdate }: PriceFieldsProps) => {
  const calculateTotalPrice = (basePrice: number, markup: number) => {
    return basePrice * (1 + markup / 100)
  }

  return (
    <div className="space-y-2">
      <Input
        type="number"
        placeholder="Cost Price"
        defaultValue={product.base_price}
        onBlur={(e) => onUpdate({ base_price: parseFloat(e.target.value) })}
      />
      <Input
        type="number"
        placeholder="Markup %"
        defaultValue="30"
        onBlur={(e) => {
          const markup = parseFloat(e.target.value)
          const totalPrice = calculateTotalPrice(product.base_price, markup)
          console.log('Total price:', totalPrice)
        }}
      />
      <div className="text-sm text-muted-foreground">
        Total Price: ${calculateTotalPrice(product.base_price, 30).toFixed(2)}
      </div>
    </div>
  )
}