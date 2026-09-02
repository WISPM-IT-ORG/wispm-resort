import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex gap-6 mb-8 border-b border-muted/20 pb-4 text-sm">
        <a href="/admin" className="font-bold">Dashboard</a>
        <a href="/admin/rooms">Rooms</a>
        <a href="/admin/bookings">Bookings</a>
      </nav>
      {children}
    </div>
  )
}