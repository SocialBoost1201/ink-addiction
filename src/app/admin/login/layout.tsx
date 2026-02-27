// /admin/login は管理レイアウト（サイドバー）を適用しない
// このレイアウトで親の admin/layout.tsx を上書きする
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
