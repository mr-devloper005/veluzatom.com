import Link from 'next/link'
import { ArrowRight, Check, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function featureHref(primaryTask: TaskKey, primaryRoute: string, post?: SitePost) {
  return post ? postHref(primaryTask, post, primaryRoute) : primaryRoute
}

function VisualTile({ post, href, className = '' }: { post: SitePost; href: string; className?: string }) {
  return (
    <Link href={href} className={`group block overflow-hidden rounded-[1.6rem] bg-white ${className}`}>
      <div className="editable-filter-image relative aspect-[4/5]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-black uppercase leading-tight tracking-[-0.03em]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const heroTitle = pagesContent.home.hero.title.join(' ').toUpperCase() || `EVERYTHING ${taskLabel(primaryTask).toUpperCase()} LOVERS NEED`

  return (
    <section className={`${pal.creamBg} relative overflow-hidden`}>
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{pagesContent.home.hero.badge}</p>
            <h1 className={`${dc.type.heroTitle} mt-5 max-w-5xl`}>{heroTitle}</h1>
            <p className="mt-8 max-w-3xl text-2xl leading-tight text-black/92 sm:text-[2rem]">
              Capture and share images, browse standout collections, find your community, and keep your visual world beautifully organized.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={primaryRoute} className={dc.button.primary}>Explore gallery</Link>
              <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[#d7a740] px-8 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:-translate-y-0.5">
                Try for free
              </Link>
            </div>
          </div>

          <div className="relative grid gap-4 sm:grid-cols-2">
            {posts.slice(0, 4).map((post, index) => (
              <Link
                key={post.id || post.slug}
                href={postHref(primaryTask, post, primaryRoute)}
                className={`group relative overflow-hidden rounded-[1.8rem] ${index === 0 ? 'sm:col-span-2' : ''}`}
              >
                <div className={`${index === 0 ? 'aspect-[16/8]' : 'aspect-[4/5]'} editable-filter-image`}>
                  <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className={`${index === 0 ? 'absolute inset-0 flex items-end bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.78)_100%)] p-6 text-white' : 'bg-white p-4'}`}>
                  <div>
                    {index === 0 ? <p className="text-[11px] font-black uppercase tracking-[0.26em] text-white/70">Featured cover</p> : null}
                    <h3 className={`line-clamp-2 text-xl font-black uppercase leading-tight tracking-[-0.04em] ${index === 0 ? 'text-white sm:text-3xl' : ''}`}>{post.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 10)
  if (!railPosts.length) return null

  return (
    <section className="bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl">Your home for image sharing</h2>
          <div className="mt-10 flex flex-wrap gap-8 text-sm font-black uppercase tracking-[0.18em] text-white/68">
            {['What’s New', 'Create', 'Connect', 'Work'].map((tab, index) => (
              <span key={tab} className="editable-tab" data-active={index === 0 ? 'true' : 'false'}>{tab}</span>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-5">
          {railPosts.slice(0, 5).map((post) => (
            <VisualTile key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} className="bg-white/6 backdrop-blur" />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const cards = posts.slice(0, 3)
  return (
    <section className={pal.creamBg}>
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-4xl">
          <h2 className="text-5xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl">Unlock a richer visual ecosystem</h2>
          <div className="mt-8 flex flex-wrap gap-6 text-[11px] font-black uppercase tracking-[0.26em] text-black/55">
            <span className="text-black">Image sharing</span>
            <span>Collections</span>
            <span>Discovery</span>
          </div>
          <p className="mt-8 max-w-3xl text-2xl leading-tight text-black/88">
            With paths for casual browsers, active collectors, and creators ready to publish, find the browsing flow that fits the way you see.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: 'Starter',
              copy: 'For anyone looking to explore fresh uploads and save visual inspiration.',
              points: ['Curated home feed and editor picks', 'Image-first browsing with clean captions', 'Save favorite posts and revisit them later'],
              dark: false,
            },
            {
              title: 'Plus',
              copy: 'For people who want stronger organization, faster search, and deeper collections.',
              points: ['Smart archive browsing and better filters', 'Collection-friendly layouts across sections', 'More ways to move between related posts'],
              dark: false,
            },
            {
              title: 'Pro',
              copy: 'For creators and visual storytellers ready to shape a stronger presence.',
              points: ['Image-led detail pages and creator spots', 'Publishing studio access and profile visibility', 'Priority placement across premium sections'],
              dark: true,
            },
          ].map((plan, index) => (
            <article key={plan.title} className={`rounded-[2rem] border p-7 ${plan.dark ? 'border-black bg-black text-white' : 'border-black/8 bg-white'}`}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-4xl font-black uppercase tracking-[-0.04em]">{plan.title}</h3>
                {plan.dark ? <span className="rounded-full bg-[#d7a740] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">Recommended</span> : null}
              </div>
              <p className={`mt-6 text-xl leading-snug ${plan.dark ? 'text-white/88' : 'text-black/88'}`}>{plan.copy}</p>
              <div className="mt-8 space-y-4">
                {plan.points.map((point) => (
                  <div key={point} className="flex items-start gap-3 text-sm font-bold leading-6">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" className={`mt-10 inline-flex rounded-full px-6 py-3 text-sm font-black uppercase tracking-[0.18em] ${plan.dark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                Select path
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = timeSections.flatMap((section) => section.posts).length ? timeSections.flatMap((section) => section.posts) : posts
  const first = pool[0] || posts[0]
  const second = pool[1] || posts[1] || first
  const third = pool[2] || posts[2] || first
  const fourth = pool[3] || posts[3] || second

  return (
    <>
      <section className="grid lg:grid-cols-2">
        <div className="bg-[#9fd5f2] px-6 py-14 text-black sm:px-10 lg:px-16 lg:py-20">
          <h2 className="max-w-md text-5xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl">Hone your craft</h2>
          <p className="mt-6 max-w-xl text-xl leading-9 text-black/82">
            Get everything you need for a polished, collection-ready flow. Strong images, clean captions, and editorial pacing cover every step from upload to discovery.
          </p>
          <Link href={featureHref(primaryTask, primaryRoute, first)} className="mt-10 inline-flex rounded-full border border-black px-6 py-3 text-sm font-black uppercase tracking-[0.18em]">
            Explore creative tools
          </Link>
        </div>
        <div className="bg-[var(--slot4-dark-bg)] p-6 sm:p-10 lg:p-16">
          {first ? (
            <div className="relative mx-auto max-w-[470px] overflow-hidden rounded-[2rem] border border-white/20 bg-white/6">
              <img src={getEditablePostImage(first)} alt={first.title} className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/55" />
              <div className="absolute left-8 top-6 text-2xl font-black uppercase tracking-[0.12em] text-white">Edited</div>
              <div className="absolute right-8 top-6 text-2xl font-black uppercase tracking-[0.12em] text-white/82">Original</div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="bg-[#ff6f35] px-6 py-14 text-black sm:px-10 lg:px-16 lg:py-20">
          <h2 className="max-w-md text-5xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl">Find your people</h2>
          <p className="mt-6 max-w-xl text-xl leading-9 text-black/84">
            Follow creators with a point of view, surface themes you love, and keep your visual world connected to the people shaping it.
          </p>
          <Link href={featureHref(primaryTask, primaryRoute, second)} className="mt-10 inline-flex rounded-full border border-black px-6 py-3 text-sm font-black uppercase tracking-[0.18em]">
            Explore community
          </Link>
        </div>
        <div className="bg-[var(--slot4-dark-bg)] p-6 sm:p-10 lg:p-16">
          {second ? (
            <div className="relative mx-auto max-w-[470px] overflow-hidden rounded-[2rem] border border-white/20 bg-black">
              <img src={getEditablePostImage(second)} alt={second.title} className="aspect-[4/5] w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.32))]" />
              <div className="absolute left-8 top-8 text-5xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-white">Available for discovery</div>
              <div className="absolute bottom-10 left-8 space-y-4 text-2xl text-white/92">
                {['Portraits', 'Travel', 'Collections'].map((item) => (
                  <div key={item} className="flex items-center gap-4"><span className="flex h-10 w-10 items-center justify-center rounded border border-white text-xl">✓</span>{item}</div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className={pal.creamBg}>
        <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="max-w-3xl text-5xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl">Where image lovers turn pro</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[third, fourth, posts[4] || third].filter(Boolean).map((post, index) => (
              <Link key={`${post?.slug}-${index}`} href={featureHref(primaryTask, primaryRoute, post)} className="group relative overflow-hidden rounded-[1.8rem]">
                <img src={getEditablePostImage(post)} alt={post?.title || ''} className="aspect-[5/7] w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.74))]" />
                <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                  <p className="line-clamp-4 text-3xl leading-tight tracking-[-0.04em]">{getEditableExcerpt(post, 110) || post?.title}</p>
                  <p className="mt-4 text-base font-medium text-white/84">{post?.title}</p>
                  <span className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-black">Open story</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/52">Search the archive</p>
              <h2 className="mt-4 text-5xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl">Everything worth keeping in one place</h2>
              <p className="mt-6 text-lg leading-8 text-white/72">
                Browse new uploads, saved resources, creator profiles, and editorial stories through one search-first archive.
              </p>
              <form action="/search" className="mt-8 flex max-w-xl rounded-full border border-white/15 bg-white/8 p-2">
                <input name="q" placeholder="Search image stories" className="min-w-0 flex-1 bg-transparent px-5 text-sm font-semibold text-white outline-none placeholder:text-white/35" />
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-black">
                  <Search className="h-4 w-4" /> Search
                </button>
              </form>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {posts.slice(5, 13).map((post, index) => (
                <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className={`group rounded-[1.6rem] border p-5 ${index % 4 === 0 ? 'border-[#546b41] bg-[#546b41] text-white' : 'border-white/10 bg-white/[0.04] text-white'}`}>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] opacity-70">No. {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-3 line-clamp-3 text-2xl font-black uppercase leading-[0.95] tracking-[-0.04em]">{post.title}</h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-7 opacity-75">{getEditableExcerpt(post, 120)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section className={pal.creamBg}>
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            ['Get help', 'Find answers, support, and help for making the most of the site.', '/contact'],
            ['Download the mood', 'Collect references, revisit inspiration, and keep discovery within reach.', '/image'],
          ].map(([title, body, href]) => (
            <Link key={title} href={href} className="rounded-[2rem] border border-black/8 bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl">
              <h3 className="text-3xl font-black uppercase tracking-[-0.04em]">{title}</h3>
              <p className="mt-5 text-sm leading-7 text-black/68">{body}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
                Open <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
