'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { uploadWorkImage, getStorageUrl } from '@/lib/supabase/storage'
import type { Genre } from '@/types/work'

const BODY_PARTS = ['腕', '肩', '背中', '胸', '脇腹', '足', '首', 'その他']
const TECHNIQUES = ['手彫り', 'マシン', 'ウォーターカラー', 'ブラックワーク', 'ジオメトリック']
const COLOR_OPTIONS = ['フルカラー', 'ブラック&グレー', 'ブラックのみ']
const MAX_IMAGES = 10
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

interface UploadedImage {
  file: File
  previewUrl: string
  path: string | null
  width: number | null
  height: number | null
  uploading: boolean
  error: string | null
}

interface WorkFormProps {
  genres: Genre[]
}

export function WorkForm({ genres }: WorkFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genreSlug, setGenreSlug] = useState('')
  const [tags, setTags] = useState<{ bodyPart: string[]; color: string[]; technique: string[] }>({
    bodyPart: [],
    color: [],
    technique: [],
  })
  const [images, setImages] = useState<UploadedImage[]>([])

  const toggleTag = (category: 'bodyPart' | 'color' | 'technique', value: string) => {
    setTags((prev) => {
      const arr = prev[category]
      return {
        ...prev,
        [category]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      }
    })
  }

  const handleFileDrop = useCallback(
    async (files: FileList | null) => {
      if (!files) return
      const valid = Array.from(files)
        .filter((f) => ALLOWED_TYPES.includes(f.type))
        .slice(0, MAX_IMAGES - images.length)

      const newImages: UploadedImage[] = valid.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        path: null,
        width: null,
        height: null,
        uploading: true,
        error: null,
      }))

      setImages((prev) => [...prev, ...newImages])

      // 各ファイルを並行アップロード
      await Promise.all(
        newImages.map(async (img) => {
          try {
            const result = await uploadWorkImage(img.file)
            setImages((prev) =>
              prev.map((i) =>
                i.previewUrl === img.previewUrl
                  ? { ...i, path: result.path, width: result.width, height: result.height, uploading: false }
                  : i
              )
            )
          } catch (e) {
            setImages((prev) =>
              prev.map((i) =>
                i.previewUrl === img.previewUrl
                  ? { ...i, uploading: false, error: 'アップロード失敗' }
                  : i
              )
            )
          }
        })
      )

      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    [images.length]
  )

  const removeImage = (previewUrl: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.previewUrl === previewUrl)
      if (img) URL.revokeObjectURL(img.previewUrl)
      return prev.filter((i) => i.previewUrl !== previewUrl)
    })
  }

  const canSubmit =
    title.trim() !== '' &&
    images.length > 0 &&
    images.every((i) => !i.uploading && !i.error)

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/admin/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          final_genre_slug: genreSlug || null,
          tags,
          images: images
            .filter((i) => i.path)
            .map((i) => ({ path: i.path!, width: i.width, height: i.height })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? '登録に失敗しました')
      }

      router.push('/admin/works')
      router.refresh()
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : '登録に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="work-form">
      {/* 画像アップロード */}
      <section className="admin-section">
        <h2 className="admin-section__title">作品画像 <span className="required">*</span></h2>
        <p className="work-form__hint">1枚目がカバー画像になります。最大{MAX_IMAGES}枚まで。</p>

        <div
          className="work-upload-area"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFileDrop(e.dataTransfer.files) }}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <p className="work-upload-area__icon">＋</p>
          <p className="work-upload-area__text">クリックまたはドラッグ＆ドロップで追加</p>
          <p className="work-upload-area__note">JPG / PNG / WEBP（各20MB以内）</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          className="visually-hidden"
          onChange={(e) => handleFileDrop(e.target.files)}
        />

        {images.length > 0 && (
          <div className="work-image-preview-grid">
            {images.map((img, i) => (
              <div key={img.previewUrl} className="work-image-preview">
                <div className="work-image-preview__img-wrap">
                  <Image
                    src={img.path ? getStorageUrl(img.path) : img.previewUrl}
                    alt={`プレビュー ${i + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized={!img.path}
                  />
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
                {i === 0 && <span className="work-image-preview__cover-badge">カバー</span>}
                <button
                  type="button"
                  className="work-image-preview__remove"
                  onClick={() => removeImage(img.previewUrl)}
                  aria-label={`画像 ${i + 1} を削除`}
                >
                  ✕
                </button>
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
            <label htmlFor="title" className="admin-form-label">
              タイトル <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              className="admin-form-input"
              maxLength={100}
              placeholder="例：和彫・龍（背中全体）"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="description" className="admin-form-label">説明（任意）</label>
            <textarea
              id="description"
              className="admin-form-textarea"
              rows={3}
              placeholder="施術についての説明など"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="genre" className="admin-form-label">ジャンル確定（後から設定可）</label>
            <select
              id="genre"
              className="admin-form-select"
              value={genreSlug}
              onChange={(e) => setGenreSlug(e.target.value)}
            >
              <option value="">未設定</option>
              {genres.map((g) => (
                <option key={g.slug} value={g.slug}>{g.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* タグ */}
      <section className="admin-section">
        <h2 className="admin-section__title">タグ（任意）</h2>
        <div className="work-form__tag-groups">
          <div className="work-form__tag-group">
            <p className="admin-form-label">部位</p>
            <div className="tag-chips">
              {BODY_PARTS.map((b) => (
                <button
                  key={b} type="button"
                  className={`tag-chip ${tags.bodyPart.includes(b) ? 'tag-chip--active' : ''}`}
                  onClick={() => toggleTag('bodyPart', b)}
                >{b}</button>
              ))}
            </div>
          </div>
          <div className="work-form__tag-group">
            <p className="admin-form-label">カラー</p>
            <div className="tag-chips">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c} type="button"
                  className={`tag-chip ${tags.color.includes(c) ? 'tag-chip--active' : ''}`}
                  onClick={() => toggleTag('color', c)}
                >{c}</button>
              ))}
            </div>
          </div>
          <div className="work-form__tag-group">
            <p className="admin-form-label">技法</p>
            <div className="tag-chips">
              {TECHNIQUES.map((t) => (
                <button
                  key={t} type="button"
                  className={`tag-chip ${tags.technique.includes(t) ? 'tag-chip--active' : ''}`}
                  onClick={() => toggleTag('technique', t)}
                >{t}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 送信 */}
      {submitError && <p className="inquiry-error">{submitError}</p>}
      <div className="work-form__actions">
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() => router.push('/admin/works')}
        >
          キャンセル
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
        >
          {submitting ? '登録中...' : '作品を登録（非公開）'}
        </button>
      </div>
      <p className="work-form__note">
        ※ 登録後は非公開状態です。ジャンルを確定してから作品一覧で公開に切り替えてください。
      </p>
    </div>
  )
}
