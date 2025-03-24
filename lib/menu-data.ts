import type { MenuItem } from "./types"

export const menuData: {
  popular: MenuItem[]
  chicken: MenuItem[]
  burgers: MenuItem[]
  sides: MenuItem[]
  beverages: MenuItem[]
  desserts: MenuItem[]
} = {
  popular: [
    {
      id: "popular-1",
      name: "chicken tandoori",
      description: "Spicy grilled chicken with Indian spices",
      price: 190.99,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "popular-2",
      name: "Peri Peri fries",
      description: "Crispy fries with peri peri seasoning",
      price: 80.49,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "popular-3",
      name: "Double Burger",
      description: "Double patty burger with cheese and veggies",
      price: 170.99,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "popular-4",
      name: "Chicken Sandwich",
      description: "Grilled chicken sandwich with fresh veggies",
      price: 60.49,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "popular-5",
      name: "beverages",
      description: "Refreshing soft drinks",
      price: 100.99,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "popular-6",
      name: "desserts",
      description: "Sweet treats to end your meal",
      price: 250.49,
      image: "/placeholder.svg?height=300&width=400",
    },
  ],
  chicken: [
    {
      id: "chicken-1",
      name: "chicken tandoori",
      description: "Spicy grilled chicken with Indian spices",
      price: 190.99,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "chicken-2",
      name: "Chicken Sandwich",
      description: "Grilled chicken sandwich with fresh veggies",
      price: 60.49,
      image: "/placeholder.svg?height=300&width=400",
    },
  ],
  burgers: [
    {
      id: "burger-1",
      name: "Double Burger",
      description: "Double patty burger with cheese and veggies",
      price: 170.99,
      image: "/placeholder.svg?height=300&width=400",
    },
  ],
  sides: [
    {
      id: "side-1",
      name: "Peri Peri fries",
      description: "Crispy fries with peri peri seasoning",
      price: 80.49,
      image: "/placeholder.svg?height=300&width=400",
    },
  ],
  beverages: [
    {
      id: "beverage-1",
      name: "beverages",
      description: "Refreshing soft drinks",
      price: 100.99,
      image: "/placeholder.svg?height=300&width=400",
    },
  ],
  desserts: [
    {
      id: "dessert-1",
      name: "desserts",
      description: "Sweet treats to end your meal",
      price: 250.49,
      image: "/placeholder.svg?height=300&width=400",
    },
  ],
}

