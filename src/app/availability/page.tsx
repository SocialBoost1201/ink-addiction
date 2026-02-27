import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SlotCalendar } from '@/components/availability/SlotCalendar'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '空き状況 | INK ADDICTION',
  description: 'INK ADDICTIONの予約空き状況をご確認いただけます。ご希望の日程をお問い合わせください。',
}

async function getInitialSlots() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const start = new Date(year, month - 1, 1).toISOString()
  const end = new Date(year, month, 0, 23, 59, 59).toISOString()

  const supabase = await createClient()
  const { data } = await supabase
    .from('availability_slots')
    .select('id, start_at, end_at, note')
    .eq('status', 'published')
    .gte('start_at', start)
    .lte('start_at', end)
    .order('start_at')

  return data ?? []
}

export default async function AvailabilityPage() {
  const initialSlots = await getInitialSlots()
  const now = new Date()

  return (
    <main className="availability-page">
      <section className="availability-header">
        <p className="section-eyebrow">Availability</p>
        <h1 className="availability-header__title">空き状況</h1>
        <p className="availability-header__lead">
          ご希望のお日にちにお問い合わせください。<br />
          完全予約制・24時間以内にご返信します。
        </p>
      </section>

      <div className="availability-content">
        <SlotCalendar
          initialSlots={initialSlots}
          initialYear={now.getFullYear()}
          initialMonth={now.getMonth() + 1}
        />

        <div className="availability-cta">
          <p className="availability-cta__copy">ご希望の日程が決まったら</p>
          <Link href="/inquiry" className="btn btn--primary btn--lg">
            お問い合わせ・相談はこちら
          </Link>
        </div>
      </div>
    </main>
  )
}
