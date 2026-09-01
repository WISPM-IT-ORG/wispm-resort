'use client'

import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

type ReserveButtonProps = {
    room: {
        id: string
        room_type: string
        price_per_night: number | null
        image: string | null
        total_slots: number
        available_slots: number
    }
}

export default function ReserveButton({ room }: ReserveButtonProps) {
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
        <button
            onClick={handleReserve}
            disabled={!isBookable}
            className="bg-primary text-white px-6 py-3 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
            Reserve Room
        </button>
    )
}