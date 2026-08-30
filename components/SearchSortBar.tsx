'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { FiSearch, FiFilter } from 'react-icons/fi'

type Category = { id: string; name: string }

export default function SearchSortBar({ categories }: { categories: Category[] }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [filterOpen, setFilterOpen] = useState(false)
    const filterRef = useRef<HTMLDivElement>(null)

    function updateParams(updates: Record<string, string>) {
        const params = new URLSearchParams(searchParams.toString())
        for (const [key, value] of Object.entries(updates)) {
            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setFilterOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const currentSort = searchParams.get('sort') ?? ''
    const currentCategory = searchParams.get('category') ?? ''
    const currentAvailable = searchParams.get('available') === 'true'

    const hasActiveFilters = currentSort || currentCategory || currentAvailable

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                    type="text"
                    placeholder="Search..."
                    defaultValue={searchParams.get('search') ?? ''}
                    onChange={(e) => updateParams({ search: e.target.value })}
                    className="w-full rounded-full bg-white pl-10 pr-4 py-2 outline-none shadow-sm"
                />
            </div>

            <div className="relative" ref={filterRef}>
                <button
                    onClick={() => setFilterOpen((open) => !open)}
                    className="relative rounded-full bg-white p-3 shadow-sm"
                    aria-label="Filter options"
                >
                    <FiFilter />
                    {hasActiveFilters && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
                    )}
                </button>

                {filterOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10 space-y-4">
                        <div>
                            <p className="text-sm font-bold mb-2">Sort by price</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => updateParams({ sort: currentSort === 'price_asc' ? '' : 'price_asc' })}
                                    className={`px-3 py-1 rounded-full text-sm ${currentSort === 'price_asc' ? 'bg-primary text-white' : 'bg-secondary'}`}
                                >
                                    Low to High
                                </button>
                                <button
                                    onClick={() => updateParams({ sort: currentSort === 'price_desc' ? '' : 'price_desc' })}
                                    className={`px-3 py-1 rounded-full text-sm ${currentSort === 'price_desc' ? 'bg-primary text-white' : 'bg-secondary'}`}
                                >
                                    High to Low
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold mb-2">Category</p>
                            <select
                                value={currentCategory}
                                onChange={(e) => updateParams({ category: e.target.value })}
                                className="w-full rounded-md bg-secondary px-3 py-2 text-sm"
                            >
                                <option value="">All categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={currentAvailable}
                                onChange={(e) => updateParams({ available: e.target.checked ? 'true' : '' })}
                            />
                            Available only
                        </label>

                        {hasActiveFilters && (
                            <button
                                onClick={() => updateParams({ sort: '', category: '', available: '' })}
                                className="text-sm text-primary underline"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}