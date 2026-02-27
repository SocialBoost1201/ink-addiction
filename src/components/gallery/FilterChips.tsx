'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { Genre } from '@/types/work'

interface FilterChipsProps {
  genres: Genre[]
  selectedGenre?: string
}

export function FilterChips({ genres, selectedGenre }: FilterChipsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null) {
        params.delete(name)
      } else {
        params.set(name, value)
      }
      params.delete('page') // フィルタ変更時はページリセット
      return params.toString()
    },
    [searchParams]
  )

  const handleSelect = (slug: string | null) => {
    const qs = createQueryString('genre', slug)
    router.push(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
  }

  return (
    <div className="filter-chips" role="group" aria-label="ジャンルフィルター">
      <button
        className={`filter-chip ${!selectedGenre ? 'filter-chip--active' : ''}`}
        onClick={() => handleSelect(null)}
        aria-pressed={!selectedGenre}
      >
        すべて
      </button>
      {genres.map((genre) => (
        <button
          key={genre.slug}
          className={`filter-chip ${selectedGenre === genre.slug ? 'filter-chip--active' : ''}`}
          onClick={() => handleSelect(genre.slug)}
          aria-pressed={selectedGenre === genre.slug}
        >
          {genre.name}
        </button>
      ))}
    </div>
  )
}
