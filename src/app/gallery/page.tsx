import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { FilterChips } from '@/components/gallery/FilterChips'
import { WorkGrid } from '@/components/gallery/WorkGrid'
import type { Genre } from '@/types/work'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery | INK ADDICTION',
  description:
    'INK ADDICTIONの作品ギャラリー。和彫・洋彫・アニメ・ファインラインなど多彩なジャンルの施術作品をご覧いただけます。',
}

async function getGenres(): Promise<Genre[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('genres')
    .select('*')
    .eq('is_active', true)
    .order('priority')
  return (data as Genre[]) ?? []
}

interface GalleryPageProps {
  searchParams: Promise<{ genre?: string }>
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const { genre } = await searchParams
  const genres = await getGenres()

  return (
    <main className="gallery-page">
      {/* ページヘッダー */}
      <section className="gallery-header">
        <h1 className="gallery-header__title">Gallery</h1>
        <p className="gallery-header__sub">
          {genre
            ? (genres.find((g) => g.slug === genre)?.name ?? genre)
            : 'All Works'}
        </p>
      </section>

      {/* フィルター（スティッキー） */}
      <div className="filter-bar">
        <Suspense fallback={null}>
          <FilterChips genres={genres} selectedGenre={genre} />
        </Suspense>
      </div>

      {/* 作品グリッド（無限スクロール） */}
      <section className="gallery-content">
        <WorkGrid />
      </section>
    </main>
  )
}
