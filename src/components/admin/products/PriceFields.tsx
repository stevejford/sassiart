import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
    <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
      <div>
        <Label htmlFor="basePrice">Base Price ($)</Label>
        <Input
          id="basePrice"
          type="number"
          placeholder="Enter base price"
          value={basePrice}
          onChange={(e) => handleBasePriceChange(parseFloat(e.target.value))}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="markup">Profit Margin (%)</Label>
        <Input
          id="markup"
          type="number"
          placeholder="Enter margin percentage"
          value={markup}
          onChange={(e) => setMarkup(parseFloat(e.target.value))}
          className="mt-1.5"
        />
      </div>
      <div className="pt-2 border-t">
        <div className="text-sm font-medium">Final Price</div>
        <div className="text-2xl font-bold text-primary">
          ${calculateTotalPrice(basePrice, markup).toFixed(2)}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Includes {markup}% profit margin
        </div>
      </div>
    </div>
  )
}