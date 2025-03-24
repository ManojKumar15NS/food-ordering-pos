export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  popular?: boolean
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface UserInfo {
  name: string
  phone: string
  rewardPoints: number
}

