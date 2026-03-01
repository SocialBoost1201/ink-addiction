import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'よくある質問（FAQ）| INK ADDICTION',
  description:
    'タトゥーに関するよくある質問をまとめました。料金・痛み・施術時間・デザインなどお気軽にご確認ください。',
}

const FAQ_ITEMS = [
  {
    q: '初めてのタトゥーでも大丈夫ですか？',
    a: 'はじめての方も大歓迎です。事前相談でご要望・不安点をしっかりヒアリングします。まずはお気軽にお問い合わせください。',
  },
  {
    q: '痛みはどれくらいですか？',
    a: '部位・サイズ・デザインにより異なります。骨の近い箇所（手首・アンクル・鎖骨）や皮膚の薄い箇所は比較的感じやすい傾向があります。施術中に休憩も可能です。',
  },
  {
    q: '料金はどのように決まりますか？',
    a: 'サイズ・デザインの複雑さ・カラーの有無・施術時間をもとにお見積もりします。事前に概算をお伝えしますのでご安心ください。',
  },
  {
    q: '施術時間はどれくらいかかりますか？',
    a: 'サイズによります。極小（3cm以下）で30分〜1時間、スリーブなど大きいものは複数セッションに分けます。1セッションの最大目安は4〜5時間です。',
  },
  {
    q: 'デザインの持ち込みはできますか？',
    a: 'もちろん可能です。参考画像をお送りいただければ、お客様のご要望に合わせてカスタムデザインを制作します。著作権を侵害するデザインの完全コピーは対応しかねる場合があります。',
  },
  {
    q: '未成年はNG？',
    a: '18歳未満の方は施術をお断りしております。施術時に年齢確認をさせていただく場合があります。',
  },
  {
    q: '既存のタトゥーのカバーアップはできますか？',
    a: '状態により対応可能な場合があります。まずは既存のタトゥーの写真をお送りいただきご相談ください。',
  },
  {
    q: 'アフターケアはどうすればいいですか？',
    a: '施術完了後に詳細をお伝えします。基本的には清潔に保ち、保湿を続けることが大切です。施術後2〜3週間は特に注意が必要です。',
  },
  {
    q: '当日予約はできますか？',
    a: '完全予約制のため、当日予約は承っておりません。少なくとも数日前を目安にお問い合わせください。',
  },
  {
    q: '妊娠中でも施術できますか？',
    a: '妊娠中・授乳中の方への施術はお断りしております。安全上の観点からご理解ください。',
  },
  {
    q: '体質的にNGなことはありますか？',
    a: 'ケロイド体質の方は傷痕が残りやすいため事前にご相談ください。その他、皮膚疾患・免疫疾患をお持ちの方も事前にお知らせください。',
  },
  {
    q: 'オンライン相談はできますか？',
    a: 'お問い合わせフォームからメールでのご相談に対応しています。写真や参考画像の共有もフォームから可能です。',
  },
]

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="static-page">
        <div className="static-page__inner">
          <header className="static-page__header">
            <p className="section-eyebrow">FAQ</p>
            <h1 className="static-page__title">よくある質問</h1>
            <p className="static-page__lead">
              タトゥーに関するご質問をまとめました。<br />
              解決しない場合はお気軽にお問い合わせください。
            </p>
          </header>

          <dl className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="faq-item">
                <dt className="faq-item__q">
                  <span className="faq-item__q-mark">Q</span>
                  {item.q}
                </dt>
                <dd className="faq-item__a">
                  <span className="faq-item__a-mark">A</span>
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>

          <div className="static-page__cta">
            <p>その他のご質問はお気軽にどうぞ</p>
            <Link href="/inquiry" className="btn btn--primary btn--lg">お問い合わせ</Link>
          </div>
        </div>
      </main>
    </>
  )
}
