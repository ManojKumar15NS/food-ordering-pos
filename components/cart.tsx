"use client"

import { useState } from "react"
import type { CartItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { loadRazorpay } from "@/lib/razorpay"
import { useToast } from "@/components/ui/use-toast"

interface CartProps {
  items: CartItem[]
  updateQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  isOpen: boolean
  toggleCart: () => void
}

export default function Cart({ items, updateQuantity, removeFromCart, isOpen, toggleCart }: CartProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const { toast } = useToast()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const gst = subtotal * 0.12
  const total = subtotal + gst

  const handleCheckout = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      })
      return
    }

    try {
      const razorpay = await loadRazorpay()

      const options = {
        key: "rzp_test_1DP5mmOlF5G5ag",
        amount: Math.round(total * 100), // Amount in paise
        currency: "INR",
        name: "MkDonald's",
        description: "Order Payment",
        handler: (response: any) => {
          toast({
            title: "Payment Successful!",
            description: `Payment ID: ${response.razorpay_payment_id}`,
            duration: 5000,
          })
          // Here you would typically send the order to your backend
        },
        prefill: {
          name: "MkCustomer",
          email: "customer@example.com",
          contact: phoneNumber,
        },
        theme: {
          color: "#DA291C",
        },
      }

      const paymentObject = new razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.error("Failed to load Razorpay", error)
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment gateway",
        variant: "destructive",
      })
    }
  }

  if (items.length === 0 && !isCheckingOut) {
    return (
      <div
        className={`w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md border border-gray-200 ${isOpen ? "block" : "hidden md:block"}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">Your cart is empty</p>
          <Button className="mt-4 bg-[#FF9800] hover:bg-[#FFC72C] text-black" onClick={toggleCart}>
            Start Ordering
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md border border-gray-200 ${isOpen ? "block" : "hidden md:block"}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleCart}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {!isCheckingOut ? (
        <>
          <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (12%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full bg-[#FF9800] hover:bg-[#FFC72C] text-black" onClick={() => setIsCheckingOut(true)}>
            Proceed to Checkout
          </Button>
        </>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Order Summary</h3>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (12%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your 10-digit number"
              className="w-full p-2 border rounded-md"
              maxLength={10}
            />
          </div>

          <div className="space-y-2">
            <Button className="w-full bg-[#FFC72C] hover:bg-[#FF9800] text-black font-bold" onClick={handleCheckout}>
              💳 Pay Now
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setIsCheckingOut(false)}>
              Back to Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

