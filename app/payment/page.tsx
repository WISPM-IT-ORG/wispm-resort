import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import PaymentActions from '@/components/PaymentActions'

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ bookings?: string }>
}) {
  const { bookings: bookingIdsParam } = await searchParams
  if (!bookingIdsParam) notFound()

  const bookingIds = bookingIdsParam.split(',')
  const supabase = await createClient()

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, quantity, total_amount, rooms ( room_type )')
    .in('id', bookingIds)
    .eq('status', 'pending_payment')

  if (error || !bookings || bookings.length === 0) notFound()

  const grandTotal = bookings.reduce((sum, b) => sum + (b.total_amount ?? 0), 0)

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-secondary rounded-2xl p-6">
        <p className="text-xs text-muted mb-1">DEMO PAYMENT — no real API connected</p>
        <h1 className="font-heading text-xl font-bold mb-6">Confirm Payment</h1>

        {bookings.map((b) => (
          <div key={b.id} className="flex justify-between text-sm mb-2">
            <span>{b.rooms?.room_type} × {b.quantity}</span>
            <span>₦{(b.total_amount ?? 0).toLocaleString()}</span>
          </div>
        ))}

        <div className="border-t border-muted/20 mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>₦{grandTotal.toLocaleString()}</span>
        </div>

        <PaymentActions bookingIds={bookingIds} />
      </div>
    </main>
  )
}