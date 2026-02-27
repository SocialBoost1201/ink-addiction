export interface Genre {
  slug: string
  name: string
  description: string | null
  cover_path: string | null
  priority: number
  is_active: boolean
}

export interface WorkImage {
  id: string
  work_id: string
  path: string
  width: number | null
  height: number | null
  blurhash: string | null
  sort_order: number
}

export interface Work {
  id: string
  title: string
  description: string | null
  final_genre_slug: string | null
  tags: {
    bodyPart?: string[]
    size?: string
    color?: string[]
    technique?: string[]
  }
  price_min: number | null
  price_max: number | null
  is_published: boolean
  published_at: string | null
  created_at: string
  // joined
  work_images: WorkImage[]
  genres?: Genre | null
}

export interface GalleryResponse {
  works: Work[]
  total: number
  hasNext: boolean
}

export interface GalleryQuery {
  genre?: string
  bodyPart?: string
  color?: string
  page?: number
  limit?: number
}
