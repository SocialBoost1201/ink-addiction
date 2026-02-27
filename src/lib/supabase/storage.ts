import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

const BUCKET = 'works'

export interface UploadResult {
  path: string
  width: number | null
  height: number | null
}

/**
 * Supabase Storage の works バケットに画像をアップロードする
 * path: works/{uuid}/{filename}
 */
export async function uploadWorkImage(file: File): Promise<UploadResult> {
  const supabase = createClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${uuidv4()}/image.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw new Error(`アップロード失敗: ${error.message}`)

  // 画像サイズを取得
  let width: number | null = null
  let height: number | null = null
  if (file.type.startsWith('image/')) {
    try {
      const bitmap = await createImageBitmap(file)
      width = bitmap.width
      height = bitmap.height
      bitmap.close()
    } catch {
      // 取得できなくても続行
    }
  }

  return { path, width, height }
}

/** Storage の公開URL を組み立てる */
export function getStorageUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`
}
