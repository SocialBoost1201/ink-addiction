'use client'

import { useState } from 'react'
import Image from 'next/image'

interface WorkImage {
  id: string
  path: string
  width: number | null
  height: number | null
  sort_order: number
}

interface WorkImageCarouselProps {
  images: WorkImage[]
  title: string
}

function getPublicUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/works/${path}`
}

export function WorkImageCarousel({ images, title }: WorkImageCarouselProps) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) return null

  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order)
  const currentImg = sorted[current]

  return (
    <div className="work-carousel">
      {/* メイン画像 */}
      <div className="work-carousel__main">
        <div className="work-carousel__img-wrap">
          <Image
            src={getPublicUrl(currentImg.path)}
            alt={`${title} - ${current + 1}枚目`}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 100vw, 60vw"
            priority={current === 0}
          />
        </div>

        {/* 前後ボタン */}
        {sorted.length > 1 && (
          <>
            <button
              className="work-carousel__btn work-carousel__btn--prev"
              onClick={() => setCurrent((c) => (c - 1 + sorted.length) % sorted.length)}
              aria-label="前の画像"
              disabled={current === 0}
            >
              ←
            </button>
            <button
              className="work-carousel__btn work-carousel__btn--next"
              onClick={() => setCurrent((c) => (c + 1) % sorted.length)}
              aria-label="次の画像"
              disabled={current === sorted.length - 1}
            >
              →
            </button>
            <div className="work-carousel__counter">
              {current + 1} / {sorted.length}
            </div>
          </>
        )}
      </div>

      {/* サムネイル */}
      {sorted.length > 1 && (
        <div className="work-carousel__thumbs">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              className={`work-carousel__thumb ${i === current ? 'work-carousel__thumb--active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`${i + 1}枚目の画像を表示`}
              aria-pressed={i === current}
            >
              <Image
                src={getPublicUrl(img.path)}
                alt={`${title} サムネイル ${i + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
