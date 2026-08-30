import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export default async function RoomDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: room, error } = await supabase
        .from('rooms')
        .select(`
      id, 
      room_type, 
      room_no, 
      bed_size, 
      capacity, 
      facilities, 
      price_per_night, 
      status, 
      image,
      categories ( name, full_description )
    `)
        .eq('id', id)
        .single()

    if (error || !room) {
        notFound()
    }

    const isAvailable = room.status === 'available'

    return (
        <main className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/5 aspect-square rounded-2xl overflow-hidden">
                    <img
                        src={room.image ?? '/images/door_image.jpeg'}
                        alt={room.room_type}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="font-heading text-2xl font-bold leading-tight">{room.room_type}</h1>
                        <span
                            className={`shrink-0 px-4 py-1 rounded-full text-sm font-medium ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}
                        >
                            {isAvailable ? 'Available' : 'Booked'}
                        </span>
                    </div>

                    <p className="text-muted mt-4">{room.bed_size}</p>

                    <p className="mt-4">{room.categories?.full_description}</p>

                    <p className="text-muted mt-6">Category:</p>
                    <p className="font-bold text-lg">{room.categories?.name}</p>

                    <div className="flex items-center justify-between mt-6">
                        <span className="font-bold text-xl">
                            {room.price_per_night ? `₦${room.price_per_night.toLocaleString()}` : 'Amount'}
                        </span>
                        <button className="bg-primary text-white px-6 py-3 rounded-lg">
                            Reserve Room
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}