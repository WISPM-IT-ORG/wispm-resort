import { createClient } from '@/utils/supabase/server'
import { Fragment } from 'react/jsx-runtime'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: rooms, error } = await supabase
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
      categories (id, name, short_description )
      `)

  if (error) {
    console.log('Supabase error:', JSON.stringify(error, null, 2))
    return <pre>Error: {JSON.stringify(error, null, 2)}</pre>
  }

  console.log(JSON.stringify(rooms[0], null, 2))

  return (
    <div>
      <h1>Rooms ({rooms.length})</h1>
      <ul>
        {rooms.map((room) => (
          <Fragment key={room.id}>
            <li>
              {room.room_type} — {room.status} - {room.categories?.name}
            </li>
            <li>
              {room.room_no} - This is the room number
            </li>
            </Fragment>
        ))}
          </ul>
    </div>
  )
}