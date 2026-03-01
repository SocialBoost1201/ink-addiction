import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | INK ADDICTION',
  description: 'INK ADDICTIONのプライバシーポリシーです。お客様の個人情報の取り扱いについて説明します。',
}

export default function PrivacyPage() {
  return (
    <main className="static-page">
      <div className="static-page__inner">
        <header className="static-page__header">
          <p className="section-eyebrow">Legal</p>
          <h1 className="static-page__title">プライバシーポリシー</h1>
          <p className="static-page__date">最終更新日：2026年3月1日</p>
        </header>

        <div className="static-page__body">
          <section>
            <h2>1. 個人情報の取り扱いについて</h2>
            <p>
              INK ADDICTION（以下「当スタジオ」）は、お客様の個人情報を適切に保護することを重要な責務と考え、
              以下の方針に基づき取り扱います。
            </p>
          </section>

          <section>
            <h2>2. 収集する情報</h2>
            <p>当スタジオは、以下の情報を収集する場合があります。</p>
            <ul>
              <li>氏名</li>
              <li>メールアドレス</li>
              <li>電話番号（任意）</li>
              <li>お問い合わせ内容</li>
              <li>添付ファイル（参考画像等）</li>
            </ul>
          </section>

          <section>
            <h2>3. 利用目的</h2>
            <p>収集した個人情報は、以下の目的のみに使用します。</p>
            <ul>
              <li>お問い合わせへの返信・対応</li>
              <li>予約・施術に関する連絡</li>
              <li>サービス改善のための統計分析（個人を特定しない形式）</li>
            </ul>
          </section>

          <section>
            <h2>4. 第三者提供</h2>
            <p>
              当スタジオは、法令に基づく場合を除き、お客様の個人情報を第三者に提供・開示することはありません。
            </p>
          </section>

          <section>
            <h2>5. 個人情報の管理</h2>
            <p>
              個人情報は適切なセキュリティ環境下で管理し、漏洩・滅失・毀損の防止に努めます。
              不要となった個人情報は適切に削除します。
            </p>
          </section>

          <section>
            <h2>6. Cookie・アクセス解析</h2>
            <p>
              当サイトでは、サービス改善のためGoogle Analytics等のアクセス解析ツールを使用する場合があります。
              これらのツールはCookieを使用しますが、個人を特定する情報は収集しません。
            </p>
          </section>

          <section>
            <h2>7. 個人情報の開示・削除</h2>
            <p>
              お客様ご自身の個人情報の開示・訂正・削除をご希望の場合は、
              お問い合わせフォームよりご連絡ください。
            </p>
          </section>

          <section>
            <h2>8. ポリシーの変更</h2>
            <p>
              本ポリシーは、必要に応じて変更することがあります。
              変更後のポリシーは当ページに掲載した時点から効力を生じます。
            </p>
          </section>

          <section>
            <h2>9. お問い合わせ</h2>
            <p>
              個人情報の取り扱いに関するご質問・ご意見は、
              <Link href="/inquiry">お問い合わせフォーム</Link>よりご連絡ください。
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
