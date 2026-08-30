import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'

// Service role client - bypasses RLS entirely, only ever run locally, never shipped to the browser
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function seed() {
    const categories = JSON.parse(
        await readFile('./scripts/data/categories.json', 'utf-8')
    )
    const rooms = JSON.parse(
        await readFile('./scripts/data/rooms.json', 'utf-8')
    )

    console.log('Seeding ${categories.length} categories...')
    const categoryRows = categories.map((c) => ({
        id: c.id,
        name: c.name,
        capacity: c.capacity,
        bed_config: c.bed_config,
        privacy: c.privacy,
        short_description: c.short_description,
        full_description: c.full_description,
    }))

    const { error: catError } = await supabase.from('categories').insert(categoryRows)
    if (catError) {
        console.error('Category seed failed:', catError)
        return
    }
    console.log('Categories done.')

    console.log('Seeding ${rooms.length} rooms...')
    const roomRows = rooms.map((r) => ({
        room_code: r.id,
        sn: r.sn,
        room_type: r.roomType,
        room_no: r.roomNo,
        bed_size: r.bedSize,
        capacity: r.capacity,
        facilities: r.facilities,
        category_id: r.categoryId,
        price_per_night: r.pricePerNight,
        status: r.status,
        image: r.image,
    }))

    const { error: roomError } = await supabase.from('rooms').insert(roomRows)
    if(roomError) {
        console.error('Room seed failed:', roomError)
        return
    }
    console.log('Rooms done.')
}

seed()