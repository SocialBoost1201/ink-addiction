import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { WorkForm } from '@/components/admin/WorkForm'
import type { Genre } from '@/types/work'

export const metadata: Metadata = { title: '作品登録 | INK ADDICTION Admin' }

async function getGenres(): Promise<Genre[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('genres')
    .select('slug, name')
    .eq('is_active', true)
    .order('priority')
  return (data as Genre[]) ?? []
}

export default async function NewWorkPage() {
  const genres = await getGenres()

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">作品登録</h1>
      </div>
      <WorkForm genres={genres} />
    </div>
  )
}
