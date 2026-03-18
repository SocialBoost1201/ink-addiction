import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Genre } from '@/types/work'

async function getGenres(): Promise<Genre[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('genres')
      .select('slug, name, description')
      .eq('is_active', true)
      .order('priority')
      .limit(6)

    if (error) {
      console.error('GenreNav fetch error:', error)
      return []
    }

    return (data as Genre[]) ?? []
  } catch (err: any) {
    if (err?.digest?.includes('DYNAMIC_SERVER_USAGE') || err?.message?.includes('Dynamic server usage')) {
      throw err;
    }
    console.error('GenreNav fetch failed:', err)
    return []
  }
}

export async function GenreNav() {
  const genres = await getGenres()

  if (genres.length === 0) return null

  return (
    <section className="genre-nav" aria-labelledby="genre-heading">
      <div className="section-header">
        <p className="section-eyebrow">Styles</p>
        <h2 id="genre-heading" className="section-title">得意なジャンル</h2>
      </div>
      <div className="genre-grid">
        {genres.map((genre) => (
          <Link
            key={genre.slug}
            href={`/gallery?genre=${genre.slug}`}
            className="genre-card"
          >
            <span className="genre-card__name">{genre.name}</span>
            {genre.description && (
              <span className="genre-card__desc">{genre.description}</span>
            )}
            <span className="genre-card__arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
