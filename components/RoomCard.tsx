type RoomCardProps = {
    room: {
        id: string
        room_type: string
        price_per_night: number | null
        status: string
        image: string | null
        categories: { name: string } | null
    }
}

export default function RoomCard({ room }: RoomCardProps) {
    const isAvailable = room.status === 'available'

    return (
        <div className="bg-gray-100 rounded-2xl overflow-hidden">
            {/* image + status dot */}
            <div className="relative aspect-square">
                <img
                    src={room.image ?? '/images/door_image.jpeg'}
                    alt={room.room_type}
                    className="w-full h-full object-cover"
                />
                <span
                    className={`absolute top-3 right-3 w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'
                        }`}
                />
            </div>

            {/* Text Content */}
            <div className="p-4 text-center">
                <h3 className="font-heading text-lg font-bold">{room.room_type}</h3>


                <a href={`/rooms/${room.id}`} className="text-green-600 text-sm">
                    View Details
                </a>

                <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-lg">
                        {room.price_per_night ? `₦${room.price_per_night.toLocaleString()}` : 'Amount'}
                    </span>
                    <button className="bg-indigo-900 text-white text-sm px-4 py-2 rounded-lg">
                        Reserve Room
                    </button>
                </div>
            </div>
        </div>
    )
}