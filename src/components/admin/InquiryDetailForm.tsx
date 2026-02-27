'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUS_OPTIONS = [
  { value: 'new', label: '新規' },
  { value: 'reviewing', label: '確認中' },
  { value: 'waiting_customer', label: '顧客待ち' },
  { value: 'quoted', label: '金額提示済み' },
  { value: 'scheduled', label: '予約確定' },
  { value: 'closed', label: '終了' },
  { value: 'cancelled', label: 'キャンセル' },
]

interface InquiryDetailFormProps {
  id: string
  initialStatus: string
  initialNotes: string
}

export function InquiryDetailForm({ id, initialStatus, initialNotes }: InquiryDetailFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [notes, setNotes] = useState(initialNotes)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, internal_notes: notes }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      router.refresh()
    }
  }

  return (
    <div className="admin-detail-form">
      <div className="admin-form-group">
        <label className="admin-form-label">ステータス</label>
        <select
          className="admin-form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="admin-form-group">
        <label className="admin-form-label">内部メモ（顧客には非公開）</label>
        <textarea
          className="admin-form-textarea"
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="対応メモ、見積もり概要など..."
        />
      </div>
      <div className="admin-form-actions">
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn--primary"
        >
          {saving ? '保存中...' : '保存する'}
        </button>
        {saved && <span className="admin-saved-msg">✓ 保存しました</span>}
      </div>
    </div>
  )
}
