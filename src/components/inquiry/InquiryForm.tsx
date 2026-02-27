'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import type { InquiryRequestBody, InquiryUploadMeta } from '@/types/inquiry'

const GENRE_OPTIONS = [
  '和彫', '洋彫', 'アニメ・ゲーム', 'ブラック&グレー',
  'トラディショナル', 'ファインライン', 'リアリズム', 'レタリング', 'その他',
]
const PLACEMENT_OPTIONS = [
  '腕（内側）', '腕（外側）', '前腕', '上腕部', '肩', '背中（上部）',
  '背中（下部）', '胸', '脇腹', '足（太もも）', '足（ふくらはぎ）',
  '足首・足の甲', '首', 'その他',
]
const SIZE_OPTIONS = ['極小（〜3cm）', '小（3〜8cm）', '中（8〜15cm）', '大（15cm〜）', '相談したい']
const COLOR_OPTIONS = ['フルカラー', 'ブラック&グレー', 'ブラックのみ', '相談したい']
const BUDGET_OPTIONS = ['〜¥30,000', '¥30,000〜¥80,000', '¥80,000〜¥150,000', '¥150,000〜', '相談したい']
const CONTACT_OPTIONS = [
  { value: 'email', label: 'メール' },
  { value: 'phone', label: '電話' },
  { value: 'instagram', label: 'Instagram DM' },
]
const MAX_FILES = 5
const MAX_SIZE_MB = 10
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']

type Step = 'form' | 'confirm' | 'done'

