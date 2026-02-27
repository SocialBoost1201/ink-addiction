import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard | INK ADDICTION Admin' }

async function getDashboardStats() {
  const supabase = await createClient()

  const [
    { count: newInquiries },
    { count: pendingInquiries },
    { count: totalWorks },
    { data: recentWorks },
  ] = await Promise.all([
    supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new'),
    supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .in('status', ['new', 'reviewing']),
    supabase
      .from('works')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false),
    supabase
      .from('works')
      .select('id, title, is_published, final_genre_slug, created_at')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return { newInquiries, pendingInquiries, totalWorks, recentWorks }
}

export default async function DashboardPage() {
  const { newInquiries, pendingInquiries, totalWorks, recentWorks } =
    await getDashboardStats()

  const stats = [
    { label: '新規問い合わせ', value: newInquiries ?? 0, href: '/admin/inquiries?status=new', accent: true },
    { label: '対応待ち', value: pendingInquiries ?? 0, href: '/admin/inquiries', accent: false },
    { label: '総作品数', value: totalWorks ?? 0, href: '/admin/works', accent: false },
  ]

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Dashboard</h1>
      </div>

      {/* KPI カード */}
      <div className="admin-stat-grid">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`admin-stat-card ${s.accent ? 'admin-stat-card--accent' : ''}`}>
            <p className="admin-stat-card__label">{s.label}</p>
            <p className="admin-stat-card__value">{s.value}</p>
          </Link>
        ))}
      </div>

      {/* 最近の作品 */}
      <section className="admin-section">
        <div className="admin-section__header">
          <h2 className="admin-section__title">最近の作品</h2>
          <Link href="/admin/works/new" className="admin-btn admin-btn--primary admin-btn--sm">
            + 新規追加
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>タイトル</th>
                <th>ジャンル</th>
                <th>ステータス</th>
                <th>登録日</th>
              </tr>
            </thead>
            <tbody>
              {recentWorks && recentWorks.length > 0 ? (
                recentWorks.map((w) => (
                  <tr key={w.id}>
                    <td>
                      <Link href={`/admin/works/${w.id}`} className="admin-table-link">
                        {w.title}
                      </Link>
                    </td>
                    <td>{w.final_genre_slug ?? <span className="admin-badge admin-badge--warn">未設定</span>}</td>
                    <td>
                      <span className={`admin-badge ${w.is_published ? 'admin-badge--pub' : 'admin-badge--draft'}`}>
                        {w.is_published ? '公開中' : '非公開'}
                      </span>
                    </td>
                    <td>{new Date(w.created_at).toLocaleDateString('ja-JP')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="admin-table__empty">作品がありません</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
