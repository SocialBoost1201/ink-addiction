import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found__inner">
        <p className="not-found__code">404</p>
        <h1 className="not-found__title">Page Not Found</h1>
        <p className="not-found__msg">
          お探しのページが見つかりませんでした。<br />
          削除または移動した可能性があります。
        </p>
        <div className="not-found__links">
          <Link href="/" className="btn btn--primary">トップへ戻る</Link>
          <Link href="/gallery" className="btn btn--ghost">ギャラリーを見る</Link>
        </div>
      </div>
    </main>
  )
}
