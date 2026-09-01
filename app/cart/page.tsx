'use client'

import { useCart } from '@/context/CartContext'

export default function CartPage() {
    const { items, removeFromCart, totalRooms, totalAmount } = useCart()

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
                {/* Room list */}
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
                            <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Summary panel */}
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
                    <button className="w-full bg-primary text-white py-3 rounded-lg">
                        Checkout
                    </button>
                </div>
            </div>
        </main>
    )
}