import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function MyBookingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
      id, quantity, total_amount, status, payment_status, created_at,
      rooms ( room_type, image )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return <pre>Error: {JSON.stringify(error, null, 2)}</pre>
    }

    const statusStyles: Record<string, string> = {
        confirmed: 'bg-green-100 text-green-700',
        pending_payment: 'bg-yellow-100 text-yellow-700',
        cancelled: 'bg-red-100 text-red-700',
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="font-heading text-2xl font-bold mb-6">My Bookings</h1>

            {bookings.length === 0 ? (
                <p className="text-muted">
                    No bookings yet. <a href="/" className="text-primary underline">Browse rooms</a>
                </p>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="flex gap-4 items-center bg-secondary rounded-xl p-4">
                            <img
                                src={booking.rooms?.image ?? '/images/door_image.jpeg'}
                                alt={booking.rooms?.room_type ?? 'Room'}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="font-heading font-bold">{booking.rooms?.room_type}</h3>
                                <p className="text-muted text-sm">
                                    {booking.quantity} bed(s) — ₦{(booking.total_amount ?? 0).toLocaleString()}
                                </p>
                                <p className="text-muted text-xs mt-1">
                                    {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : '—'}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                {booking.status.replace('_', ' ')}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}