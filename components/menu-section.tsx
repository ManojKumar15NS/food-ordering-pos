"use client"

import type { MenuItem } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MenuSectionProps {
  title: string
  items: MenuItem[]
  addToCart: (item: MenuItem) => void
}

export default function MenuSection({ title, items, addToCart }: MenuSectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-black">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="h-48 relative">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <p className="text-[#DA291C] font-bold">₹{item.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button onClick={() => addToCart(item)} className="w-full bg-[#FF9800] hover:bg-[#FFC72C] text-black">
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

