import { z } from 'zod'

/** 許可するMIMEタイプ */
export const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/pdf',
] as const

const MAX_FILE_SIZE_MB = 10
const MAX_FILES = 5

const uploadMetaSchema = z.object({
  path: z.string().min(1),
  mime: z.enum(ALLOWED_MIMES as unknown as [string, ...string[]]),
  size_bytes: z
    .number()
    .int()
    .positive()
    .max(MAX_FILE_SIZE_MB * 1024 * 1024, {
      message: `ファイルサイズは ${MAX_FILE_SIZE_MB}MB 以下にしてください`,
    }),
})

export const inquirySchema = z.object({
  name: z.string().min(1, '名前は必須です').max(100),
  email: z.string().email('有効なメールアドレスを入力してください'),
  phone: z.string().regex(/^\d+$/, '数字のみ入力してください').optional(),
  contact_pref: z.enum(['email', 'phone', 'instagram']).default('email'),
  age_confirmed: z.literal(true, {
    message: '年齢確認が必要です',
  }),

  style_pref: z.string().min(1, '希望ジャンルは必須です'),
  placement: z.string().min(1, '希望部位は必須です'),
  size: z.string().min(1, 'サイズは必須です'),
  color_pref: z.string().min(1, 'カラーは必須です'),
  budget_range: z.string().min(1, '予算レンジは必須です'),
  preferred_windows: z
    .array(
      z.union([
        z.object({ slotId: z.string().uuid() }),
        z.object({ date: z.string(), timeRange: z.string() }),
      ])
    )
    .default([]),
  message: z.string().max(1000, 'メッセージは1000文字以内にしてください').optional(),
  uploads: z
    .array(uploadMetaSchema)
    .max(MAX_FILES, `添付は${MAX_FILES}枚以内にしてください`)
    .optional()
    .default([]),
})

export type InquiryInput = z.infer<typeof inquirySchema>
