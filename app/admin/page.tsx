import { createClient } from '@/utils/supabase/server'
import DashboardFilters from '@/components/admin/DashboardFilters'
import DashboardCharts from '@/components/admin/DashboardCharts'

const RANGE_DAYS: Record<string, number | null> = { '7d': 7, '30d': 30, '90d': 90, all: null }

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const { range = '30d' } = await searchParams
  const days = RANGE_DAYS[range] ?? 30
  const supabase = await createClient()

  let bookingsQuery = supabase
    .from('bookings')
    .select(`
      id, quantity, total_amount, status, payment_status, created_at,
      rooms ( room_type, categories ( name ) )
    `)
    .order('created_at', { ascending: true })

  if (days !== null) {
    const since = new Date()
    since.setDate(since.getDate() - days)
    bookingsQuery = bookingsQuery.gte('created_at', since.toISOString())
  }

  const { data: bookings, error: bookingsError } = await bookingsQuery
  const { data: rooms, error: roomsError } = await supabase
    .from('rooms')
    .select('id, total_slots, available_slots')

  if (bookingsError || roomsError) {
    return <pre>Error: {JSON.stringify(bookingsError ?? roomsError, null, 2)}</pre>
  }

  // --- aggregate on the server, ship only small summarized arrays to the client ---
  const totalBookings = bookings.length
  const totalRevenue = bookings
    .filter((b) => b.payment_status === 'paid')
    .reduce((sum, b) => sum + (b.total_amount ?? 0), 0)

  const totalSlots = rooms.reduce((sum, r) => sum + r.total_slots, 0)
  const bookedSlots = totalSlots - rooms.reduce((sum, r) => sum + r.available_slots, 0)
  const occupancyRate = totalSlots ? Math.round((bookedSlots / totalSlots) * 100) : 0

  const trendMap = new Map<string, { date: string; bookings: number; revenue: number }>()
  for (const b of bookings) {
    const day = new Date(b.created_at).toISOString().slice(0, 10)
    const entry = trendMap.get(day) ?? { date: day, bookings: 0, revenue: 0 }
    entry.bookings += 1
    if (b.payment_status === 'paid') entry.revenue += b.total_amount ?? 0
    trendMap.set(day, entry)
  }
  const trendData = Array.from(trendMap.values())

  const statusCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1
    return acc
  }, {})
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  const categoryCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    const name = b.rooms?.categories?.name ?? 'Unknown'
    acc[name] = (acc[name] ?? 0) + 1
    return acc
  }, {})
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <DashboardFilters currentRange={range} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard label="Total Bookings" value={totalBookings.toString()} />
        <SummaryCard label="Revenue (Paid)" value={`₦${totalRevenue.toLocaleString()}`} />
        <SummaryCard label="Occupancy" value={`${occupancyRate}%`} />
        <SummaryCard label="Total Rooms" value={rooms.length.toString()} />
      </div>

      <DashboardCharts trendData={trendData} statusData={statusData} categoryData={categoryData} />
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary rounded-2xl p-5">
      <p className="text-muted text-sm">{label}</p>
      <p className="font-heading text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}