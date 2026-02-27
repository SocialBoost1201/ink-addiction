import { InquiryForm } from '@/components/inquiry/InquiryForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'お問い合わせ | INK ADDICTION',
  description:
    'タトゥーのご相談・お問い合わせはこちらから。ジャンル・部位・サイズ・予算など詳細をお知らせください。24時間以内にご返信します。',
}

export default function InquiryPage() {
  return (
    <main className="inquiry-page">
      {/* ページヘッダー */}
      <section className="inquiry-page-header">
        <p className="section-eyebrow">Contact</p>
        <h1 className="inquiry-page__title">お問い合わせ</h1>
        <p className="inquiry-page__lead">
          まずはお気軽にご相談ください。<br />
          内容確認後、24時間以内にご連絡いたします。
        </p>
      </section>

      {/* 注意事項 */}
      <section className="inquiry-notice">
        <div className="inquiry-notice__inner">
          <ul className="inquiry-notice__list">
            <li>施術は<strong>18歳以上</strong>の方に限らせていただいております。</li>
            <li>完全予約制です。当日予約は受け付けておりません。</li>
            <li>デザインの著作権を侵害する図案には対応できない場合があります。</li>
          </ul>
        </div>
      </section>

      {/* フォーム本体 */}
      <div className="inquiry-form-container">
        <InquiryForm />
      </div>
    </main>
  )
}
