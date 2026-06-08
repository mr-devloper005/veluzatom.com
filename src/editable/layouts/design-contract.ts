import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#fff8ec',
  '--slot4-page-text': '#181713',
  '--slot4-panel-bg': '#f5eedf',
  '--slot4-surface-bg': '#fffdf8',
  '--slot4-muted-text': '#675f52',
  '--slot4-soft-muted-text': '#7e7769',
  '--slot4-accent': '#546b41',
  '--slot4-accent-fill': '#546b41',
  '--slot4-accent-soft': '#99ad7a',
  '--slot4-dark-bg': '#151512',
  '--slot4-dark-text': '#fff8ec',
  '--slot4-media-bg': '#dcccac',
  '--slot4-cream': '#fff8ec',
  '--slot4-warm': '#f3ecde',
  '--slot4-lavender': '#e4dcc9',
  '--slot4-gray': '#efe8da',
  '--slot4-body-gradient': 'radial-gradient(circle at top right, rgba(153,173,122,0.16), transparent 24%), linear-gradient(180deg, #fff8ec 0%, #f7f0e0 44%, #f0e7d5 100%)',
  '--editable-container': '1440px',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-black/[0.06]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_12px_40px_rgba(24,23,19,0.08)]',
  shadowStrong: 'shadow-[0_24px_80px_rgba(24,23,19,0.2)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.74))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[180px] shrink-0 snap-start sm:w-[220px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.28em]',
    heroTitle: 'text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-6xl lg:text-[6.2rem]',
    sectionTitle: 'text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-5xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center rounded-full ${editablePalette.darkBg} px-8 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5`,
    secondary: `inline-flex items-center justify-center rounded-full border ${editablePalette.border} ${editablePalette.surfaceBg} px-8 py-3.5 text-sm font-black uppercase tracking-[0.18em] ${editablePalette.surfaceText} transition hover:bg-black/[0.03]`,
    accent: `inline-flex items-center justify-center rounded-full ${editablePalette.accentBg} px-8 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.5rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[2/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(24,23,19,0.16)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Keep the luxury image-sharing palette rooted in olive, sage, parchment, and deep charcoal.',
  'Use the homepage sections to deliver a bold, VSCO-inspired editorial composition with strong type and dark/light contrast blocks.',
  'Keep dynamic post fetching intact and never replace real content with hardcoded feed arrays.',
  'Use postHref() for post links so task-specific routes keep working.',
  'Support missing image, summary, and category values without collapsing the layout.',
  'Use more than one card design so the site feels curated instead of templated.',
] as const
