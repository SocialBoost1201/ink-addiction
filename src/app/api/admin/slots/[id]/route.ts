import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

// PATCH /api/admin/slots/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const supabase = createServiceClient()

  const updatePayload: Record<string, unknown> = {}
  if (body.status !== undefined) updatePayload.status = body.status
  if (body.note !== undefined) updatePayload.note = body.note
  if (body.start_at !== undefined) updatePayload.start_at = body.start_at
  if (body.end_at !== undefined) updatePayload.end_at = body.end_at

  const { error } = await supabase
    .from('availability_slots')
    .update(updatePayload)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE /api/admin/slots/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('availability_slots')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
