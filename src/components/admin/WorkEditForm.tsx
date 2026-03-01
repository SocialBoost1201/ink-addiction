'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { uploadWorkImage, getStorageUrl } from '@/lib/supabase/storage'
import type { Genre } from '@/types/work'

const BODY_PARTS = ['腕', '肩', '背中', '胸', '脇腹', '足', '首', 'その他']
const TECHNIQUES = ['手彫り', 'マシン', 'ウォーターカラー', 'ブラックワーク', 'ジオメトリック']
const COLOR_OPTIONS = ['フルカラー', 'ブラック&グレー', 'ブラックのみ']
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

interface ExistingImage {
  id: string
  path: string
  width: number | null
  height: number | null
  sort_order: number
  _removed?: boolean
}

interface NewImage {
  file: File
  previewUrl: string
  path: string | null
  width: number | null
  height: number | null
  uploading: boolean
  error: string | null
}

interface WorkEditFormProps {
  workId: string
  initialTitle: string
  initialDescription: string | null
  initialGenreSlug: string | null
  initialTags: Record<string, string[]>
  initialImages: ExistingImage[]
  initialIsPublished: boolean
  genres: Genre[]
}

export function WorkEditForm({
  workId,
  initialTitle,
  initialDescription,
  initialGenreSlug,
  initialTags,
  initialImages,
  initialIsPublished,
  genres,
}: WorkEditFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription ?? '')
  const [genreSlug, setGenreSlug] = useState(initialGenreSlug ?? '')
  const [isPublished, setIsPublished] = useState(initialIsPublished)
  const [tags, setTags] = useState(initialTags)

  // 既存画像（削除フラグ管理）
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    [...initialImages].sort((a, b) => a.sort_order - b.sort_order)
  )
  // 新規追加画像
  const [newImages, setNewImages] = useState<NewImage[]>([])

  const toggleTag = (cat: 'bodyPart' | 'color' | 'technique', val: string) =>
    setTags((prev) => ({
      ...prev,
      [cat]: (prev[cat] ?? []).includes(val)
        ? (prev[cat] ?? []).filter((v) => v !== val)
        : [...(prev[cat] ?? []), val],
    }))

  const toggleRemoveExisting = (id: string) =>
    setExistingImages((prev) =>
      prev.map((img) => img.id === id ? { ...img, _removed: !img._removed } : img)
    )

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((f) => ALLOWED_TYPES.includes(f.type))
    const placeholders: NewImage[] = files.map((f) => ({
      file: f, previewUrl: URL.createObjectURL(f),
      path: null, width: null, height: null, uploading: true, error: null,
    }))
    setNewImages((prev) => [...prev, ...placeholders])

    await Promise.all(placeholders.map(async (img) => {
      try {
        const result = await uploadWorkImage(img.file)
        setNewImages((prev) => prev.map((i) =>
          i.previewUrl === img.previewUrl
            ? { ...i, path: result.path, width: result.width, height: result.height, uploading: false }
            : i
        ))
      } catch {
        setNewImages((prev) => prev.map((i) =>
          i.previewUrl === img.previewUrl ? { ...i, uploading: false, error: '失敗' } : i
        ))
      }
    }))
    if (e.target) e.target.value = ''
  }

  const removeNew = (url: string) => {
    setNewImages((prev) => {
      const img = prev.find((i) => i.previewUrl === url)
      if (img) URL.revokeObjectURL(img.previewUrl)
      return prev.filter((i) => i.previewUrl !== url)
    })
  }

  const handleSave = async () => {
    setSaving(true); setSaveError(null); setSaved(false)
    try {
      // タイトル・ジャンル・タグ・公開状態を PATCH
      const patchRes = await fetch(`/api/admin/works/${workId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          final_genre_slug: genreSlug || null,
          tags,
          is_published: isPublished,
        }),
      })
      if (!patchRes.ok) throw new Error((await patchRes.json()).error ?? '更新失敗')

      // 新規画像を work_images に追加（sort_order は既存の続き）
      const baseSortOrder = existingImages.filter((i) => !i._removed).length
      if (newImages.some((i) => i.path)) {
        await fetch(`/api/admin/works/${workId}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images: newImages
              .filter((i) => i.path)
              .map((i, idx) => ({ path: i.path, width: i.width, height: i.height, sort_order: baseSortOrder + idx })),
          }),
        })
      }

      setSaved(true)
      router.refresh()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : '保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('この作品を削除しますか？この操作は取り消せません。')) return
    setDeleting(true)
    const res = await fetch(`/api/admin/works/${workId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin/works')
      router.refresh()
    } else {
      alert('削除に失敗しました')
      setDeleting(false)
    }
  }

  const tagDefs = [
    { label: '部位', key: 'bodyPart' as const, options: BODY_PARTS },
    { label: 'カラー', key: 'color' as const, options: COLOR_OPTIONS },
    { label: '技法', key: 'technique' as const, options: TECHNIQUES },
  ]

  const activeExisting = existingImages.filter((i) => !i._removed)

  return (
    <div className="work-form">
      {/* 画像管理 */}
      <section className="admin-section">
        <h2 className="admin-section__title">作品画像</h2>
        <p className="work-form__hint">1枚目がカバー画像です。削除ボタンで非表示、追加で新規アップロードできます。</p>

        {/* 既存画像 */}
        {existingImages.length > 0 && (
          <div className="work-image-preview-grid" style={{ marginBottom: 12 }}>
            {existingImages.map((img, i) => (
              <div key={img.id} className={`work-image-preview ${img._removed ? 'work-image-preview--removed' : ''}`}>
                <div className="work-image-preview__img-wrap">
                  <Image
                    src={getStorageUrl(img.path)}
                    alt={`既存画像 ${i + 1}`}
                    fill
                    style={{ objectFit: 'cover', opacity: img._removed ? 0.3 : 1 }}
                    sizes="120px"
                  />
                  {i === 0 && !img._removed && (
                    <span className="work-image-preview__cover-badge">カバー</span>
                  )}
                </div>
                <button
                  type="button"
                  className="work-image-preview__remove"
                  onClick={() => toggleRemoveExisting(img.id)}
                  aria-label={img._removed ? '削除取消' : `画像 ${i + 1} を削除`}
                  style={{ background: img._removed ? 'rgba(76,175,125,0.7)' : undefined }}
                >
                  {img._removed ? '↩' : '✕'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 新規追加 */}
        <label className="work-upload-area" style={{ cursor: 'pointer' }}>
          <p className="work-upload-area__icon">＋</p>
          <p className="work-upload-area__text">クリックで画像を追加</p>
          <input type="file" multiple accept={ALLOWED_TYPES.join(',')}
            className="visually-hidden" onChange={handleFileChange} />
        </label>

        {newImages.length > 0 && (
          <div className="work-image-preview-grid" style={{ marginTop: 8 }}>
            {newImages.map((img, i) => (
              <div key={img.previewUrl} className="work-image-preview">
                <div className="work-image-preview__img-wrap">
                  <Image src={img.previewUrl} alt={`新規 ${i + 1}`} fill
                    style={{ objectFit: 'cover' }} sizes="120px" unoptimized />
                  {img.uploading && (
                    <div className="work-image-preview__overlay">
                      <span className="work-image-preview__spinner" />
                    </div>
                  )}
                  {img.error && (
                    <div className="work-image-preview__overlay work-image-preview__overlay--error">
                      <span>{img.error}</span>
                    </div>
                  )}
                </div>
                <button type="button" className="work-image-preview__remove"
                  onClick={() => removeNew(img.previewUrl)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 基本情報 */}
      <section className="admin-section">
        <h2 className="admin-section__title">基本情報</h2>
        <div className="work-form__fields">
          <div className="admin-form-group">
            <label htmlFor="edit-title" className="admin-form-label">タイトル *</label>
            <input id="edit-title" type="text" className="admin-form-input" maxLength={100}
              value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label htmlFor="edit-desc" className="admin-form-label">説明（任意）</label>
            <textarea id="edit-desc" className="admin-form-textarea" rows={3}
              value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label htmlFor="edit-genre" className="admin-form-label">ジャンル確定</label>
            <select id="edit-genre" className="admin-form-select" value={genreSlug}
              onChange={(e) => setGenreSlug(e.target.value)}>
              <option value="">未設定</option>
              {genres.map((g) => (
                <option key={g.slug} value={g.slug}>{g.name}</option>
              ))}
            </select>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">公開設定</label>
            <div className="inquiry-radio-group">
              <label className="inquiry-radio">
                <input type="radio" name="published" checked={isPublished}
                  onChange={() => setIsPublished(true)} />
                <span>公開中</span>
              </label>
              <label className="inquiry-radio">
                <input type="radio" name="published" checked={!isPublished}
                  onChange={() => setIsPublished(false)} />
                <span>非公開</span>
              </label>
            </div>
            {isPublished && !genreSlug && (
              <p className="work-form__note" style={{ color: '#e05252' }}>
                ※ 公開にはジャンルの確定が必要です
              </p>
            )}
          </div>
        </div>
      </section>

      {/* タグ */}
      <section className="admin-section">
        <h2 className="admin-section__title">タグ</h2>
        <div className="work-form__tag-groups">
          {tagDefs.map(({ label, key, options }) => (
            <div key={key} className="work-form__tag-group">
              <p className="admin-form-label">{label}</p>
              <div className="tag-chips">
                {options.map((opt) => (
                  <button key={opt} type="button"
                    className={`tag-chip ${(tags[key] ?? []).includes(opt) ? 'tag-chip--active' : ''}`}
                    onClick={() => toggleTag(key, opt)}>{opt}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* アクション */}
      {saveError && <p className="inquiry-error">{saveError}</p>}
      <div className="work-edit__actions">
        <div className="work-edit__actions-left">
          <button className="admin-btn admin-btn--ghost" onClick={() => router.push('/admin/works')}>
            キャンセル
          </button>
        </div>
        <div className="work-edit__actions-right">
          <button
            className="admin-btn admin-btn--ghost work-edit__delete"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? '削除中...' : '削除する'}
          </button>
          <button
            className="admin-btn admin-btn--primary"
            onClick={handleSave}
            disabled={saving || !title || (isPublished && !genreSlug) || newImages.some((i) => i.uploading)}
          >
            {saving ? '保存中...' : '保存する'}
          </button>
          {saved && <span className="admin-saved-msg">✓ 保存しました</span>}
        </div>
      </div>
    </div>
  )
}
