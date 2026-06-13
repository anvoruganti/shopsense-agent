import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { ProductResult } from "@/types"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1583391732218-1d8d0f4f4b0b?w=400&h=480&fit=crop"

interface ProductCardProps {
  product: ProductResult
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageUrl, setImageUrl] = useState(product.image_url)

  return (
    <Card className="w-[160px] shrink-0 overflow-hidden">
      <CardContent className="p-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-[120px] w-full object-cover"
          loading="lazy"
          onError={() => setImageUrl(FALLBACK_IMAGE)}
        />
        <div className="space-y-1.5 p-2">
          <p className="line-clamp-2 text-sm font-medium">{product.name}</p>
          <p className="text-sm font-semibold text-cobalt">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <p className="line-clamp-2 text-xs italic text-slate-500">
            {product.reason}
          </p>
          <Button
            variant="outline"
            size="xs"
            className="w-full"
            onClick={() => window.open(product.product_url, "_blank", "noopener,noreferrer")}
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
