import type { Metadata } from 'next'
import { SlotsManager } from '@/components/admin/SlotsManager'

export const metadata: Metadata = { title: 'スロット管理 | INK ADDICTION Admin' }

export default function AdminSlotsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Slots</h1>
      </div>
      <SlotsManager />
    </div>
  )
}
