'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { WorkCard, WorkCardSkeleton } from './WorkCard'
import type { Work } from '@/types/work'

const LIMIT = 24

function WorkGridInner() {
  const searchParams = useSearchParams()
  const genre = searchParams.get('genre') ?? undefined

  const [works, setWorks] = useState<Work[]>([])
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const fetchWorks = useCallback(
    async (pageNum: number, reset = false) => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(pageNum),
          limit: String(LIMIT),
        })
        if (genre) params.set('genre', genre)

        const res = await fetch(`/api/gallery?${params}`)
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()

        setWorks((prev) => (reset ? data.works : [...prev, ...data.works]))
        setHasNext(data.hasNext)
        setPage(pageNum)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
        setInitialLoading(false)
      }
    },
    [genre]
  )

  // ジャンル変更時にリセット
  useEffect(() => {
    setWorks([])
    setPage(1)
    setHasNext(true)
    setInitialLoading(true)
    fetchWorks(1, true)
  }, [genre, fetchWorks])

  // 無限スクロール用 sentinel 監視
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          fetchWorks(page + 1)
        }
      },
      { rootMargin: '200px' }
    )

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [hasNext, loading, page, fetchWorks])

  if (initialLoading) {
    return (
      <div className="work-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <WorkCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!initialLoading && works.length === 0) {
    return (
      <div className="work-grid-empty">
        <p>該当する作品がありません</p>
      </div>
    )
  }

  return (
    <>
      <div className="work-grid">
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <WorkCardSkeleton key={`sk-${i}`} />
          ))}
      </div>
      {/* 無限スクロール sentinel */}
      <div ref={sentinelRef} style={{ height: '1px' }} />
    </>
  )
}

export function WorkGrid() {
  return (
    <Suspense
      fallback={
        <div className="work-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <WorkCardSkeleton key={i} />
          ))}
        </div>
      }
    >
      <WorkGridInner />
    </Suspense>
  )
}
