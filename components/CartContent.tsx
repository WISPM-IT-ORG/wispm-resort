'use client'

import { useCart } from '@/context/CartContext'
import { checkout } from '@/app/cart/actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CartContent({ isLoggedIn }: { isLoggedIn: boolean }) {
    const router = useRouter()

    const { items, removeFromCart, totalRooms, totalAmount, clearCart } = useCart()
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    async function handleCheckout() {
        if (!isLoggedIn) {
            window.location.href = '/login'
            return
        }

        setIsCheckingOut(true)
        const checkoutItems = items.map((item) => ({ id: item.id, quantity: item.quantity }))
        const { results } = await checkout(checkoutItems)

        const succeeded = results.filter((r) => r.success)
        const failed = results.filter((r) => !r.success)

        failed.forEach((f) => toast.error(f.message))

        if (succeeded.length > 0) {
            const bookingIds = succeeded.map((r) => r.bookingId).join(',')
            router.push(`/payment?bookings=${bookingIds}`)
        }

        setIsCheckingOut(false)
    }

    if (items.length === 0) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-16 text-center">
                <p className="text-muted">Your cart is empty.</p>
                <a href="/" className="text-primary underline mt-2 inline-block">Browse rooms</a>
            </main>
        )
    }

    return (
        <main className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                            <img
                                src={item.image ?? '/images/door_image.jpeg'}
                                alt={item.room_type}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="font-heading font-bold">{item.room_type}</h3>
                                <p className="text-muted text-sm">
                                    {item.price_per_night
                                        ? `₦${item.price_per_night.toLocaleString()} × ${item.quantity}`
                                        : 'Amount'}
                                </p>
                            </div>
                            <span className="bg-secondary px-3 py-1 rounded-full text-sm">{item.quantity}</span>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <div className="w-full lg:w-80 bg-secondary rounded-2xl p-6 h-fit">
                    <h2 className="font-heading text-xl font-bold mb-6">Summary</h2>
                    <div className="flex justify-between mb-2">
                        <span className="text-muted">Total Rooms:</span>
                        <span className="bg-white px-3 py-1 rounded-full text-sm">{totalRooms}</span>
                    </div>
                    <div className="flex justify-between mb-6">
                        <span className="text-muted">Total Amount:</span>
                        <span className="font-bold">₦{totalAmount.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full bg-primary text-white py-3 rounded-lg disabled:opacity-50"
                    >
                        {isLoggedIn
                            ? isCheckingOut ? 'Booking...' : 'Checkout'
                            : 'Log in to checkout'}
                    </button>
                </div>
            </div>
        </main>
    )
}