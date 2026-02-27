import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-section__inner">
        <p className="section-eyebrow">Contact</p>
        <h2 id="cta-heading" className="cta-section__title">
          まずは無料相談から
        </h2>
        <p className="cta-section__copy">
          デザインの持ち込み・ゼロからの相談、どちらも対応します。<br />
          24時間以内にご返信いたします。
        </p>
        <div className="cta-section__actions">
          <Link href="/inquiry" className="btn btn--primary btn--lg">
            問い合わせる
          </Link>
          <Link href="/availability" className="btn btn--ghost btn--lg">
            空き状況を見る
          </Link>
        </div>
      </div>
    </section>
  )
}
