import { createClient } from '@/utils/supabase/server'
import CartContent from '@/components/CartContent'

export default async function CartPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <CartContent isLoggedIn={!!user} />
}