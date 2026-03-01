import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ink-addiction.jp'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/styles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/availability`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/safety`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/artist`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/inquiry`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // 作品ページ
  const supabase = await createClient()
  const { data: works } = await supabase
    .from('works')
    .select('id, updated_at')
    .eq('is_published', true)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(100)

  const workPages: MetadataRoute.Sitemap = (works ?? []).map((w) => ({
    url: `${baseUrl}/gallery/${w.id}`,
    lastModified: new Date(w.updated_at ?? new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // ジャンルページ
  const { data: genres } = await supabase
    .from('genres')
    .select('slug, updated_at')
    .eq('is_active', true)

  const genrePages: MetadataRoute.Sitemap = (genres ?? []).map((g) => ({
    url: `${baseUrl}/styles/${g.slug}`,
    lastModified: new Date(g.updated_at ?? new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...workPages, ...genrePages]
}
