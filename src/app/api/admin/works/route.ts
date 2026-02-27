import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

// GET /api/admin/works
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = 20
  const offset = (page - 1) * limit
  const published = searchParams.get('published')

  const supabase = createServiceClient()

  let query = supabase
    .from('works')
    .select(
      `id, title, is_published, is_deleted,
       auto_genre_slug, auto_genre_confidence, final_genre_slug,
       tags, created_at,
       work_images ( id, path, sort_order )`,
      { count: 'exact' }
    )
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (published === 'true') query = query.eq('is_published', true)
  if (published === 'false') query = query.eq('is_published', false)

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ works: data, total: count, hasNext: offset + limit < (count ?? 0) })
}

// POST /api/admin/works
export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('works')
    .insert({
      title: body.title,
      description: body.description ?? null,
      final_genre_slug: body.final_genre_slug ?? null,
      tags: body.tags ?? {},
      is_published: false,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 画像メタデータがあれば保存
  if (body.images && body.images.length > 0) {
    await supabase.from('work_images').insert(
      body.images.map((img: { path: string; width?: number; height?: number }, i: number) => ({
        work_id: data.id,
        path: img.path,
        width: img.width ?? null,
        height: img.height ?? null,
        sort_order: i,
      }))
    )
  }

  // 監査ログ
  await supabase.from('admin_audit_logs').insert({
    admin_user_id: body.admin_user_id ?? '00000000-0000-0000-0000-000000000000',
    action: 'work_create',
    entity_type: 'works',
    entity_id: data.id,
    payload: { title: body.title },
  })

  return NextResponse.json({ id: data.id }, { status: 201 })
}