export function InquiryForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('form')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    contact_pref: 'email',
    age_confirmed: false,
    style_pref: '',
    placement: '',
    size: '',
    color_pref: '',
    budget_range: '',
    message: '',
  })

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const valid = files.filter((f) => {
      if (!ALLOWED_TYPES.includes(f.type)) return false
      if (f.size > MAX_SIZE_MB * 1024 * 1024) return false
      return true
    })
    setSelectedFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (i: number) =>
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i))

  const isFormValid =
    form.name && form.email && form.age_confirmed &&
    form.style_pref && form.placement && form.size &&
    form.color_pref && form.budget_range

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    try {
      // ファイルアップロード（将来: Supabase Storage）
      const uploads: InquiryUploadMeta[] = selectedFiles.map((f) => ({
        path: `inquiries/${uuidv4()}/${f.name}`,
        mime: f.type,
        size_bytes: f.size,
      }))

      const body: InquiryRequestBody = {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        contact_pref: form.contact_pref as 'email' | 'phone' | 'instagram',
        age_confirmed: true,
        style_pref: form.style_pref,
        placement: form.placement,
        size: form.size,
        color_pref: form.color_pref,
        budget_range: form.budget_range,
        preferred_windows: [],
        message: form.message || undefined,
        uploads,
      }

      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': uuidv4(),
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'エラーが発生しました')
      }

      setStep('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : '送信に失敗しました。もう一度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="inquiry-done">
        <p className="inquiry-done__icon">✓</p>
        <h2 className="inquiry-done__title">送信が完了しました</h2>
        <p className="inquiry-done__msg">
          <strong>{form.email}</strong> に確認メールをお送りしました。<br />
          24時間以内にご連絡いたします。
        </p>
        <button onClick={() => router.push('/')} className="btn btn--ghost">
          トップへ戻る
        </button>
      </div>
    )
  }

  return (
    <div className="inquiry-form-wrap">
      {step === 'form' && (
        <form
          className="inquiry-form"
          onSubmit={(e) => { e.preventDefault(); if (isFormValid) setStep('confirm') }}
          noValidate
        >
          {/* 基本情報 */}
          <fieldset className="inquiry-fieldset">
            <legend className="inquiry-legend">基本情報</legend>
            <div className="inquiry-field">
              <label htmlFor="name" className="inquiry-label">お名前 <span className="required">*</span></label>
              <input id="name" type="text" className="inquiry-input" required
                value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div className="inquiry-field">
              <label htmlFor="email" className="inquiry-label">メールアドレス <span className="required">*</span></label>
              <input id="email" type="email" className="inquiry-input" required
                value={form.email} onChange={(e) => set('email', e.target.value)} />
            </div>
            <div className="inquiry-field">
              <label htmlFor="phone" className="inquiry-label">電話番号（任意）</label>
              <input id="phone" type="tel" className="inquiry-input"
                value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
            <div className="inquiry-field">
              <label className="inquiry-label">希望連絡方法</label>
              <div className="inquiry-radio-group">
                {CONTACT_OPTIONS.map((opt) => (
                  <label key={opt.value} className="inquiry-radio">
                    <input type="radio" name="contact_pref" value={opt.value}
                      checked={form.contact_pref === opt.value}
                      onChange={() => set('contact_pref', opt.value)} />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          {/* デザイン希望 */}
          <fieldset className="inquiry-fieldset">
            <legend className="inquiry-legend">デザイン希望</legend>
            <div className="inquiry-field">
              <label className="inquiry-label">ジャンル <span className="required">*</span></label>
              <div className="inquiry-chips">
                {GENRE_OPTIONS.map((g) => (
                  <button key={g} type="button"
                    className={`inquiry-chip ${form.style_pref === g ? 'inquiry-chip--active' : ''}`}
                    onClick={() => set('style_pref', g)}>{g}</button>
                ))}
              </div>
            </div>
            <div className="inquiry-field">
              <label className="inquiry-label">部位 <span className="required">*</span></label>
              <select id="placement" className="inquiry-select"
                value={form.placement} onChange={(e) => set('placement', e.target.value)}>
                <option value="">選択してください</option>
                {PLACEMENT_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="inquiry-field-row">
              <div className="inquiry-field">
                <label className="inquiry-label">サイズ <span className="required">*</span></label>
                <select className="inquiry-select" value={form.size}
                  onChange={(e) => set('size', e.target.value)}>
                  <option value="">選択</option>
                  {SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="inquiry-field">
                <label className="inquiry-label">カラー <span className="required">*</span></label>
                <select className="inquiry-select" value={form.color_pref}
                  onChange={(e) => set('color_pref', e.target.value)}>
                  <option value="">選択</option>
                  {COLOR_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="inquiry-field">
              <label className="inquiry-label">予算感 <span className="required">*</span></label>
              <div className="inquiry-chips">
                {BUDGET_OPTIONS.map((b) => (
                  <button key={b} type="button"
                    className={`inquiry-chip ${form.budget_range === b ? 'inquiry-chip--active' : ''}`}
                    onClick={() => set('budget_range', b)}>{b}</button>
                ))}
              </div>
            </div>
          </fieldset>

          {/* メッセージ・添付 */}
          <fieldset className="inquiry-fieldset">
            <legend className="inquiry-legend">メッセージ・参考画像</legend>
            <div className="inquiry-field">
              <label htmlFor="message" className="inquiry-label">ご要望・イメージ（任意）</label>
              <textarea id="message" className="inquiry-textarea" rows={5}
                maxLength={1000} placeholder="参考にしたいデザインのイメージ、こだわりたいポイントなど"
                value={form.message} onChange={(e) => set('message', e.target.value)} />
              <p className="inquiry-char-count">{form.message.length} / 1000</p>
            </div>
            <div className="inquiry-field">
              <label className="inquiry-label">参考画像（{MAX_FILES}枚まで・各{MAX_SIZE_MB}MB以内）</label>
              <div className="inquiry-upload-area"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                tabIndex={0} role="button" aria-label="ファイルを選択">
                <p className="inquiry-upload-area__text">
                  クリックまたはドラッグ＆ドロップ
                </p>
                <p className="inquiry-upload-area__note">JPG / PNG / WEBP / PDF</p>
              </div>
              <input ref={fileInputRef} type="file" multiple accept={ALLOWED_TYPES.join(',')}
                className="visually-hidden" onChange={handleFileChange} />
              {selectedFiles.length > 0 && (
                <ul className="inquiry-file-list">
                  {selectedFiles.map((f, i) => (
                    <li key={i} className="inquiry-file-item">
                      <span>{f.name}</span>
                      <button type="button" className="inquiry-file-remove"
                        onClick={() => removeFile(i)} aria-label={`${f.name}を削除`}>✕</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </fieldset>

          {/* 年齢確認 */}
          <div className="inquiry-age-check">
            <label className="inquiry-checkbox">
              <input type="checkbox" checked={form.age_confirmed}
                onChange={(e) => set('age_confirmed', e.target.checked)} />
              <span>18歳以上であることを確認しました<span className="required"> *</span></span>
            </label>
          </div>

          {error && <p className="inquiry-error">{error}</p>}

          <button type="submit" disabled={!isFormValid}
            className="btn btn--primary btn--lg inquiry-submit">
            内容を確認する
          </button>
        </form>
      )}

      {step === 'confirm' && (
        <div className="inquiry-confirm">
          <h2 className="inquiry-confirm__title">送信内容の確認</h2>
          <dl className="inquiry-confirm__dl">
            {[
              ['名前', form.name],
              ['メール', form.email],
              ['ジャンル', form.style_pref],
              ['部位', form.placement],
              ['サイズ', form.size],
              ['カラー', form.color_pref],
              ['予算', form.budget_range],
              ['メッセージ', form.message || '—'],
              ['添付ファイル', selectedFiles.length > 0 ? `${selectedFiles.length}件` : '—'],
            ].map(([label, value]) => (
              <div key={label} className="inquiry-confirm__row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {error && <p className="inquiry-error">{error}</p>}
          <div className="inquiry-confirm__actions">
            <button className="btn btn--ghost" onClick={() => setStep('form')}>修正する</button>
            <button className="btn btn--primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? '送信中...' : 'この内容で送信する'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
