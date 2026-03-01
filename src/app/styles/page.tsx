import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'スタイル一覧 | INK ADDICTION',
  description: 'INK ADDICTIONが対応するタトゥースタイル（ジャンル）一覧。和彫・洋彫・アニメ・ファインラインなど。',
}

async function getGenres() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('genres')
    .select('slug, name, description, cover_image_path')
    .eq('is_active', true)
    .order('priority')
  return data ?? []
}

export default async function StylesPage() {
  const genres = await getGenres()

  return (
    <main className="styles-page">
      <section className="styles-page__header">
        <p className="section-eyebrow">Styles</p>
        <h1 className="styles-page__title">スタイル一覧</h1>
        <p className="styles-page__lead">
          和彫から洋彫・アニメ・ファインラインまで、<br />
          幅広いジャンルに対応しています。
        </p>
      </section>

      <div className="styles-grid">
        {genres.length === 0 ? (
          <p className="styles-empty">現在ジャンル情報を準備中です。</p>
        ) : (
          genres.map((g) => (
            <Link key={g.slug} href={`/styles/${g.slug}`} className="styles-card">
              <div className="styles-card__img-wrap">
                {g.cover_image_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/genres/${g.cover_image_path}`}
                    alt={g.name}
                    className="styles-card__img"
                  />
                ) : (
                  <div className="styles-card__placeholder">
                    <span>{g.name[0]}</span>
                  </div>
                )}
              </div>
              <div className="styles-card__body">
                <h2 className="styles-card__name">{g.name}</h2>
                {g.description && (
                  <p className="styles-card__desc">{g.description.slice(0, 60)}…</p>
                )}
                <span className="styles-card__link">作品を見る →</span>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="styles-page__cta">
        <p>ご興味のあるスタイルでご相談ください</p>
        <Link href="/inquiry" className="btn btn--primary btn--lg">無料相談する</Link>
      </div>
    </main>
  )
}
