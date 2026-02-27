import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = 20
  const offset = (page - 1) * limit

  const supabase = createServiceClient()

  let query = supabase
    .from('inquiries')
    .select(
      `id, name, email, style_pref, budget_range, status, created_at,
       preferred_windows, message`,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)

  const { data, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    inquiries: data,
    total: count,
    hasNext: offset + limit < (count ?? 0),
  })
}
