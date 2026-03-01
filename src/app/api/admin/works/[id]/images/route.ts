import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

// POST /api/admin/works/[id]/images – 追加画像の保存
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const supabase = createServiceClient()

  const inserts = (body.images ?? []).map((img: { path: string; width?: number; height?: number; sort_order: number }) => ({
    work_id: id,
    path: img.path,
    width: img.width ?? null,
    height: img.height ?? null,
    sort_order: img.sort_order,
  }))

  if (inserts.length === 0) return NextResponse.json({ ok: true })

  const { error } = await supabase.from('work_images').insert(inserts)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
