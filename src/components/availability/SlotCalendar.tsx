'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

interface Slot {
  id: string
  start_at: string
  end_at: string
  note: string | null
}

interface SlotCalendarProps {
  initialSlots: Slot[]
  initialYear: number
  initialMonth: number
}

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']
const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

/** YYYY-MM-DD 形式で返す */
function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function SlotCalendar({ initialSlots, initialYear, initialMonth }: SlotCalendarProps) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [slots, setSlots] = useState<Slot[]>(initialSlots)
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const fetchSlots = useCallback(async (y: number, m: number) => {
    setLoading(true)
    setSelectedDate(null)
    try {
      const res = await fetch(`/api/slots?year=${y}&month=${m}`)
      const data = await res.json()
      setSlots(data.slots ?? [])
    } catch {
      setSlots([])
    } finally {
      setLoading(false)
    }
  }, [])

  const navigate = (delta: number) => {
    const next = new Date(year, month - 1 + delta, 1)
    const ny = next.getFullYear()
    const nm = next.getMonth() + 1
    setYear(ny)
    setMonth(nm)
    fetchSlots(ny, nm)
  }

  // スロットを日付keyでグルーピング
  const slotsByDate: Record<string, Slot[]> = {}
  for (const slot of slots) {
    const key = toDateStr(new Date(slot.start_at))
    if (!slotsByDate[key]) slotsByDate[key] = []
    slotsByDate[key].push(slot)
  }

  // カレンダーグリッドを構築
  const firstDay = new Date(year, month - 1, 1).getDay() // 0=日
  const daysInMonth = new Date(year, month, 0).getDate()
  const today = toDateStr(new Date())

  const calendarCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // 6行になるようパディング
  while (calendarCells.length % 7 !== 0) calendarCells.push(null)

  const selectedSlots = selectedDate ? (slotsByDate[selectedDate] ?? []) : []

  const isPast = (day: number) => {
    const d = new Date(year, month - 1, day)
    return d < new Date(new Date().setHours(0, 0, 0, 0))
  }

  return (
    <div className="slot-calendar">
      {/* ヘッダー（月ナビ） */}
      <div className="slot-calendar__nav">
        <button
          className="slot-nav-btn"
          onClick={() => navigate(-1)}
          aria-label="前月"
          disabled={loading}
        >
          ←
        </button>
        <h2 className="slot-calendar__month">
          {year}年 {MONTH_NAMES[month - 1]}
        </h2>
        <button
          className="slot-nav-btn"
          onClick={() => navigate(1)}
          aria-label="次月"
          disabled={loading}
        >
          →
        </button>
      </div>

      {/* 凡例 */}
      <div className="slot-legend">
        <span className="slot-legend__item slot-legend__item--available">空き</span>
        <span className="slot-legend__item slot-legend__item--selected">選択中</span>
        <span className="slot-legend__item slot-legend__item--today">本日</span>
      </div>

      {/* カレンダーグリッド */}
      <div className={`slot-grid ${loading ? 'slot-grid--loading' : ''}`}>
        {/* 曜日ヘッダー */}
        {WEEKDAY_LABELS.map((d, i) => (
          <div key={d} className={`slot-weekday ${i === 0 ? 'slot-weekday--sun' : i === 6 ? 'slot-weekday--sat' : ''}`}>
            {d}
          </div>
        ))}

        {/* 日付セル */}
        {calendarCells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} className="slot-day slot-day--empty" />
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasSlot = !!slotsByDate[dateStr]
          const isToday = dateStr === today
          const past = isPast(day)
          const isSelected = selectedDate === dateStr
          const isSun = (idx % 7) === 0
          const isSat = (idx % 7) === 6

          return (
            <button
              key={dateStr}
              className={[
                'slot-day',
                hasSlot ? 'slot-day--available' : '',
                isToday ? 'slot-day--today' : '',
                isSelected ? 'slot-day--selected' : '',
                past ? 'slot-day--past' : '',
                isSun ? 'slot-day--sun' : '',
                isSat ? 'slot-day--sat' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => hasSlot && !past ? setSelectedDate(isSelected ? null : dateStr) : undefined}
              disabled={!hasSlot || past}
              aria-pressed={isSelected}
              aria-label={`${month}月${day}日${hasSlot ? ' 空きあり' : ''}`}
            >
              <span className="slot-day__num">{day}</span>
              {hasSlot && !past && (
                <span className="slot-day__dot" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>

      {/* 選択した日のスロット詳細 */}
      {selectedDate && selectedSlots.length > 0 && (
        <div className="slot-detail">
          <p className="slot-detail__date">
            {new Date(selectedDate).toLocaleDateString('ja-JP', {
              year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
            })}
          </p>
          <ul className="slot-detail__list">
            {selectedSlots.map((slot) => {
              const start = new Date(slot.start_at)
              const end = new Date(slot.end_at)
              const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} 〜 ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`
              return (
                <li key={slot.id} className="slot-detail__item">
                  <span className="slot-detail__time">{timeStr}</span>
                  {slot.note && <span className="slot-detail__note">{slot.note}</span>}
                  <Link
                    href={`/inquiry?slotId=${slot.id}&date=${selectedDate}`}
                    className="btn btn--primary btn--sm slot-detail__cta"
                  >
                    この日程で相談する
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* スロットが0件の場合 */}
      {slots.length === 0 && !loading && (
        <p className="slot-empty">
          この月の公開スロットはありません。<br />
          お問い合わせフォームよりご希望の日程をお知らせください。
        </p>
      )}
    </div>
  )
}
