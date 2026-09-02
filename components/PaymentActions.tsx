'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { confirmPayment, cancelPayment } from '@/app/payment/actions'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

type BookingRef = { bookingId: string; roomId: string }

export default function PaymentActions({ bookings }: { bookings: BookingRef[] }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { removeFromCart } = useCart()

  async function handlePay() {
    setIsProcessing(true)
    const results = await Promise.all(
      bookings.map((b) => confirmPayment(b.bookingId))
    )

    if (results.every((r) => r.success)) {
      toast.success('Payment successful — booking confirmed!')
      bookings.forEach((b) => removeFromCart(b.roomId))
      router.push('/')
    } else {
      toast.error('Payment confirmation failed for one or more bookings')
    }
    setIsProcessing(false)
  }

  async function handleCancel() {
    setIsProcessing(true)
    await Promise.all(bookings.map((b) => cancelPayment(b.bookingId)))
    bookings.forEach((b) => removeFromCart(b.roomId))
    toast.error('Payment cancelled — room(s) released')
    router.push('/cart')
    setIsProcessing(false)
  }

  return (
    <div className="flex gap-3 mt-6">
      <button onClick={handleCancel} disabled={isProcessing} className="flex-1 bg-white text-primary py-3 rounded-lg border border-primary disabled:opacity-50">
        Cancel
      </button>
      <button onClick={handlePay} disabled={isProcessing} className="flex-1 bg-primary text-white py-3 rounded-lg disabled:opacity-50">
        {isProcessing ? 'Processing...' : 'Pay Now (Demo)'}
      </button>
    </div>
  )
}