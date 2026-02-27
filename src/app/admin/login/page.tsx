'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setError('送信に失敗しました。メールアドレスを確認してください。')
    } else {
      setSent(true)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__box">
        <p className="admin-login__logo">INK ADDICTION</p>
        <h1 className="admin-login__title">Admin Console</h1>

        {sent ? (
          <div className="admin-login__sent">
            <p className="admin-login__sent-icon">✉</p>
            <p className="admin-login__sent-msg">
              <strong>{email}</strong> にログインリンクを送信しました。
            </p>
            <p className="admin-login__sent-note">
              メールを確認してリンクをクリックしてください。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="admin-login__form" noValidate>
            <label htmlFor="email" className="admin-form-label">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="admin-form-input"
              autoComplete="email"
            />
            {error && <p className="admin-login__error">{error}</p>}
            <button
              type="submit"
              disabled={loading || !email}
              className="admin-btn admin-btn--primary admin-btn--full"
            >
              {loading ? '送信中...' : 'ログインリンクを送信'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
