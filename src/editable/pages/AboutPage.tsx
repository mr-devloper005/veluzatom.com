import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import Link from 'next/link'
import { ArrowRight, Camera, Image as ImageIcon, Layers3, Sparkles } from 'lucide-react'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_18px_48px_rgba(24,23,19,0.08)] lg:p-12">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.about.badge}</p>
              <h1 className="mt-5 text-5xl font-black uppercase leading-[0.92] tracking-[-0.06em] sm:text-6xl">About {SITE_CONFIG.name}</h1>
              <p className="mt-6 max-w-3xl text-xl leading-9 text-black/72">{pagesContent.about.description}</p>
              <div className="mt-8 space-y-4 text-base leading-8 text-black/78">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/image" className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-white">
                  Explore images <ArrowRight className="h-4 w-4" />
                </Link>
                
              </div>
            </article>
            <aside className="grid gap-4">
              <div className="rounded-[2rem] border border-black bg-black p-7 text-white shadow-[0_18px_48px_rgba(24,23,19,0.18)]">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/55">What makes it different</p>
                <div className="mt-6 grid gap-5">
                  {[
                    { icon: Camera, title: 'Image-led by default' },
                    { icon: Layers3, title: 'Collections with structure' },
                    { icon: ImageIcon, title: 'Stories beside visuals' },
                    { icon: Sparkles, title: 'A calmer premium mood' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                      <item.icon className="h-5 w-5 shrink-0 text-[#d7a740]" />
                      <span className="text-lg font-black uppercase tracking-[-0.03em]">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className={`rounded-[2rem] border p-6 shadow-[0_12px_40px_rgba(24,23,19,0.08)] ${index === 1 ? 'border-[#546b41] bg-[#546b41] text-white' : 'border-black/8 bg-white'}`}>
                  <h2 className="text-3xl font-black uppercase tracking-[-0.04em]">{value.title}</h2>
                  <p className={`mt-3 text-sm leading-7 ${index === 1 ? 'text-white/76' : 'text-black/68'}`}>{value.description}</p>
                </div>
              ))}
            </aside>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              {
                title: 'Browse',
                copy: 'Move through images, stories, and resources without breaking the visual rhythm.',
              },
              {
                title: 'Share',
                copy: 'Give uploads, collections, and creator pages a stronger editorial frame.',
              },
              {
                title: 'Return',
                copy: 'Save the posts worth revisiting and keep discovery feeling organized instead of scattered.',
              },
            ].map((item, index) => (
              <div key={item.title} className={`rounded-[2rem] border p-6 ${index === 2 ? 'border-black bg-black text-white' : 'border-black/8 bg-white'} shadow-[0_12px_40px_rgba(24,23,19,0.08)]`}>
                <p className={`text-[11px] font-black uppercase tracking-[0.24em] ${index === 2 ? 'text-white/55' : 'text-[var(--slot4-accent)]'}`}>Site rhythm</p>
                <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.04em]">{item.title}</h2>
                <p className={`mt-3 text-sm leading-7 ${index === 2 ? 'text-white/72' : 'text-black/68'}`}>{item.copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
