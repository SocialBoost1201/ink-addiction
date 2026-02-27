import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { WorkImageCarousel } from '@/components/gallery/WorkImageCarousel'

interface Props {
  params: Promise<{ id: string }>
}

async function getWork(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('works')
    .select(`
      id, title, description, final_genre_slug, tags, created_at,
      work_images ( id, path, width, height, sort_order ),
      genres:final_genre_slug ( slug, name )
    `)
    .eq('id', id)
    .eq('is_published', true)
    .eq('is_deleted', false)
    .single()
  return data
}

async function getRelatedWorks(genreSlug: string | null, currentId: string) {
  if (!genreSlug) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('works')
    .select('id, title, work_images ( path, sort_order )')
    .eq('final_genre_slug', genreSlug)
    .eq('is_published', true)
    .eq('is_deleted', false)
    .neq('id', currentId)
    .order('created_at', { ascending: false })
    .limit(3)
  return data ?? []
}

function getPublicUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/works/${path}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const work = await getWork(id)
  if (!work) return { title: '作品が見つかりません | INK ADDICTION' }

  const cover = (work.work_images as { path: string; sort_order: number }[])
    ?.sort((a, b) => a.sort_order - b.sort_order)[0]

  return {
    title: `${work.title} | INK ADDICTION`,
    description: work.description
      ?? `INK ADDICTIONの作品「${work.title}」。${(work.genres as unknown as { name: string } | null)?.name ?? ''}タトゥー。`,
    openGraph: cover
      ? {
          images: [{ url: getPublicUrl(cover.path), width: 1200, height: 630 }],
        }
      : undefined,
  }
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params
  const work = await getWork(id)
  if (!work) notFound()

  const images = (work.work_images as { id: string; path: string; width: number | null; height: number | null; sort_order: number }[]) ?? []
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order)
  const genre = work.genres as unknown as { slug: string; name: string } | null
  const tags = (work.tags as Record<string, string[]>) ?? {}
  const relatedWorks = await getRelatedWorks(work.final_genre_slug, work.id)

  const tagEntries: { label: string; key: string }[] = [
    { label: '部位', key: 'bodyPart' },
    { label: 'カラー', key: 'color' },
    { label: '技法', key: 'technique' },
  ]

  return (
    <main className="work-detail-page">
      {/* パンくず */}
      <nav className="work-detail__breadcrumb" aria-label="パンくず">
        <Link href="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-sep">/</span>
        <Link href="/gallery" className="breadcrumb-link">Gallery</Link>
        {genre && (
          <>
            <span className="breadcrumb-sep">/</span>
            <Link href={`/gallery?genre=${genre.slug}`} className="breadcrumb-link">
              {genre.name}
            </Link>
          </>
        )}
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{work.title}</span>
      </nav>

      <div className="work-detail__inner">
        {/* 画像エリア */}
        <div className="work-detail__media">
          {images.length > 0 ? (
            <WorkImageCarousel images={images} title={work.title} />
          ) : (
            <div className="work-detail__no-image" />
          )}
        </div>

        {/* 情報エリア */}
        <aside className="work-detail__info">
          {genre && (
            <Link href={`/gallery?genre=${genre.slug}`} className="work-detail__genre">
              {genre.name}
            </Link>
          )}
          <h1 className="work-detail__title">{work.title}</h1>

          {work.description && (
            <p className="work-detail__desc">{work.description}</p>
          )}

          {/* タグ */}
          <dl className="work-detail__tags">
            {tagEntries.map(({ label, key }) =>
              tags[key] && tags[key].length > 0 ? (
                <div key={key} className="work-detail__tag-row">
                  <dt className="work-detail__tag-label">{label}</dt>
                  <dd className="work-detail__tag-values">
                    {(tags[key] as string[]).map((v: string) => (
                      <span key={v} className="work-detail__tag">{v}</span>
                    ))}
                  </dd>
                </div>
              ) : null
            )}
          </dl>

          <p className="work-detail__date">
            {new Date(work.created_at).toLocaleDateString('ja-JP', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>

          {/* CTA */}
          <div className="work-detail__cta">
            <Link href="/inquiry" className="btn btn--primary">
              似たデザインで相談する
            </Link>
            <Link href="/gallery" className="btn btn--ghost">
              ← ギャラリーへ戻る
            </Link>
          </div>
        </aside>
      </div>

      {/* 関連作品 */}
      {relatedWorks.length > 0 && (
        <section className="work-detail__related">
          <h2 className="section-title">同じジャンルの作品</h2>
          <div className="work-detail__related-grid">
            {relatedWorks.map((rw) => {
              const cover = (rw.work_images as { path: string; sort_order: number }[])
                ?.sort((a, b) => a.sort_order - b.sort_order)[0]
              return (
                <Link key={rw.id} href={`/gallery/${rw.id}`} className="featured-card">
                  <div className="featured-card__img-wrap">
                    {cover ? (
                      <Image
                        src={getPublicUrl(cover.path)}
                        alt={rw.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="featured-card__placeholder" />
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
