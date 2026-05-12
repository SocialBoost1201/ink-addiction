import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-section__inner">
        <p className="cta-section__eyebrow">Contact</p>

        <h2 id="cta-heading" className="cta-section__title">
          まずは<em>無料</em><br />相談から。
        </h2>

        <p className="cta-section__copy">
          デザインの持ち込み・ゼロからの相談、どちらも対応します。<br />
          24時間以内にご返信いたします。
        </p>

        <div className="cta-section__actions">
          <Link href="/inquiry" className="btn btn--primary btn--lg">
            問い合わせる
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/availability" className="btn btn--ghost btn--lg">
            空き状況を見る
          </Link>
        </div>
      </div>
    </section>
  )
}
