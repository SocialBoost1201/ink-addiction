import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InquiryDetailForm } from '@/components/admin/InquiryDetailForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '問い合わせ詳細 | INK ADDICTION Admin' }

async function getInquiry(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('inquiries')
    .select(`*, inquiry_uploads(id, path, mime, size_bytes)`)
    .eq('id', id)
    .single()
  return data
}

interface InquiryDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function InquiryDetailPage({ params }: InquiryDetailPageProps) {
  const { id } = await params
  const inquiry = await getInquiry(id)

  if (!inquiry) notFound()

  const fields = [
    { label: '名前', value: inquiry.name },
    { label: 'メール', value: inquiry.email },
    { label: '電話', value: inquiry.phone ?? '—' },
    { label: '連絡方法', value: inquiry.contact_pref },
    { label: 'スタイル', value: inquiry.style_pref },
    { label: '部位', value: inquiry.placement },
    { label: 'サイズ', value: inquiry.size },
    { label: 'カラー', value: inquiry.color_pref },
    { label: '予算', value: inquiry.budget_range },
    { label: '受信日', value: new Date(inquiry.created_at).toLocaleString('ja-JP') },
  ]

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">問い合わせ詳細</h1>
      </div>

      <div className="admin-detail-grid">
        {/* 問い合わせ情報 */}
        <section className="admin-section">
          <h2 className="admin-section__title">基本情報</h2>
          <dl className="admin-dl">
            {fields.map((f) => (
              <div key={f.label} className="admin-dl__row">
                <dt className="admin-dl__label">{f.label}</dt>
                <dd className="admin-dl__value">{f.value}</dd>
              </div>
            ))}
          </dl>
          {inquiry.message && (
            <div className="admin-message-box">
              <p className="admin-form-label">メッセージ</p>
              <p className="admin-message-box__text">{inquiry.message}</p>
            </div>
          )}
          {inquiry.inquiry_uploads && inquiry.inquiry_uploads.length > 0 && (
            <div className="admin-uploads">
              <p className="admin-form-label">添付ファイル ({inquiry.inquiry_uploads.length}件)</p>
              <ul className="admin-uploads__list">
                {inquiry.inquiry_uploads.map((u: { id: string; path: string; mime: string }) => (
                  <li key={u.id} className="admin-uploads__item">
                    <span>{u.path.split('/').pop()}</span>
                    <span className="admin-table__muted">{u.mime}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ステータス・メモ */}
        <section className="admin-section">
          <h2 className="admin-section__title">対応管理</h2>
          <InquiryDetailForm
            id={inquiry.id}
            initialStatus={inquiry.status}
            initialNotes={inquiry.internal_notes ?? ''}
          />
        </section>
      </div>
    </div>
  )
}
