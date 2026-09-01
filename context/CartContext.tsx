'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type CartItem = {
    id: string
    room_type: string
    price_per_night: number | null
    image: string | null
    quantity: number
}

type CartContextType = {
    items: CartItem[]
    addToCart: (room: Omit<CartItem, 'quantity'>) => void
    removeFromCart: (id: string) => void
    totalRooms: number
    totalAmount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [hasLoaded, setHasLoaded] = useState(false)

    // Load any saved cart on first mount (survives a page refresh, not just navigation)
    useEffect(() => {
        const saved = localStorage.getItem('cart')
        if (saved) setItems(JSON.parse(saved))
            setHasLoaded(true)
    }, [])

    // Persist to localStorage every time the cart changes
    useEffect(() => {
        if (!hasLoaded) return
        localStorage.setItem('cart', JSON.stringify(items))
    }, [items, hasLoaded])

    function addToCart(room: Omit<CartItem, 'quantity'>) {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === room.id)
            if (existing) {
                return prev.map((item) =>
                    item.id === room.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prev, { ...room, quantity: 1 }]
        })
    }

    function removeFromCart(id: string) {
        setItems((prev) => prev.filter((item) => item.id !== id))
    }

    const totalRooms = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = items.reduce(
        (sum, item) => sum + (item.price_per_night ?? 0) * item.quantity,
        0
    )

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, totalRooms, totalAmount }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used inside a CartProvider')
    }
    return context
}