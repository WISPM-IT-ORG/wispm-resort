'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

type CheckoutItem = { id: string; quantity: number }

export async function checkout(items: CheckoutItem[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, results: [] }
  }

  const results = []

  for (const item of items) {
    const { data, error } = await supabase.rpc('book_room', {
      p_room_id: item.id,
      p_quantity: item.quantity,
      p_user_id: user.id,
    })

    if (error) {
      results.push({ id: item.id, success: false, message: error.message, bookingId: null })
    } else {
      const row = data[0]
      results.push({ id: item.id, success: row.success, message: row.message, bookingId: row.booking_id })
    }
  }

  revalidatePath('/', 'layout')
  return { success: results.every((r) => r.success), results }
}