'use client'

import { useRouter, usePathname, useSearchParams } from "next/navigation"

export default function SearchSortBar() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    function updateParams(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <input
                type="text"
                placeholder="Search..."
                defaultValue={searchParams.get('search') ?? ''}
                onChange={(e) => updateParams('search', e.currentTarget.value)}
                className="flex-1 rounded-full bg-secondary px-4 py-2 outline-none"
            />
            <select
                defaultValue={searchParams.get('sort') ?? ''}
                onChange={(e) => updateParams('sort', e.target.value)}
                className="rounded-full bg-secondary px-4 py-2"
            >
                <option value="">Sort By</option>
                <option value="status">Status</option>
            </select>
        </div>
    )
}