'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, LogIn, Menu, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled).slice(0, 5).map((task) => ({ label: task.label.toUpperCase(), href: task.route })),
    []
  )

  const style = {
    '--editable-nav-bg': 'rgba(255,248,236,0.92)',
    '--editable-border': 'rgba(24,23,19,0.1)',
  } as CSSProperties

  return (
    <header style={style} className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[92px] max-w-[var(--editable-container)] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-black/15 bg-white">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-black uppercase tracking-[0.24em]">{SITE_CONFIG.name}</span>
            <span className="block text-[10px] font-black uppercase tracking-[0.28em] text-black/45">{globalContent.nav.tagline}</span>
          </span>
        </Link>

       
        <form action="/search" className="ml-auto hidden items-center lg:flex">
          <label className="flex items-center rounded-full border border-black/10 bg-white px-4 py-2.5">
            <Search className="h-4 w-4 text-black/45" />
            <input
              name="q"
              type="search"
              placeholder="Search visuals"
              className="w-40 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-black/35 xl:w-52"
            />
          </label>
        </form>

        <div className="hidden items-center gap-3 lg:flex">
          {session ? (
            <>
              <Link href="/create" className="rounded-full border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] hover:bg-black hover:text-[var(--slot4-dark-text)]">
                Studio
              </Link>
              <button type="button" onClick={logout} className="rounded-full bg-black px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em]">
                Log in
              </Link>
              <Link href="/signup" className="rounded-full bg-black px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white">
                Try for free
              </Link>
            </>
          )}
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="ml-auto rounded-full border border-black/10 bg-white p-3 lg:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-black/10 bg-[var(--slot4-page-bg)] px-4 py-4 lg:hidden">
          <form action="/search" className="mb-4 flex items-center rounded-2xl border border-black/10 bg-white px-4 py-3">
            <Search className="h-4 w-4 text-black/45" />
            <input name="q" type="search" placeholder="Search visuals" className="min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold outline-none" />
          </form>
          <div className="grid gap-2">
            {[{ label: 'HOME', href: '/' }, ...navItems, { label: 'ABOUT', href: '/about' }, { label: 'CONTACT', href: '/contact' }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-black tracking-[0.16em]">
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="rounded-2xl bg-black px-4 py-3 text-sm font-black tracking-[0.16em] text-white">
                  STUDIO
                </Link>
                <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-left text-sm font-black tracking-[0.16em]">
                  LOG OUT
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-black tracking-[0.16em]">
                  <span className="inline-flex items-center gap-2"><LogIn className="h-4 w-4" /> LOG IN</span>
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-2xl bg-black px-4 py-3 text-sm font-black tracking-[0.16em] text-white">
                  <span className="inline-flex items-center gap-2"><UserPlus className="h-4 w-4" /> TRY FOR FREE</span>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
