import { ProductCard } from "@/components/ProductCard"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { ProductResult } from "@/types"

interface ProductScrollProps {
  products: ProductResult[]
}

export function ProductScroll({ products }: ProductScrollProps) {
  return (
    <ScrollArea className="w-full py-2">
      <div className="flex gap-3 pb-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
