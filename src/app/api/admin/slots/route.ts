import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

// GET /api/admin/slots
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()), 10)
  const month = parseInt(searchParams.get('month') ?? String(new Date().getMonth() + 1), 10)

  const start = new Date(year, month - 1, 1).toISOString()
  const end = new Date(year, month, 0, 23, 59, 59).toISOString()

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('availability_slots')
    .select('id, start_at, end_at, status, note, created_at')
    .gte('start_at', start)
    .lte('start_at', end)
    .order('start_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ slots: data ?? [] })
}

// POST /api/admin/slots
export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('availability_slots')
    .insert({
      start_at: body.start_at,
      end_at: body.end_at,
      status: body.status ?? 'published',
      note: body.note ?? null,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id }, { status: 201 })
}
