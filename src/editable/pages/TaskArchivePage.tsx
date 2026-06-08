import Link from 'next/link'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; grid: string; label: string }> = {
  article: { icon: FileText, grid: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', label: 'Story' },
  listing: { icon: Building2, grid: 'grid gap-5 xl:grid-cols-2', label: 'Listing' },
  classified: { icon: Megaphone, grid: 'grid gap-5 xl:grid-cols-2', label: 'Offer' },
  image: { icon: Camera, grid: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', label: 'Image' },
  sbm: { icon: Bookmark, grid: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', label: 'Bookmark' },
  pdf: { icon: Download, grid: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', label: 'PDF' },
  profile: { icon: UserRound, grid: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', label: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const deck = taskDeck[task]
  const Icon = deck.icon
  const lead = posts[0]

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="border-b border-black/6">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{voice.eyebrow}</p>
              <h1 className="mt-5 text-5xl font-black uppercase leading-[0.92] tracking-[-0.06em] sm:text-6xl">{voice.headline}</h1>
              <p className="mt-6 max-w-3xl text-xl leading-9 text-black/72">{voice.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {voice.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-black/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-black/72">{chip}</span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={basePath} className="rounded-full bg-black px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white">Browse all</Link>
                <Link href="/search" className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.18em]">Search archive</Link>
              </div>
            </div>

            <div className="grid gap-4">
              <form action={basePath} className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_18px_48px_rgba(24,23,19,0.08)]">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-black/52"><Filter className="h-4 w-4" /> {voice.filterLabel}</div>
                <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-2xl border border-black/10 bg-[var(--slot4-page-bg)] px-4 text-sm font-bold outline-none">
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <button className="mt-3 h-12 w-full rounded-2xl bg-[var(--slot4-accent)] text-sm font-black uppercase tracking-[0.18em] text-white">Apply</button>
                <p className="mt-3 text-xs font-bold text-black/55">Showing: {categoryLabel}</p>
              </form>

              {lead ? (
                <Link href={`${basePath}/${lead.slug}` || buildPostUrl(task, lead.slug)} className="group relative overflow-hidden rounded-[2rem] bg-black text-white">
                  <img src={getEditablePostImage(lead)} alt={lead.title} className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.82))]" />
                  <div className="relative p-6 sm:p-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white"><Icon className="h-4 w-4" /> {taskConfig?.label || task}</div>
                    <h2 className="mt-20 text-3xl font-black uppercase leading-[0.96] tracking-[-0.05em] sm:text-4xl">{lead.title}</h2>
                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/76">{getEditableExcerpt(lead, 145)}</p>
                  </div>
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          {posts.length ? (
            <div className={deck.grid}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/80 p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-black/45" />
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.04em]">No posts found</h2>
              <p className="mt-3 text-sm leading-7 text-black/62">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.14em]">Previous</Link> : null}
            <span className="rounded-full bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.14em]">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_12px_40px_rgba(24,23,19,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(24,23,19,0.14)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-3 line-clamp-3 text-2xl font-black uppercase leading-[0.96] tracking-[-0.04em]">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-black/65">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getEditablePostImage(post)
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_12px_40px_rgba(24,23,19,0.08)] transition hover:-translate-y-1 sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--slot4-page-bg)]">
        {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black uppercase leading-[0.96] tracking-[-0.04em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-black/65">{getSummary(post)}</p>
        {phone ? <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-black/55">Phone available</p> : null}
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget']) || 'Open offer'
  const location = getField(post, ['location', 'address', 'city'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_12px_40px_rgba(24,23,19,0.08)] transition hover:-translate-y-1">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="bg-black p-6 text-white">
          <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">Classified</span>
          <h2 className="mt-10 text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em]">{price}</h2>
          <p className="mt-4 text-sm font-bold text-white/72">{location || 'Details inside'}</p>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black uppercase leading-[0.96] tracking-[-0.04em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-black/65">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_12px_40px_rgba(24,23,19,0.08)] transition hover:-translate-y-1">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black uppercase leading-tight tracking-[-0.04em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block rounded-[1.8rem] border border-black/8 bg-white p-6 shadow-[0_12px_40px_rgba(24,23,19,0.08)] transition hover:-translate-y-1 hover:bg-black hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black uppercase leading-[0.96] tracking-[-0.04em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 opacity-70">{getSummary(post)}</p>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_12px_40px_rgba(24,23,19,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(24,23,19,0.14)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-black p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[var(--slot4-page-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{getEditableCategory(post)}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black uppercase leading-[0.96] tracking-[-0.04em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-black/65">{getSummary(post)}</p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="rounded-[2rem] border border-black/8 bg-white p-6 text-center shadow-[0_12px_40px_rgba(24,23,19,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(24,23,19,0.14)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-page-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover" />
      </div>
      <h2 className="mt-5 text-xl font-black uppercase leading-tight tracking-[-0.04em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-black/65">{getSummary(post)}</p>
    </Link>
  )
}
