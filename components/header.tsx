"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  cartCount: number
  toggleCart: () => void
}

export default function Header({ cartCount, toggleCart }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative">
              <div className="w-10 h-10 bg-[#FFC72C] rounded-full flex items-center justify-center">
                <span className="text-[#DA291C] font-bold text-xl">M</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#DA291C]">MkDonald's</h1>
          </div>
          <Button onClick={toggleCart} variant="outline" className="relative">
            <ShoppingCart className="h-5 w-5 text-[#DA291C]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#DA291C] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}

