import { Suspense } from 'react'
import type { Metadata } from 'next'
import { HeroSection } from '@/components/top/HeroSection'
import { FeaturedWorks } from '@/components/top/FeaturedWorks'
import { GenreNav } from '@/components/top/GenreNav'
import { ArtistSection } from '@/components/top/ArtistSection'
import { CtaSection } from '@/components/top/CtaSection'
import { RevealSection } from '@/components/ui/RevealSection'

export const metadata: Metadata = {
  title: 'INK ADDICTION | タトゥースタジオ',
  description:
    '完全予約制のタトゥースタジオ INK ADDICTION。和彫・洋彫・アニメ・ファインラインなど多彩なジャンルに対応。衛生管理徹底。まずは無料相談から。',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <RevealSection delay={0.05}>
        <Suspense fallback={null}>
          <FeaturedWorks />
        </Suspense>
      </RevealSection>

      <RevealSection delay={0.05}>
        <Suspense fallback={null}>
          <GenreNav />
        </Suspense>
      </RevealSection>

      <RevealSection delay={0.05}>
        <ArtistSection />
      </RevealSection>

      <RevealSection delay={0.05}>
        <CtaSection />
      </RevealSection>
    </>
  )
}
