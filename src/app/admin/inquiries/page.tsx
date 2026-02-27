import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Inquiries | INK ADDICTION Admin' }

const STATUS_LABELS: Record<string, string> = {
  new: '新規',
  reviewing: '確認中',
  waiting_customer: '顧客待ち',
  quoted: '金額提示済み',
  scheduled: '予約確定',
  closed: '終了',
  cancelled: 'キャンセル',
}

const STATUS_TABS = ['all', 'new', 'reviewing', 'scheduled', 'closed']

async function getInquiries(status?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('inquiries')
    .select('id, name, email, style_pref, budget_range, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (status && status !== 'all') query = query.eq('status', status)

  const { data } = await query
  return data ?? []
}

interface InquiriesPageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function InquiriesPage({ searchParams }: InquiriesPageProps) {
  const { status } = await searchParams
  const activeStatus = status ?? 'all'
  const inquiries = await getInquiries(activeStatus)

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Inquiries</h1>
      </div>

      {/* ステータスタブ */}
      <div className="admin-tabs">
        {STATUS_TABS.map((s) => (
          <Link
            key={s}
            href={s === 'all' ? '/admin/inquiries' : `/admin/inquiries?status=${s}`}
            className={`admin-tab ${activeStatus === s ? 'admin-tab--active' : ''}`}
          >
            {s === 'all' ? 'すべて' : STATUS_LABELS[s] ?? s}
          </Link>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>名前</th>
              <th>スタイル</th>
              <th>予算</th>
              <th>ステータス</th>
              <th>受信日</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-table__empty">問い合わせがありません</td>
              </tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq.id}>
                  <td>
                    <Link href={`/admin/inquiries/${inq.id}`} className="admin-table-link">
                      {inq.name}
                    </Link>
                  </td>
                  <td>{inq.style_pref}</td>
                  <td className="admin-table__muted">{inq.budget_range}</td>
                  <td>
                    <span className={`admin-badge admin-badge--status-${inq.status}`}>
                      {STATUS_LABELS[inq.status] ?? inq.status}
                    </span>
                  </td>
                  <td className="admin-table__muted">
                    {new Date(inq.created_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td>
                    <Link href={`/admin/inquiries/${inq.id}`} className="admin-table-action">
                      詳細
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
