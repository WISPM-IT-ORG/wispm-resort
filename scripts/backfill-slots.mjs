import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function parseBedCount(bedSize) {
  const match = bedSize.match(/^(\d+)\s*No\.?s?\b/i)
  return match ? parseInt(match[1], 10) : 1
}

async function backfill() {
  const rooms = JSON.parse(await readFile('./scripts/data/rooms.json', 'utf-8'))

  for (const r of rooms) {
    const slots = parseBedCount(r.bedSize)
    const { error } = await supabase
      .from('rooms')
      .update({ total_slots: slots, available_slots: slots })
      .eq('room_code', r.id)

    if (error) {
      console.error(`Failed on ${r.id}:`, error.message)
    } else {
      console.log(`${r.id}: ${slots} slot(s)`)
    }
  }
}

backfill()