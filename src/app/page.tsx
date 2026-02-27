import { Suspense } from 'react'
import type { Metadata } from 'next'
import { HeroSection } from '@/components/top/HeroSection'
import { FeaturedWorks } from '@/components/top/FeaturedWorks'
import { GenreNav } from '@/components/top/GenreNav'
import { ArtistSection } from '@/components/top/ArtistSection'
import { CtaSection } from '@/components/top/CtaSection'

export const metadata: Metadata = {
  title: 'INK ADDICTION | タトゥースタジオ',
  description:
    '完全予約制のタトゥースタジオ INK ADDICTION。和彫・洋彫・アニメ・ファインラインなど多彩なジャンルに対応。衛生管理徹底。まずは無料相談から。',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={null}>
        <FeaturedWorks />
      </Suspense>
      <Suspense fallback={null}>
        <GenreNav />
      </Suspense>
      <ArtistSection />
      <CtaSection />
    </>
  )
}
