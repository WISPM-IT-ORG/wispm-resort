'use client'

import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

type RoomCardProps = {
    room: {
        id: string
        room_type: string
        price_per_night: number | null
        image: string | null
        total_slots: number
        available_slots: number
        categories: { name: string } | null
    }
}

export default function RoomCard({ room }: RoomCardProps) {
    const { items, addToCart } = useCart()

    const inCart = items.find((i) => i.id === room.id)?.quantity ?? 0
    const remaining = room.available_slots - inCart
    const isBookable = remaining > 0

    function handleReserve() {
        if (!isBookable) {
            toast.error('No more slots available for this room')
            return
        }
        addToCart({
            id: room.id,
            room_type: room.room_type,
            price_per_night: room.price_per_night,
            image: room.image,
        })
        toast.success(`${room.room_type} added to cart`)
    }

    return (
        <div className="bg-gray-100 rounded-2xl overflow-hidden">
            <div className="relative aspect-square">
                <img
                    src={room.image ?? '/images/door_image.jpeg'}
                    alt={room.room_type}
                    className="w-full h-full object-cover"
                />
                <span
                    className={`absolute top-3 right-3 w-3 h-3 rounded-full ${isBookable ? 'bg-green-500' : 'bg-red-500'
                        }`}
                />
            </div>

            <div className="p-4 text-center">
                <h3 className="font-heading text-lg font-bold">{room.room_type}</h3>
                <a href={`/rooms/${room.id}`} className="text-green-600 text-sm">View Details</a>

                {room.total_slots > 1 && (
                    <p className="text-muted text-xs mt-1">
                        {remaining} of {room.total_slots} beds available
                    </p>
                )}

                <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-lg">
                        {room.price_per_night ? `₦${room.price_per_night.toLocaleString()}` : 'Amount'}
                    </span>
                    <button
                        onClick={handleReserve}
                        disabled={!isBookable}
                        className="bg-primary text-white text-sm px-4 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Reserve Room
                    </button>
                </div>
            </div>
        </div>
    )
}