export type ContactPref = 'email' | 'phone' | 'instagram'

export type InquiryStatus =
  | 'new'
  | 'reviewing'
  | 'waiting_customer'
  | 'quoted'
  | 'scheduled'
  | 'closed'
  | 'cancelled'

export type PreferredWindow =
  | { slotId: string }
  | { date: string; timeRange: string }

export interface InquiryUploadMeta {
  path: string
  mime: string
  size_bytes: number
}

/** POST /api/inquiry リクエストボディ */
export interface InquiryRequestBody {
  name: string
  email: string
  phone?: string
  contact_pref?: ContactPref
  age_confirmed: boolean
  style_pref: string
  placement: string
  size: string
  color_pref: string
  budget_range: string
  preferred_windows: PreferredWindow[]
  message?: string
  /** 事前にStorageへアップロード済みのファイルメタデータ */
  uploads?: InquiryUploadMeta[]
}

export interface InquiryRow {
  id: string
  name: string
  email: string
  phone: string | null
  contact_pref: ContactPref
  age_confirmed: boolean
  style_pref: string
  placement: string
  size: string
  color_pref: string
  budget_range: string
  preferred_windows: PreferredWindow[]
  message: string | null
  status: InquiryStatus
  internal_notes: string | null
  created_at: string
  updated_at: string
}
