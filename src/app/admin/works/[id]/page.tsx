import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'
import { WorkEditForm } from '@/components/admin/WorkEditForm'
import type { Genre } from '@/types/work'

export const metadata: Metadata = { title: '作品編集 | INK ADDICTION Admin' }

interface Props {
  params: Promise<{ id: string }>
}

async function getWork(id: string) {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('works')
    .select('id, title, description, final_genre_slug, tags, is_published, work_images ( id, path, width, height, sort_order )')
    .eq('id', id)
    .eq('is_deleted', false)
    .single()
  return data
}

async function getGenres(): Promise<Genre[]> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('genres')
    .select('slug, name')
    .eq('is_active', true)
    .order('priority')
  return (data as Genre[]) ?? []
}

export default async function WorkEditPage({ params }: Props) {
  const { id } = await params
  const [work, genres] = await Promise.all([getWork(id), getGenres()])
  if (!work) notFound()

  const images = (work.work_images as { id: string; path: string; width: number | null; height: number | null; sort_order: number }[]) ?? []

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">作品編集</h1>
        <Link href="/admin/works" className="admin-btn admin-btn--ghost admin-btn--sm">
          ← 一覧へ戻る
        </Link>
      </div>

      <div className="work-edit__meta">
        <span className={`admin-badge ${work.is_published ? 'admin-badge--pub' : 'admin-badge--draft'}`}>
          {work.is_published ? '公開中' : '非公開'}
        </span>
        {work.final_genre_slug ? (
          <span className="work-edit__genre-label">{work.final_genre_slug}</span>
        ) : (
          <span className="admin-badge admin-badge--warn">ジャンル未確定</span>
        )}
      </div>

      <WorkEditForm
        workId={work.id}
        initialTitle={work.title}
        initialDescription={work.description}
        initialGenreSlug={work.final_genre_slug}
        initialTags={(work.tags as Record<string, string[]>) ?? {}}
        initialImages={images}
        initialIsPublished={work.is_published}
        genres={genres}
      />
    </div>
  )
}
