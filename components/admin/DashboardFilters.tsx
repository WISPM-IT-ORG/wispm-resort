'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const RANGES = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: 'all', label: 'All Time' },
]

export default function DashboardFilters({ currentRange }: { currentRange: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setRange(range: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('range', range)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-2">
      {RANGES.map((r) => (
        <button
          key={r.value}
          onClick={() => setRange(r.value)}
          className={`px-3 py-1.5 rounded-full text-sm ${
            currentRange === r.value ? 'bg-primary text-white' : 'bg-secondary'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}