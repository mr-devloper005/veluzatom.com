'use client'

import { Camera, Image as ImageIcon, Mail, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function ContactPage() {
  const lanes = [
    { icon: Camera, title: 'Creator collaborations', body: 'Share gallery launches, creator spotlights, and visual campaign ideas.' },
    { icon: ImageIcon, title: 'Publishing support', body: 'Ask about sections, formatting, profile pages, and how to present visual work clearly.' },
    { icon: Mail, title: 'Partnership requests', body: 'Reach out for features, sponsorships, curated programs, and editorial placements.' },
    { icon: Sparkles, title: 'General questions', body: 'Need help deciding where something belongs? We can point you in the right direction.' },
  ]

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.contact.eyebrow}</p>
              <h1 className="mt-5 text-5xl font-black uppercase leading-[0.92] tracking-[-0.06em] sm:text-6xl">{pagesContent.contact.title}</h1>
              <p className="mt-6 max-w-2xl text-xl leading-9 text-black/72">{pagesContent.contact.description}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {lanes.map((lane, index) => (
                  <div key={lane.title} className={`rounded-[2rem] border p-5 shadow-[0_12px_40px_rgba(24,23,19,0.08)] ${index === 0 ? 'border-black bg-black text-white' : 'border-black/8 bg-white'}`}>
                    <lane.icon className="h-5 w-5" />
                    <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.04em]">{lane.title}</h2>
                    <p className={`mt-3 text-sm leading-7 ${index === 0 ? 'text-white/72' : 'text-black/68'}`}>{lane.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_48px_rgba(24,23,19,0.08)] sm:p-8">
              <h2 className="text-3xl font-black uppercase tracking-[-0.04em]">{pagesContent.contact.formTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-black/62">We read every note carefully and keep the conversation straightforward.</p>
              <div className="mt-6"><EditableContactLeadForm /></div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
