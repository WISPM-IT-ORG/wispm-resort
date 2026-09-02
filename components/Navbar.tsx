import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/auth/actions'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <a href="/" className="font-heading font-bold text-lg">WISPM RESORT</a>

      <div className="flex items-center gap-6 text-sm">
        <a href="/">Home</a>
        <a href="/#rooms">Rooms</a>
        <a href="/cart">Cart</a>

        {user ? (
          <>
            <a href="/bookings">My Bookings</a>
            <form action={logout}>
              <button type="submit" className="text-primary">Log out ({user.email})</button>
            </form>
          </>
        ) : (
          <a href="/login" className="text-primary">Log in</a>
        )}
      </div>
    </nav>
  )
}