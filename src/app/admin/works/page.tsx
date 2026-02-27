import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Works | INK ADDICTION Admin' }

async function getWorks() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('works')
    .select('id, title, is_published, final_genre_slug, auto_genre_slug, created_at, work_images(path, sort_order)')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(50)
  return data ?? []
}

export default async function WorksPage() {
  const works = await getWorks()

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Works</h1>
        <Link href="/admin/works/new" className="admin-btn admin-btn--primary">
          + 新規作品登録
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>タイトル</th>
              <th>確定ジャンル</th>
              <th>AI推定</th>
              <th>公開</th>
              <th>登録日</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {works.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-table__empty">作品がありません</td>
              </tr>
            ) : (
              works.map((w) => (
                <tr key={w.id}>
                  <td>
                    <Link href={`/admin/works/${w.id}`} className="admin-table-link">
                      {w.title}
                    </Link>
                  </td>
                  <td>
                    {w.final_genre_slug ?? (
                      <span className="admin-badge admin-badge--warn">未確定</span>
                    )}
                  </td>
                  <td className="admin-table__muted">{w.auto_genre_slug ?? '—'}</td>
                  <td>
                    <span className={`admin-badge ${w.is_published ? 'admin-badge--pub' : 'admin-badge--draft'}`}>
                      {w.is_published ? '公開中' : '非公開'}
                    </span>
                  </td>
                  <td className="admin-table__muted">
                    {new Date(w.created_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td>
                    <Link href={`/admin/works/${w.id}`} className="admin-table-action">
                      編集
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
