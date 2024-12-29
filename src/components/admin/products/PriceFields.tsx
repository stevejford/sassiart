import { Input } from "@/components/ui/input"
import { Product } from "@/types/database"
import { useState, useEffect } from "react"

interface PriceFieldsProps {
  product: Product
  onUpdate: (updates: Partial<Product>) => Promise<void>
}

export const PriceFields = ({ product, onUpdate }: PriceFieldsProps) => {
  const [markup, setMarkup] = useState(30) // Default 30% markup
  const [basePrice, setBasePrice] = useState(product.base_price)

  useEffect(() => {
    setBasePrice(product.base_price)
  }, [product])

  const calculateTotalPrice = (base: number, markupPercentage: number) => {
    return base * (1 + markupPercentage / 100)
  }

  const handleBasePriceChange = async (value: number) => {
    setBasePrice(value)
    await onUpdate({ base_price: value })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="number"
          placeholder="Base Price"
          value={basePrice}
          onChange={(e) => handleBasePriceChange(parseFloat(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Input
          type="number"
          placeholder="Markup %"
          value={markup}
          onChange={(e) => setMarkup(parseFloat(e.target.value))}
        />
      </div>
      <div className="text-sm text-muted-foreground">
        Total Price: ${calculateTotalPrice(basePrice, markup).toFixed(2)}
      </div>
    </div>
  )
}