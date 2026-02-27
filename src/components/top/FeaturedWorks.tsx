import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Work } from '@/types/work'

async function getFeaturedWorks(): Promise<Work[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('works')
    .select(`
      id, title, final_genre_slug, tags, created_at,
      work_images ( id, path, width, height, blurhash, sort_order ),
      genres:final_genre_slug ( slug, name )
    `)
    .eq('is_published', true)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(6)

  return (data as unknown as Work[]) ?? []
}

function getPublicUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/works/${path}`
}

export async function FeaturedWorks() {
  const works = await getFeaturedWorks()

  if (works.length === 0) return null

  return (
    <section className="featured" aria-labelledby="featured-heading">
      <div className="section-header">
        <p className="section-eyebrow">Recent Works</p>
        <h2 id="featured-heading" className="section-title">最新作品</h2>
      </div>
      <div className="featured-grid">
        {works.map((work) => {
          const cover = work.work_images
            ?.slice()
            .sort((a, b) => a.sort_order - b.sort_order)[0]
          const imgUrl = cover ? getPublicUrl(cover.path) : null

          return (
            <Link key={work.id} href={`/gallery/${work.id}`} className="featured-card">
              <div className="featured-card__img-wrap">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={work.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="featured-card__placeholder" />
                )}
              </div>
              {work.genres && (
                <span className="featured-card__genre">{work.genres.name}</span>
              )}
            </Link>
          )
        })}
      </div>
      <div className="section-footer">
        <Link href="/gallery" className="link-more">
          すべての作品を見る &rarr;
        </Link>
      </div>
    </section>
  )
}
