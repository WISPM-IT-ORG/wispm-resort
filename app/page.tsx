import { createClient } from '@/utils/supabase/server'
import RoomCard from '@/components/RoomCard'
import SearchSortBar from '@/components/SearchSortBar'

type SearchParams = { search?: string; sort?: string }

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { search, sort } = await searchParams
  const supabase = await createClient()

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
      categories ( id, name, short_description )
    `)

    if (search) {
      query = query.ilike('room_type', `%${search}%`)
    }

    if (sort === 'status') {
      query = query.order('status', { ascending: true })
    }

    const { data: rooms, error } = await query
    
  if (error) {
    console.log('Supabase error:', JSON.stringify(error, null, 2))
    return <pre>Error: {JSON.stringify(error, null, 2)}</pre>
  }

  return (
<main className='max-w-7xl mx-auto px-4 py-8'>
  <SearchSortBar />
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
    {rooms.map((room) => (
      <RoomCard key={room.id} room={room} />
    ))}
  </div>
</main>
  )
}