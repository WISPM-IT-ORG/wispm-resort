import { createClient } from '@/utils/supabase/server'
import RoomCard from '@/components/RoomCard'
import SearchSortBar from '@/components/SearchSortBar'

type SearchParams = { 
  search?: string;
  category?: string
  available?: string
  sort?: string 
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { search, category, available, sort } = await searchParams
  const supabase = await createClient()

  const { data: categories } = await supabase
  .from('categories')
  .select('id, name')
  .order('name')

  let query = supabase
    .from('rooms')
    .select(`
      id, 
      room_type, 
      room_no, 
      bed_size, 
      capacity, 
      price_per_night, 
      status, 
      image,
      total_slots, 
      available_slots,
      categories ( id, name, short_description )
    `)

  if (search) {
    query = query.ilike('room_type', `%${search}%`)
  }

  if (category) {
    query = query.eq('category_id', category)
  }

  if (available === 'true') {
    query = query.eq('status', 'available')
  }

  if (sort === 'price_asc') {
    query = query.order('price_per_night', { ascending: true, nullsFirst: false })
  } else if (sort === 'price_desc') {
    query = query.order('price_per_night', { ascending: false, nullsFirst: false })
  }

  const { data: rooms, error } = await query

  if (error) {
    console.log('Supabase error:', JSON.stringify(error, null, 2))
    return <pre>Error: {JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <main className='max-w-7xl mx-auto px-4 py-8'>
      <SearchSortBar categories={categories ?? []} />
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
        {rooms.length === 0 ? (
          <p className='col-span-full text-center text-muted py-12'>
            No rooms match your search.
          </p>
        ) : (
          rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))
        )}
      </div>
    </main>
  )
}