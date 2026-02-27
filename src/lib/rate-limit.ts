/**
 * シンプルなインメモリレート制限
 * - v1 シングルインスタンス用途
 * - 将来的には Upstash Redis 等に移行可能
 */

interface RateLimitRecord {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitRecord>()

interface RateLimitConfig {
  /** 許可するリクエスト数 */
  limit: number
  /** ウィンドウ（ミリ秒） */
  windowMs: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const record = store.get(key)

  if (!record || now > record.resetAt) {
    // 新規 or リセット
    const resetAt = now + config.windowMs
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: config.limit - 1, resetAt }
  }

  if (record.count >= config.limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt }
  }

  record.count += 1
  return {
    allowed: true,
    remaining: config.limit - record.count,
    resetAt: record.resetAt,
  }
}

/** 古いエントリを定期的にクリーンアップ（メモリリーク防止） */
export function purgeExpiredEntries(): void {
  const now = Date.now()
  for (const [key, record] of store.entries()) {
    if (now > record.resetAt) {
      store.delete(key)
    }
  }
}
