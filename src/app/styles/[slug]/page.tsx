import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ slug: string }>
}

async function getGenre(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('genres')
    .select('slug, name, description, cover_image_path')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

async function getGenreWorks(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('works')
    .select('id, title, work_images ( path, sort_order )')
    .eq('final_genre_slug', slug)
    .eq('is_published', true)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(12)
  return data ?? []
}

function getPublicUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/works/${path}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const genre = await getGenre(slug)
  if (!genre) return { title: 'ジャンルが見つかりません | INK ADDICTION' }
  return {
    title: `${genre.name}タトゥー | INK ADDICTION`,
    description:
      genre.description?.slice(0, 120) ??
      `INK ADDICTIONの${genre.name}タトゥー作品一覧。まずは無料相談から。`,
  }
}

export default async function StyleDetailPage({ params }: Props) {
  const { slug } = await params
  const [genre, works] = await Promise.all([getGenre(slug), getGenreWorks(slug)])
  if (!genre) notFound()

  // JSON-LD: LocalBusiness（ジャンル詳細ページではジャンル情報を追加）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${genre.name}タトゥー`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'INK ADDICTION',
    },
    description: genre.description ?? '',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="style-detail-page">
        {/* パンくず */}
        <nav className="work-detail__breadcrumb" aria-label="パンくず">
          <Link href="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href="/styles" className="breadcrumb-link">Styles</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{genre.name}</span>
        </nav>

        <header className="style-detail-header">
          <p className="section-eyebrow">{slug}</p>
          <h1 className="style-detail-header__title">{genre.name}</h1>
          {genre.description && (
            <p className="style-detail-header__desc">{genre.description}</p>
          )}
        </header>

        {/* 作品グリッド */}
        <section className="style-detail-works">
          <h2 className="section-title">{genre.name}の作品</h2>
          {works.length === 0 ? (
            <p className="style-detail-works__empty">作品を準備中です。</p>
          ) : (
            <div className="featured-grid style-detail-works__grid">
              {works.map((work) => {
                const imgs = work.work_images as { path: string; sort_order: number }[]
                const cover = imgs?.sort((a, b) => a.sort_order - b.sort_order)[0]
                return (
                  <Link key={work.id} href={`/gallery/${work.id}`} className="featured-card">
                    <div className="featured-card__img-wrap">
                      {cover ? (
                        <Image
                          src={getPublicUrl(cover.path)}
                          alt={work.title}
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
          )}
          <div className="style-detail-works__more">
            <Link href={`/gallery?genre=${slug}`} className="btn btn--ghost">
              {genre.name}の作品をすべて見る
            </Link>
          </div>
        </section>

        {/* FAQ（ジャンル別の共通Q&A） */}
        <section className="style-detail-faq">
          <h2 className="section-title">{genre.name}のよくある質問</h2>
          <dl className="faq-list">
            {[
              {
                q: `${genre.name}の施術時間はどれくらいですか？`,
                a: 'サイズ・デザインの複雑さにより異なります。詳しくはお問い合わせください。',
              },
              {
                q: `${genre.name}の料金目安を教えてください。`,
                a: 'デザインのサイズ・複雑さにより変動します。まずは参考画像をお送りいただきお見積もりします。',
              },
              {
                q: 'デザインの持ち込みはできますか？',
                a: '可能です。参考画像をお送りいただいた上でカスタムデザインを制作します。',
              },
            ].map((item, i) => (
              <div key={i} className="faq-item">
                <dt className="faq-item__q">
                  <span className="faq-item__q-mark">Q</span>{item.q}
                </dt>
                <dd className="faq-item__a">
                  <span className="faq-item__a-mark">A</span>{item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="static-page__cta">
          <p>{genre.name}について、まずはご相談ください</p>
          <Link href="/inquiry" className="btn btn--primary btn--lg">無料相談する</Link>
        </div>
      </main>
    </>
  )
}
