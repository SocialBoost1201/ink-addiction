import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

// PATCH /api/admin/works/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const supabase = createServiceClient()

  // 公開切替時は finalGenre 必須チェック
  if (body.is_published === true) {
    const { data: work } = await supabase
      .from('works')
      .select('final_genre_slug')
      .eq('id', id)
      .single()

    if (!work?.final_genre_slug && !body.final_genre_slug) {
      return NextResponse.json(
        { error: '公開にはジャンルの確定が必要です。' },
        { status: 400 }
      )
    }
  }

  const updatePayload: Record<string, unknown> = {}
  if (body.final_genre_slug !== undefined) updatePayload.final_genre_slug = body.final_genre_slug
  if (body.is_published !== undefined) {
    updatePayload.is_published = body.is_published
    updatePayload.published_at = body.is_published ? new Date().toISOString() : null
  }
  if (body.tags !== undefined) updatePayload.tags = body.tags
  if (body.title !== undefined) updatePayload.title = body.title
  if (body.description !== undefined) updatePayload.description = body.description
  updatePayload.updated_at = new Date().toISOString()

  const { error } = await supabase.from('works').update(updatePayload).eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 監査ログ
  const action = body.is_published === true
    ? 'work_publish'
    : body.is_published === false
    ? 'work_unpublish'
    : 'work_genre_override'

  await supabase.from('admin_audit_logs').insert({
    admin_user_id: body.admin_user_id ?? '00000000-0000-0000-0000-000000000000',
    action,
    entity_type: 'works',
    entity_id: id,
    payload: updatePayload,
  })

  return NextResponse.json({ ok: true })
}

// DELETE /api/admin/works/[id] （ソフト削除）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('works')
    .update({ is_deleted: true, deleted_at: new Date().toISOString(), is_published: false })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('admin_audit_logs').insert({
    admin_user_id: '00000000-0000-0000-0000-000000000000',
    action: 'work_delete',
    entity_type: 'works',
    entity_id: id,
    payload: { soft_deleted: true },
  })

  return NextResponse.json({ ok: true })
}
