import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const single = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter((url) => url && isUrl(url))
  return [...media, ...images, ...single].filter(Boolean).slice(0, 12)
}
const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}
const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')
const linkifyMarkdown = (value: string) => value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)
const linkifyText = (value: string) => linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)
const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})
const sanitizeHtml = (html: string) => hardenLinks(html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '').replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))
const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value.split(/\n{2,}/).map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`).join('')
}
const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  if (task === 'listing') return <EditableSiteShell><ListingDetail post={post} related={related} /></EditableSiteShell>
  if (task === 'classified') return <EditableSiteShell><ClassifiedDetail post={post} related={related} /></EditableSiteShell>
  if (task === 'image') return <EditableSiteShell><ImageDetail post={post} related={related} /></EditableSiteShell>
  if (task === 'sbm') return <EditableSiteShell><BookmarkDetail post={post} related={related} /></EditableSiteShell>
  if (task === 'pdf') return <EditableSiteShell><PdfDetail post={post} related={related} /></EditableSiteShell>
  if (task === 'profile') return <EditableSiteShell><ProfileDetail post={post} related={related} /></EditableSiteShell>
  return <EditableSiteShell><ArticleDetail post={post} related={related} comments={comments} /></EditableSiteShell>
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.14em]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function DetailHero({ task, post }: { task: TaskKey; post: SitePost }) {
  const images = getImages(post)
  return (
    <section className="border-b border-black/6 bg-[var(--slot4-page-bg)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-14">
        <div className="self-end">
          <BackLink task={task} />
          <p className="mt-8 text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
          <h1 className="mt-4 text-5xl font-black uppercase leading-[0.92] tracking-[-0.06em] sm:text-6xl lg:text-7xl">{post.title}</h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-black/72">{summaryText(post) || getEditableExcerpt(post, 180)}</p>
        </div>
        <div className="overflow-hidden rounded-[2rem] bg-black">
          <img src={images[0] || getEditablePostImage(post)} alt={post.title} className="aspect-[16/11] h-full w-full object-cover" />
        </div>
      </div>
    </section>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
      <DetailHero task="article" post={post} />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-14">
        <article className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_48px_rgba(24,23,19,0.08)] sm:p-8 lg:p-10">
          <BodyContent post={post} />
          <EditableComments slug={post.slug} comments={comments} />
        </article>
        <RelatedPanel task="article" post={post} related={related} />
      </section>
    </main>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
      <DetailHero task="listing" post={post} />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-14">
        <article className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_48px_rgba(24,23,19,0.08)] sm:p-8">
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={getImages(post).slice(1)} label="Business showcase" />
        </article>
        <aside className="space-y-5">
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </section>
    </main>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
      <DetailHero task="classified" post={post} />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8 lg:py-14">
        <aside className="rounded-[2rem] bg-black p-7 text-white lg:sticky lg:top-24 lg:self-start">
          <div className="grid gap-3">
            {price ? <BadgeLine label="Price" value={price} /> : null}
            {condition ? <BadgeLine label="Condition" value={condition} /> : null}
            {location ? <BadgeLine label="Location" value={location} /> : null}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {phone ? <a href={`tel:${phone}`} className="rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-black">Call now</a> : null}
            {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/15 px-5 py-3 text-sm font-black uppercase tracking-[0.14em]">Email</a> : null}
          </div>
        </aside>
        <article className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_48px_rgba(24,23,19,0.08)] sm:p-8">
          <ImageStrip images={getImages(post)} label="Offer images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="classified" post={post} related={related} />
        </article>
      </section>
    </main>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const heroImage = images[0] || getEditablePostImage(post)
  const gallery = images.length ? images : [heroImage]
  const storyText = summaryText(post) || getEditableExcerpt(post, 220)
  return (
    <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
      <section className="border-b border-black/6 bg-[linear-gradient(180deg,#f3ecde_0%,#fff8ec_100%)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <BackLink task="image" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div>
             
              <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-6xl lg:text-7xl">{post.title}</h1>
             
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white">Image feature</div>
                <div className="rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black/72">
                  {gallery.length} visual{gallery.length === 1 ? '' : 's'}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_190px]">
              <figure className="overflow-hidden rounded-[2rem] bg-black shadow-[0_24px_70px_rgba(24,23,19,0.18)]">
                <img src={heroImage} alt={post.title} className="aspect-[4/5] h-full w-full object-cover" />
              </figure>
              <div className="grid gap-4">
                {gallery.slice(1, 3).map((image, index) => (
                  <figure key={`${image}-${index}`} className="overflow-hidden rounded-[1.5rem] border border-black/8 bg-white shadow-[0_12px_40px_rgba(24,23,19,0.08)]">
                    <img src={image} alt={post.title} className="aspect-[4/5] h-full w-full object-cover" />
                  </figure>
                ))}
                {!gallery.slice(1, 3).length ? (
                  <div className="flex items-center justify-center rounded-[1.5rem] border border-black/8 bg-white p-6 text-center shadow-[0_12px_40px_rgba(24,23,19,0.08)]">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Visual note</p>
                      <p className="mt-3 text-sm leading-7 text-black/62">A focused image page with space for visuals, story context, and related discoveries.</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            
           
          </aside>

          <div className="space-y-8">
            <section className="grid gap-4 md:grid-cols-2">
              {gallery.slice(0, 4).map((image, index) => (
                <figure
                  key={`${image}-feature-${index}`}
                  className={`overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_12px_40px_rgba(24,23,19,0.08)] ${index === 0 ? 'md:col-span-2' : ''}`}
                >
                  <img src={image} alt={post.title} className={`${index === 0 ? 'aspect-[16/9]' : 'aspect-[4/5]'} h-full w-full object-cover`} />
                </figure>
              ))}
            </section>

            <article className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-[0_18px_48px_rgba(24,23,19,0.08)] sm:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Story behind the image</p>
              <BodyContent post={post} compact />
            </article>

            {gallery.length > 4 ? (
              <section>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">More from this set</p>
                    <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em]">Gallery stream</h2>
                  </div>
                </div>
                <div className="mt-5 columns-1 gap-5 space-y-5 md:columns-2">
                  {gallery.slice(4).map((image, index) => (
                    <figure key={`${image}-stream-${index}`} className="break-inside-avoid overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_12px_40px_rgba(24,23,19,0.08)]">
                      <img src={image} alt={post.title} className="w-full object-cover" />
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-[2rem] border border-black/8 bg-[var(--slot4-page-bg)] p-5 shadow-[0_12px_40px_rgba(24,23,19,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Related discovery</p>
                  <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em]">Keep exploring</h2>
                </div>
                <Link href="/image" className="hidden rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white sm:inline-flex">
                  View all images
                </Link>
              </div>
              <div className="mt-5"><RelatedPanel task="image" post={post} related={related} compact /></div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
      <DetailHero task="sbm" post={post} />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-14">
        <article className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-[0_18px_48px_rgba(24,23,19,0.08)] sm:p-10">
          {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
          <BodyContent post={post} />
        </article>
        <RelatedPanel task="sbm" post={post} related={related} />
      </section>
    </main>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
      
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-14">
        <article className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_48px_rgba(24,23,19,0.08)] sm:p-8">
          
          {fileUrl ? (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/8 bg-[var(--slot4-page-bg)]">
              <div className="flex items-center justify-between gap-3 border-b border-black/8 bg-white p-4">
                <span className="text-sm font-black uppercase tracking-[0.14em]">Document preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white">Download <Download className="h-4 w-4" /></Link>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
            </div>
          ) : null}
        </article>
        
      </section>
    </main>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
      <DetailHero task="profile" post={post} />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:px-8 lg:py-14">
        <aside className="rounded-[2rem] border border-black/8 bg-white p-8 text-center shadow-[0_18px_48px_rgba(24,23,19,0.08)] lg:sticky lg:top-24 lg:self-start">
          <div className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-page-bg)]">
            {images[0] ? <img src={images[0]} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 opacity-45" />}
          </div>
          <h1 className="mt-6 text-4xl font-black uppercase leading-[0.96] tracking-[-0.05em]">{post.title}</h1>
          {role ? <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{role}</p> : null}
          <ContactAction website={website} email={email} />
        </aside>
        <article className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-[0_18px_48px_rgba(24,23,19,0.08)] sm:p-10">
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Profile gallery" />
          <RelatedPanel task="profile" post={post} related={related} />
        </article>
      </section>
    </main>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} text-black/82`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.4rem] border border-black/8 bg-[var(--slot4-page-bg)] p-4">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-black/55"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-black/80">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover" />)}
      </div>
    </section>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_12px_40px_rgba(24,23,19,0.08)]">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/55">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-black uppercase tracking-[0.14em]"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-black uppercase tracking-[0.14em]"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] text-white/60">{label}</span><span className="font-black">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="space-y-5">
      {!compact ? (
        <div className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_12px_40px_rgba(24,23,19,0.08)]">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/55">About this post</p>
          <div className="mt-4 grid gap-3 text-sm font-bold text-black/75">
            <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Task: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}</p>
            {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_12px_40px_rgba(24,23,19,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black uppercase tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-black/55">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-[1.5rem] border border-black/8 bg-[var(--slot4-page-bg)] p-3 transition hover:-translate-y-0.5 hover:shadow-lg">
      {image && task !== 'sbm' ? <img src={image} alt={post.title} className="h-20 w-20 shrink-0 rounded-xl object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white"><FileText className="h-6 w-6 opacity-45" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black uppercase leading-tight tracking-[-0.03em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-black/60">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-black/8 bg-[var(--slot4-page-bg)] p-5">
      <div className="flex items-center gap-2 text-lg font-black uppercase tracking-[-0.03em]"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[1.4rem] border border-black/8 bg-white p-4">
            <p className="text-sm font-black uppercase tracking-[0.12em]">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 text-black/70">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-black/60">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
