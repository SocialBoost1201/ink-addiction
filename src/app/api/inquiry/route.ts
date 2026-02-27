import { type NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { inquirySchema } from '@/lib/validations/inquiry'
import { createServiceClient } from '@/lib/supabase/service'
import { checkRateLimit, purgeExpiredEntries } from '@/lib/rate-limit'

/** Idempotency キーによる重複送信防止 */
const processedKeys = new Set<string>()

/** レート制限設定: 1IP あたり 5回 / 10分 */
const RATE_LIMIT_CONFIG = { limit: 5, windowMs: 10 * 60 * 1000 }

export async function POST(request: NextRequest) {
  // -------------------------------------------------------
  // 1. IP取得とレート制限
  // -------------------------------------------------------
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  purgeExpiredEntries()

  const rateResult = checkRateLimit(`inquiry:${ip}`, RATE_LIMIT_CONFIG)
  if (!rateResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(
            Math.ceil((rateResult.resetAt - Date.now()) / 1000)
          ),
        },
      }
    )
  }

  // -------------------------------------------------------
  // 2. Idempotency チェック
  // -------------------------------------------------------
  const headersList = await headers()
  const idempotencyKey = headersList.get('idempotency-key')
  if (idempotencyKey) {
    if (processedKeys.has(idempotencyKey)) {
      return NextResponse.json(
        { message: 'Already processed.' },
        { status: 200 }
      )
    }
  }

  // -------------------------------------------------------
  // 3. リクエストボディ解析
  // -------------------------------------------------------
  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 }
    )
  }

  // -------------------------------------------------------
  // 4. バリデーション
  // -------------------------------------------------------
  const parsed = inquirySchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed.',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  const data = parsed.data

  // -------------------------------------------------------
  // 5. DB保存（Inquiry + InquiryUploads）
  // -------------------------------------------------------
  const supabase = createServiceClient()

  const { data: inquiry, error: inquiryError } = await supabase
    .from('inquiries')
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      contact_pref: data.contact_pref,
      age_confirmed: data.age_confirmed,
      style_pref: data.style_pref,
      placement: data.placement,
      size: data.size,
      color_pref: data.color_pref,
      budget_range: data.budget_range,
      preferred_windows: data.preferred_windows,
      message: data.message ?? null,
      status: 'new',
    })
    .select('id')
    .single()

  if (inquiryError || !inquiry) {
    console.error('[inquiry] DB insert error:', inquiryError)
    return NextResponse.json(
      { error: 'Failed to save inquiry. Please try again.' },
      { status: 500 }
    )
  }

  // 添付ファイルメタデータを保存
  if (data.uploads && data.uploads.length > 0) {
    const uploadRows = data.uploads.map((u) => ({
      inquiry_id: inquiry.id,
      path: u.path,
      mime: u.mime,
      size_bytes: u.size_bytes,
    }))

    const { error: uploadError } = await supabase
      .from('inquiry_uploads')
      .insert(uploadRows)

    if (uploadError) {
      // 添付保存失敗はログのみ。問い合わせ自体は保存済みなので継続。
      console.error('[inquiry] Upload meta insert error:', uploadError)
    }
  }

  // -------------------------------------------------------
  // 6. メール送信キュー（email_outbox）
  // -------------------------------------------------------
  const emailRows = [
    // ユーザー自動返信
    {
      kind: 'inquiry_auto_reply' as const,
      to_email: data.email,
      subject: '【INK ADDICTION】お問い合わせを受け付けました',
      body: buildAutoReplyBody(data.name),
      related_entity_type: 'inquiries',
      related_entity_id: inquiry.id,
    },
    // 管理者通知
    {
      kind: 'admin_notification' as const,
      to_email: process.env.ADMIN_EMAIL ?? '',
      subject: `【新規問い合わせ】${data.name} / ${data.style_pref}`,
      body: buildAdminNotifyBody(inquiry.id, data),
      related_entity_type: 'inquiries',
      related_entity_id: inquiry.id,
    },
  ]

  const { error: emailError } = await supabase
    .from('email_outbox')
    .insert(emailRows)

  if (emailError) {
    // メールキュー失敗はログのみ。問い合わせは保存済み。
    console.error('[inquiry] email_outbox insert error:', emailError)
  }

  // -------------------------------------------------------
  // 7. Idempotency キーを記録
  // -------------------------------------------------------
  if (idempotencyKey) {
    processedKeys.add(idempotencyKey)
    // メモリ節約のため古いキーを一定時間後に解放（簡易実装）
    setTimeout(() => processedKeys.delete(idempotencyKey), 24 * 60 * 60 * 1000)
  }

  // -------------------------------------------------------
  // 8. レスポンス
  // -------------------------------------------------------
  return NextResponse.json(
    { id: inquiry.id, message: 'Inquiry submitted successfully.' },
    { status: 201 }
  )
}

// -------------------------------------------------------
// メール本文構築（シンプルテキスト。将来HTMLに拡張可）
// -------------------------------------------------------
function buildAutoReplyBody(name: string): string {
  return `${name} 様

この度はINK ADDICTIONへのお問い合わせありがとうございます。

内容を確認の上、12時間以内にご連絡いたします。
しばらくお待ちください。

──────────────────
INK ADDICTION
──────────────────`
}

function buildAdminNotifyBody(
  inquiryId: string,
  data: { name: string; email: string; style_pref: string; budget_range: string; message?: string }
): string {
  return `新規問い合わせが届きました。

ID      : ${inquiryId}
名前    : ${data.name}
メール  : ${data.email}
スタイル: ${data.style_pref}
予算    : ${data.budget_range}
メッセージ:
${data.message ?? '（なし）'}

管理画面で確認してください。`
}
