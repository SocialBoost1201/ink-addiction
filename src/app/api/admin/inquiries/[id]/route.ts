import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const supabase = createServiceClient()

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (body.status) updatePayload.status = body.status
  if (body.internal_notes !== undefined) updatePayload.internal_notes = body.internal_notes

  const { error } = await supabase
    .from('inquiries')
    .update(updatePayload)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('admin_audit_logs').insert({
    admin_user_id: body.admin_user_id ?? '00000000-0000-0000-0000-000000000000',
    action: 'inquiry_status_change',
    entity_type: 'inquiries',
    entity_id: id,
    payload: updatePayload,
  })

  return NextResponse.json({ ok: true })
}
