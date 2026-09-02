'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Demo payment function - will replace with real payment gateway

export async function confirmPayment(bookingId: string) {
  const supabase = await createClient()

  const fakeReference = `DEMO-${Date.now()}`

  const { data, error } = await supabase.rpc('confirm_booking_payment', {
    p_booking_id: bookingId,
    p_reference: fakeReference,
  })

  revalidatePath('/', 'layout')
  return { success: !error && data === true }
}

export async function cancelPayment(bookingId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('release_booking', {
    p_booking_id: bookingId,
  })

  revalidatePath('/', 'layout')
  return { success: !error && data === true }
}