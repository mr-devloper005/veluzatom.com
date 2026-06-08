import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Image sharing, collections, and visual stories',
      description: 'Browse image-led posts, creator notes, visual discoveries, and curated collections through a premium editorial layout.',
      openGraphTitle: 'Image sharing, collections, and visual stories',
      openGraphDescription: 'Explore image-first posts, creator highlights, and curated visual collections through a premium editorial layout.',
      keywords: ['image sharing', 'visual stories', 'photo community', 'creative archive'],
    },
    hero: {
      badge: '',
      title: ['Everything image', 'lovers need'],
      description: 'Capture fresh inspiration, browse striking uploads, follow creator voices, and keep your favorite visual finds in one refined place.',
      primaryCta: { label: 'Explore visuals', href: '/image' },
      secondaryCta: { label: 'Open archive', href: '/article' },
      searchPlaceholder: 'Search image stories, creator pages, collections, and more',
      focusLabel: 'Focus',
      featureCardBadge: 'editor selection',
      featureCardTitle: 'A homepage shaped by rich imagery, strong hierarchy, and fast discovery.',
      featureCardDescription: 'Recent posts, community picks, and image-led browsing stay front and center without changing the existing content engine.',
    },
    intro: {
      badge: 'About the platform',
      title: 'Built for visual browsing, careful discovery, and a richer reading rhythm.',
      paragraphs: [
        'This site brings together image-first browsing, editorial reading, and structured discovery so visitors can move naturally between visuals, collections, and supporting pages.',
        'Instead of separating galleries, stories, and resources into disconnected surfaces, the experience keeps them linked through calmer navigation and stronger visual cues.',
        'Whether someone starts with a single image, a visual essay, or a resource page, they can continue exploring without losing momentum.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Image-led homepage with stronger emphasis on visual discovery.',
        'Connected sections for stories, visuals, profiles, and supporting resources.',
        'Luxury-inspired rhythm designed to make exploration feel memorable.',
        'Lightweight interactions that keep the experience fast and readable.',
      ],
      primaryLink: { label: 'Browse stories', href: '/article' },
      secondaryLink: { label: 'See visuals', href: '/image' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Explore image sharing with a richer visual rhythm.',
      description: 'Move between image-led posts, editorial stories, creator pages, and useful resources through one polished visual system.',
      primaryCta: { label: 'Browse Images', href: '/image' },
      secondaryCta: { label: 'Contact Us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'Our Story',
    title: 'A more elegant home for image sharing and visual discovery.',
    description: `${slot4BrandConfig.siteName} is built for people who love collecting, sharing, and revisiting strong visuals in a cleaner and more atmospheric way.`,
    paragraphs: [
      'Instead of splitting visuals, stories, and useful references into disconnected pages, the platform keeps them close together so browsing feels natural and rewarding.',
      'Whether someone starts with a single image, a creator profile, a story, or a saved resource, they can keep exploring without losing the mood or the context.',
      'The goal is simple: make image sharing feel polished, memorable, and easy to return to.',
    ],
    values: [
      {
        title: 'Visual-first experience',
        description: 'We prioritize strong imagery, clean pacing, and careful spacing so browsing always feels calm and intentional.',
      },
      {
        title: 'Connected discovery',
        description: 'Image posts, articles, resources, and profiles stay linked so visitors can move from one visual lead to the next without friction.',
      },
      {
        title: 'Premium and practical',
        description: 'We focus on strong hierarchy, elegant motion, and useful page structure so visitors can find the right image, story, or profile faster.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Reach out with a collaboration, question, or publishing idea.',
    description: 'Tell us what you want to share, improve, or launch. We will route your message to the right lane without making the process feel generic.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find visuals, stories, collections, and creator pages faster.',
      description: 'Use keywords, categories, and content types to discover posts from every active section of the site.',
      placeholder: 'Search by keyword, topic, category, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to open the publishing studio.',
      description: 'Use your account to open the publishing workspace and prepare new posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create polished posts for every active section.',
      description: 'Choose a content type, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your studio.',
      description: 'Login to keep browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Join the image-sharing studio.',
      description: 'Create an account to save your place, open the publishing workspace, and start sharing visuals through a cleaner, more curated experience.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
