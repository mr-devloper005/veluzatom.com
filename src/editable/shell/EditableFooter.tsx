'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const { session, logout } = useEditableLocalAuthSession()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      <div className="editable-mosaic mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <Link href="/" className="inline-flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white">
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
              </span>
              <span>
                <span className="block text-sm font-black uppercase tracking-[0.24em]">{SITE_CONFIG.name}</span>
                <span className="block text-[10px] font-black uppercase tracking-[0.28em] text-white/45">{globalContent.footer.tagline}</span>
              </span>
            </Link>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/68">{globalContent.footer.description}</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <h3 className="text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em]">Explore</h3>
            <div className="mt-6 grid gap-3">
              {taskLinks.map((task) => (
                <Link key={task.key} href={task.route} className="inline-flex items-center justify-between gap-3 border-b border-white/10 py-3 text-sm font-black uppercase tracking-[0.14em] text-white/80 transition hover:text-white">
                  {task.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#546b41] p-8 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/70">Site links</p>
            <div className="mt-6 grid gap-3 text-sm font-black uppercase tracking-[0.14em]">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              {session ? <Link href="/create">Studio</Link> : <Link href="/login">Log in</Link>}
              {!session ? <Link href="/signup">Create account</Link> : <button type="button" onClick={logout} className="text-left">Log out</button>}
            </div>
            <p className="mt-10 text-sm leading-7 text-white/78">{globalContent.footer.bottomNote}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs font-black uppercase tracking-[0.18em] text-white/50">
        © {year} {SITE_CONFIG.name}
      </div>
    </footer>
  )
}
