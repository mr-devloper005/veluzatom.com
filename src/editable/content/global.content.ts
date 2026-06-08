import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || '',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: '',
    primaryLinks: [
      { label: 'Stories', href: '/article' },
      { label: 'Images', href: '/image' },
      { label: 'Profiles', href: '/profile' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Start exploring', href: '/' },
      secondary: { label: 'Get in touch', href: '/contact' },
    },
  },
  footer: {
    tagline: 'A refined home for images and visual stories',
    description: 'Discover image-led posts, editor picks, creator pages, useful resources, and polished archives through one premium browsing experience.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Stories', href: '/article' },
          { label: 'Image Gallery', href: '/image' },
          { label: 'Profiles', href: '/profile' },
          { label: 'PDF Library', href: '/pdf' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Designed for image lovers who like depth, order, and atmosphere.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
