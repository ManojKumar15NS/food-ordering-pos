"use client"

import { useEffect, useState } from "react"
import type { CartItem, UserInfo } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { loadRazorpay } from "@/lib/razorpay"
import { useRouter } from "next/navigation"
import LoginModal from "@/components/login-modal"
import { User, ShoppingCart, Plus, Minus, X, Coffee, Utensils, Pizza, Beef, IceCream, Sandwich } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function Home() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orderNumber, setOrderNumber] = useState("2458")
  const [tokenNumber, setTokenNumber] = useState<string | null>(null)
  const [tableNumber, setTableNumber] = useState("")
  const [specialRequirements, setSpecialRequirements] = useState("")
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway">("dine-in")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card")
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const { toast } = useToast()

  // Load cart and user info from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("foodkiosk-cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    const savedUserInfo = localStorage.getItem("foodkiosk-user")
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("foodkiosk-cart", JSON.stringify(cartItems))
  }, [cartItems])

  // Save user info to localStorage whenever it changes
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("foodkiosk-user", JSON.stringify(userInfo))
    }
  }, [userInfo])

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((cartItem) => cartItem.id === item.id)

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += 1
        return updatedItems
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))

    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
      duration: 2000,
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.id !== id)
      }

      return prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    })
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const tax = subtotal * 0.08
  const serviceFee = 0.5
  const total = subtotal + tax + serviceFee

  const handlePayment = async () => {
    if (orderType === "dine-in" && !tableNumber) {
      toast({
        title: "Table number required",
        description: "Please enter your table number",
        variant: "destructive",
      })
      return
    }

    if (paymentMethod === "cash") {
      // Redirect to cash payment confirmation page
      router.push(`/cash-payment?amount=${total.toFixed(2)}`)
      return
    }

    try {
      const razorpay = await loadRazorpay()

      const options = {
        key: "rzp_test_1DP5mmOlF5G5ag",
        amount: Math.round(total * 100), // Amount in paise
        currency: "INR",
        name: "FoodKiosk",
        description: "Order Payment",
        handler: (response: any) => {
          toast({
            title: "Payment Successful!",
            description: `Payment ID: ${response.razorpay_payment_id}`,
            duration: 5000,
          })
          generateToken()
        },
        prefill: {
          name: userInfo?.name || "Guest User",
          email: "guest@example.com",
          contact: userInfo?.phone || "9999999999",
        },
        theme: {
          color: "#e63946",
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

  const generateToken = () => {
    // Generate a random 4-digit token number
    const newToken = Math.floor(1000 + Math.random() * 9000).toString()
    setTokenNumber(newToken)

    toast({
      title: "Token Generated",
      description: `Your token number is ${newToken}`,
      duration: 5000,
    })
  }

  const handleLogin = (phone: string) => {
    setUserInfo({
      name: "Customer",
      phone: phone,
      rewardPoints: Math.floor(Math.random() * 100),
    })

    setIsLoginModalOpen(false)

    toast({
      title: "Login Successful",
      description: "Welcome back!",
      duration: 3000,
    })
  }

  const handleLogout = () => {
    setUserInfo(null)
    localStorage.removeItem("foodkiosk-user")

    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
      duration: 3000,
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "popular":
        return <Utensils className="h-4 w-4 mr-1" />
      case "chicken":
        return <Sandwich className="h-4 w-4 mr-1" />
      case "burgers":
        return <Beef className="h-4 w-4 mr-1" />
      case "sides":
        return <Pizza className="h-4 w-4 mr-1" />
      case "beverages":
        return <Coffee className="h-4 w-4 mr-1" />
      case "desserts":
        return <IceCream className="h-4 w-4 mr-1" />
      default:
        return <Utensils className="h-4 w-4 mr-1" />
    }
  }

  const renderMenuItem = (item: CartItem) => (
    <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="h-40 relative mb-2">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
        {item.popular && <Badge className="absolute top-2 right-2 bg-red-500">Popular</Badge>}
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium capitalize">{item.name}</h3>
          <p className="text-red-500 font-medium">₹{item.price.toFixed(2)}</p>
        </div>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
        <Button
          onClick={() => addToCart(item)}
          className="w-full bg-red-500 hover:bg-red-600 text-white transition-colors"
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  )

  return (
    <main className="min-h-screen bg-gray-100 py-4 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4 p-4 border-r border-gray-200">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-gray-200 p-2 rounded-full">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  {userInfo ? (
                    <>
                      <p className="text-sm font-medium">{userInfo.name}</p>
                      <p className="text-xs text-gray-500">{userInfo.rewardPoints} Reward Points</p>
                      <p className="text-xs text-gray-500">{userInfo.phone}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Guest User</p>
                      <p className="text-xs text-gray-500">0 Reward Points</p>
                    </>
                  )}
                </div>
              </div>

              {userInfo ? (
                <Button onClick={handleLogout} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800">
                  Sign Out
                </Button>
              ) : (
                <Button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  Sign In / Register
                </Button>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 text-gray-800">Order Settings</h3>
              <div className="flex mb-4">
                <Button
                  className={`flex-1 rounded-r-none transition-colors ${orderType === "dine-in" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                  onClick={() => setOrderType("dine-in")}
                >
                  Dine-in
                </Button>
                <Button
                  className={`flex-1 rounded-l-none transition-colors ${orderType === "takeaway" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                  onClick={() => setOrderType("takeaway")}
                >
                  Takeaway
                </Button>
              </div>

              {orderType === "dine-in" && (
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">Table Number</label>
                  <Input
                    type="number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Enter table number"
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-700">Special Requirements</label>
                <Textarea
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="Any special requests or allergies?"
                  className="h-24 border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <p className="text-sm text-gray-500 italic">Need assistance?</p>
            </div>
          </div>

          {/* Middle Section - Menu */}
          <div className="w-full md:w-2/4 p-4">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <Image src="/placeholder.svg?height=50&width=150" alt="FoodKiosk Logo" width={150} height={50} />
              </div>
              <h2 className="text-xl font-bold mb-1 text-gray-800">Menu</h2>
              <p className="text-sm text-gray-600 mb-4">Select items to add to your order</p>
            </div>

            <Tabs defaultValue="popular">
              <TabsList className="grid grid-cols-6 mb-6 bg-gray-100">
                <TabsTrigger value="popular" className="text-sm flex items-center">
                  {getCategoryIcon("popular")}
                  Popular
                </TabsTrigger>
                <TabsTrigger value="chicken" className="text-sm flex items-center">
                  {getCategoryIcon("chicken")}
                  Chicken
                </TabsTrigger>
                <TabsTrigger value="burgers" className="text-sm flex items-center">
                  {getCategoryIcon("burgers")}
                  Burgers
                </TabsTrigger>
                <TabsTrigger value="sides" className="text-sm flex items-center">
                  {getCategoryIcon("sides")}
                  Sides
                </TabsTrigger>
                <TabsTrigger value="beverages" className="text-sm flex items-center">
                  {getCategoryIcon("beverages")}
                  Beverages
                </TabsTrigger>
                <TabsTrigger value="desserts" className="text-sm flex items-center">
                  {getCategoryIcon("desserts")}
                  Desserts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="popular" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderMenuItem({
                  id: "popular-1",
                  name: "chicken tandoori",
                  description: "Spicy grilled chicken with Indian spices and herbs, served with mint chutney",
                  price: 190.99,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                  popular: true,
                })}
                {renderMenuItem({
                  id: "popular-2",
                  name: "Peri Peri fries",
                  description: "Crispy fries with spicy peri peri seasoning and herbs",
                  price: 80.49,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                  popular: true,
                })}
                {renderMenuItem({
                  id: "popular-3",
                  name: "Double Burger",
                  description: "Double patty burger with cheese, lettuce, tomato and special sauce",
                  price: 170.99,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                  popular: true,
                })}
                {renderMenuItem({
                  id: "popular-4",
                  name: "Chicken Sandwich",
                  description: "Grilled chicken sandwich with fresh veggies and mayo",
                  price: 60.49,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                  popular: true,
                })}
                {renderMenuItem({
                  id: "popular-5",
                  name: "beverages",
                  description: "Refreshing soft drinks and mocktails to quench your thirst",
                  price: 100.99,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                  popular: true,
                })}
                {renderMenuItem({
                  id: "popular-6",
                  name: "desserts",
                  description: "Sweet treats to end your meal on a perfect note",
                  price: 250.49,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                  popular: true,
                })}
              </TabsContent>

              <TabsContent value="chicken" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderMenuItem({
                  id: "chicken-1",
                  name: "chicken tandoori",
                  description: "Spicy grilled chicken with Indian spices and herbs, served with mint chutney",
                  price: 190.99,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                })}
                {renderMenuItem({
                  id: "chicken-2",
                  name: "Chicken Sandwich",
                  description: "Grilled chicken sandwich with fresh veggies and mayo",
                  price: 60.49,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                })}
                {renderMenuItem({
                  id: "chicken-3",
                  name: "Chicken Wings",
                  description: "Spicy chicken wings with BBQ sauce",
                  price: 150.99,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                })}
              </TabsContent>

              <TabsContent value="burgers" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderMenuItem({
                  id: "burger-1",
                  name: "Double Burger",
                  description: "Double patty burger with cheese, lettuce, tomato and special sauce",
                  price: 170.99,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                })}
                {renderMenuItem({
                  id: "burger-2",
                  name: "Veggie Burger",
                  description: "Plant-based patty with fresh veggies and special sauce",
                  price: 140.99,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                })}
              </TabsContent>

              <TabsContent value="sides" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderMenuItem({
                  id: "side-1",
                  name: "Peri Peri fries",
                  description: "Crispy fries with spicy peri peri seasoning and herbs",
                  price: 80.49,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                })}
                {renderMenuItem({
                  id: "side-2",
                  name: "Onion Rings",
                  description: "Crispy battered onion rings with dipping sauce",
                  price: 90.49,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                })}
              </TabsContent>

              <TabsContent value="beverages" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderMenuItem({
                  id: "beverage-1",
                  name: "beverages",
                  description: "Refreshing soft drinks and mocktails to quench your thirst",
                  price: 100.99,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                })}
                {renderMenuItem({
                  id: "beverage-2",
                  name: "Iced Tea",
                  description: "Refreshing iced tea with lemon",
                  price: 70.99,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                })}
              </TabsContent>

              <TabsContent value="desserts" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderMenuItem({
                  id: "dessert-1",
                  name: "desserts",
                  description: "Sweet treats to end your meal on a perfect note",
                  price: 250.49,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                })}
                {renderMenuItem({
                  id: "dessert-2",
                  name: "Ice Cream",
                  description: "Creamy vanilla ice cream with chocolate sauce",
                  price: 120.49,
                  image: "/placeholder.svg?height=300&width=400",
                  quantity: 0,
                })}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Order Summary */}
          <div className="w-full md:w-1/4 p-4 border-l border-gray-200">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800">Your Order</h2>
              <p className="text-sm text-gray-500">Order #{orderNumber}</p>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 mb-4 bg-gray-50 rounded-lg">
                <ShoppingCart className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Your cart is empty.</p>
              </div>
            ) : (
              <div className="mb-4 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        ₹{item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full h-5 w-5 flex items-center justify-center transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full h-5 w-5 flex items-center justify-center transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-1 mb-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service Fee</span>
                <span>₹{serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-gray-200 mt-1">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm pt-1">
                <span>Token Number</span>
                <span className={tokenNumber ? "text-green-600 font-medium" : "text-gray-500"}>
                  {tokenNumber || "Not Generated"}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm mb-2 text-gray-700">Payment Method</p>
              <div className="flex gap-2">
                <Button
                  className={`flex-1 transition-colors ${paymentMethod === "card" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  Card
                </Button>
                <Button
                  className={`flex-1 transition-colors ${paymentMethod === "cash" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  Cash
                </Button>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={cartItems.length === 0}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mb-2 transition-colors"
            >
              Pay Now
            </Button>

            <Button
              onClick={generateToken}
              disabled={cartItems.length === 0}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              Generate Token
            </Button>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
    </main>
  )
}

