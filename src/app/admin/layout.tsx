import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ミドルウェアが通るはずだが念のため二重チェック
  if (!user) {
    redirect('/admin/login')
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/works', label: 'Works' },
    { href: '/admin/slots', label: 'Slots' },
    { href: '/admin/inquiries', label: 'Inquiries' },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <Link href="/admin/dashboard" className="admin-sidebar__logo">
            INK ADDICTION
          </Link>
          <span className="admin-sidebar__badge">Admin</span>
        </div>
        <nav className="admin-sidebar__nav" aria-label="管理ナビゲーション">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="admin-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <p className="admin-sidebar__user">{user.email}</p>
          <AdminLogoutButton />
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}
