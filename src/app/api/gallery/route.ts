import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const DEFAULT_LIMIT = 24
const MAX_LIMIT = 48

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const genre = searchParams.get('genre') ?? undefined
  const bodyPart = searchParams.get('bodyPart') ?? undefined
  const color = searchParams.get('color') ?? undefined
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10))
  )
  const offset = (page - 1) * limit

  const supabase = await createClient()

  let query = supabase
    .from('works')
    .select(
      `
      id,
      title,
      description,
      final_genre_slug,
      tags,
      price_min,
      price_max,
      published_at,
      created_at,
      work_images (
        id, path, width, height, blurhash, sort_order
      ),
      genres:final_genre_slug (
        slug, name
      )
      `,
      { count: 'exact' }
    )
    .eq('is_published', true)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (genre) {
    query = query.eq('final_genre_slug', genre)
  }

  if (bodyPart) {
    query = query.contains('tags', { bodyPart: [bodyPart] })
  }

  if (color) {
    query = query.contains('tags', { color: [color] })
  }

  const { data, count, error } = await query

  if (error) {
    console.error('[gallery] Supabase error:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery.' }, { status: 500 })
  }

  return NextResponse.json({
    works: data ?? [],
    total: count ?? 0,
    hasNext: offset + limit < (count ?? 0),
  })
}
