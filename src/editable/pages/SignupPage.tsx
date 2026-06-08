import type { Metadata } from 'next'
import Link from 'next/link'
import { Camera, Image as ImageIcon, Sparkles, UserRound } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className="order-2 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur sm:p-8 lg:order-1">
            <h1 className="text-3xl font-black uppercase tracking-[-0.05em]">{pagesContent.auth.signup.formTitle}</h1>
            <p className="mt-3 text-sm leading-7 text-white/62">Open your account to save discoveries, publish visual posts, and keep your studio connected.</p>
            <EditableLocalSignupForm />
            <p className="mt-5 text-sm text-white/65">Already have an account? <Link href="/login" className="font-black uppercase tracking-[0.1em] text-white underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#d7a740]">{pagesContent.auth.signup.badge}</p>
            <h2 className="mt-5 max-w-2xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-6xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-6 max-w-xl text-xl leading-9 text-white/68">{pagesContent.auth.signup.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: ImageIcon, title: 'Share visuals', copy: 'Publish image-led posts with room for story, caption, and atmosphere.' },
                { icon: UserRound, title: 'Build a profile', copy: 'Create a presence that feels curated instead of dropped into a plain feed.' },
                { icon: Camera, title: 'Save inspiration', copy: 'Keep visual finds, references, and favorite uploads within easy reach.' },
                { icon: Sparkles, title: 'Stay connected', copy: 'Move smoothly between images, stories, resources, and creator pages.' },
              ].map((item, index) => (
                <div key={item.title} className={`rounded-[1.8rem] border p-5 ${index === 0 ? 'border-[#546b41] bg-[#546b41] text-white' : 'border-white/10 bg-white/[0.05]'}`}>
                  <item.icon className="h-5 w-5" />
                  <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.04em]">{item.title}</h3>
                  <p className={`mt-3 text-sm leading-7 ${index === 0 ? 'text-white/76' : 'text-white/65'}`}>{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
