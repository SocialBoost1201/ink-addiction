import Image from 'next/image'
import Link from 'next/link'
import type { Work } from '@/types/work'

interface WorkCardProps {
  work: Work
}

function getPublicUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/works/${path}`
}

export function WorkCard({ work }: WorkCardProps) {
  const coverImage = work.work_images
    ?.slice()
    .sort((a, b) => a.sort_order - b.sort_order)[0]

  const imageUrl = coverImage
    ? getPublicUrl(coverImage.path)
    : null

  return (
    <Link
      href={`/gallery/${work.id}`}
      className="work-card"
      aria-label={work.title}
    >
      <div className="work-card__image-wrap">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={work.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="work-card__image"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="work-card__placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="work-card__meta">
        {work.genres && (
          <span className="work-card__genre">{work.genres.name}</span>
        )}
        <p className="work-card__title">{work.title}</p>
      </div>
    </Link>
  )
}

export function WorkCardSkeleton() {
  return (
    <div className="work-card work-card--skeleton" aria-hidden="true">
      <div className="work-card__image-wrap" />
      <div className="work-card__meta">
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-line" />
      </div>
    </div>
  )
}
