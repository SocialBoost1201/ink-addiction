'use client'

import { useState, useEffect, useCallback } from 'react'

interface Slot {
  id: string
  start_at: string
  end_at: string
  status: 'published' | 'draft' | 'cancelled'
  note: string | null
  created_at: string
}

const STATUS_LABELS: Record<string, { label: string; badge: string }> = {
  published: { label: '公開中', badge: 'admin-badge--pub' },
  draft: { label: '下書き', badge: 'admin-badge--draft' },
  cancelled: { label: 'キャンセル', badge: 'admin-badge--warn' },
}

/** YYYY-MM-DDTHH:mm 形式を返す（datetime-local 用） */
function toLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** now + offset時間の datetime-local 文字列 */
function nowPlus(hours: number): string {
  const d = new Date(Date.now() + hours * 3600_000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`
}

export function SlotsManager() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)

  // 追加フォーム
  const [showForm, setShowForm] = useState(false)
  const [startAt, setStartAt] = useState(nowPlus(24))
  const [endAt, setEndAt] = useState(nowPlus(27))
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<'published' | 'draft'>('published')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchSlots = useCallback(async (y: number, m: number) => {
    setLoading(true)
    const res = await fetch(`/api/admin/slots?year=${y}&month=${m}`)
    const data = await res.json()
    setSlots(data.slots ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchSlots(year, month) }, [fetchSlots, year, month])

  const navigate = (delta: number) => {
    const next = new Date(year, month - 1 + delta, 1)
    const ny = next.getFullYear()
    const nm = next.getMonth() + 1
    setYear(ny)
    setMonth(nm)
  }

  const handleCreate = async () => {
    setSaving(true)
    setFormError(null)
    if (new Date(endAt) <= new Date(startAt)) {
      setFormError('終了時刻は開始時刻より後にしてください')
      setSaving(false)
      return
    }
    const res = await fetch('/api/admin/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start_at: new Date(startAt).toISOString(),
        end_at: new Date(endAt).toISOString(),
        note: note || null,
        status,
      }),
    })
    setSaving(false)
    if (res.ok) {
      setShowForm(false)
      setNote('')
      fetchSlots(year, month)
    } else {
      const data = await res.json()
      setFormError(data.error ?? '作成に失敗しました')
    }
  }

  const handleStatusToggle = async (slot: Slot) => {
    const next = slot.status === 'published' ? 'draft' : 'published'
    await fetch(`/api/admin/slots/${slot.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    fetchSlots(year, month)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('このスロットを削除しますか？')) return
    await fetch(`/api/admin/slots/${id}`, { method: 'DELETE' })
    fetchSlots(year, month)
  }

  const MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']

  return (
    <div className="slots-manager">
      {/* 月ナビ・ヘッダー */}
      <div className="slots-manager__nav">
        <button className="slot-nav-btn" onClick={() => navigate(-1)}>←</button>
        <h2 className="slots-manager__month">{year}年 {MONTH_NAMES[month - 1]}</h2>
        <button className="slot-nav-btn" onClick={() => navigate(1)}>→</button>
        <button
          className="admin-btn admin-btn--primary admin-btn--sm slots-manager__add-btn"
          onClick={() => { setShowForm((v) => !v); setFormError(null) }}
        >
          {showForm ? '閉じる' : '+ スロット追加'}
        </button>
      </div>

      {/* 追加フォーム */}
      {showForm && (
        <div className="slots-form">
          <div className="slots-form__row">
            <div className="admin-form-group">
              <label className="admin-form-label">開始日時 *</label>
              <input type="datetime-local" className="admin-form-input"
                value={startAt} onChange={(e) => setStartAt(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">終了日時 *</label>
              <input type="datetime-local" className="admin-form-input"
                value={endAt} onChange={(e) => setEndAt(e.target.value)} />
            </div>
          </div>
          <div className="slots-form__row">
            <div className="admin-form-group">
              <label className="admin-form-label">メモ（任意）</label>
              <input type="text" className="admin-form-input" maxLength={80}
                placeholder="例：午後のみ / フルデイ可" value={note}
                onChange={(e) => setNote(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">公開設定</label>
              <select className="admin-form-select" value={status}
                onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}>
                <option value="published">公開中</option>
                <option value="draft">下書き</option>
              </select>
            </div>
          </div>
          {formError && <p className="inquiry-error">{formError}</p>}
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={handleCreate} disabled={saving}>
              {saving ? '作成中...' : '作成する'}
            </button>
            <button className="admin-btn admin-btn--ghost" onClick={() => setShowForm(false)}>
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* スロット一覧 */}
      {loading ? (
        <p className="admin-table__empty">読み込み中...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>日付</th>
                <th>時間帯</th>
                <th>メモ</th>
                <th>ステータス</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {slots.length === 0 ? (
                <tr><td colSpan={5} className="admin-table__empty">この月のスロットがありません</td></tr>
              ) : (
                slots.map((slot) => {
                  const start = new Date(slot.start_at)
                  const end = new Date(slot.end_at)
                  const pad = (n: number) => String(n).padStart(2, '0')
                  const dateStr = `${start.getFullYear()}/${pad(start.getMonth() + 1)}/${pad(start.getDate())}（${'日月火水木金土'[start.getDay()]}）`
                  const timeStr = `${pad(start.getHours())}:${pad(start.getMinutes())} 〜 ${pad(end.getHours())}:${pad(end.getMinutes())}`
                  const { label, badge } = STATUS_LABELS[slot.status] ?? STATUS_LABELS.draft

                  return (
                    <tr key={slot.id}>
                      <td className="slots-table__date">{dateStr}</td>
                      <td className="slots-table__time">{timeStr}</td>
                      <td className="admin-table__muted">{slot.note ?? '—'}</td>
                      <td>
                        <span className={`admin-badge ${badge}`}>{label}</span>
                      </td>
                      <td>
                        <div className="slots-table__actions">
                          <button
                            className="admin-table-action"
                            onClick={() => handleStatusToggle(slot)}
                          >
                            {slot.status === 'published' ? '非公開に' : '公開に'}
                          </button>
                          <button
                            className="admin-table-action slots-table__delete"
                            onClick={() => handleDelete(slot.id)}
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
