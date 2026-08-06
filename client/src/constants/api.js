export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

export const ENDPOINTS = {
  AUTH: {
    GOOGLE: '/auth/google',
    USER: '/auth/user',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    PROFILE: '/users/profile',
    FAVORITES: '/users/favorites',
    FAVORITE_BY_GAME: (gameId) => `/users/favorites/${gameId}`,
    DOWNLOAD_HISTORY: '/users/download-history',
    DOWNLOAD_RECORD: (id) => `/users/download-history/${id}`,
  },
  GAMES: {
    ALL: '/games',
    TRENDING: '/games/trending',
    LATEST: '/games/latest',
    POPULAR: '/games/popular',
    FEATURED: '/games/featured',
    RECOMMENDED: '/games/recommended',
    BY_SLUG: (slug) => `/games/${slug}`,
  },
  SEARCH: '/search',
  DOWNLOADS: {
    MIRRORS: (gameId) => `/download/${gameId}`,
    START: '/download/start',
    REDIRECT: (id) => `/download/redirect/${id}`,
  },
  CATEGORIES: {
    ALL: '/categories',
    BY_SLUG: (slug) => `/categories/${slug}`,
  },
  COLLECTIONS: {
    ALL: '/collections',
    BY_SLUG: (slug) => `/collections/${slug}`,
  },
  GUIDES: {
    ALL: '/guides',
    BY_SLUG: (slug) => `/guides/${slug}`,
    CATEGORIES: '/guides/categories',
  },
  FIXES: {
    ALL: '/fixes',
    BY_SLUG: (slug) => `/fixes/${slug}`,
    CATEGORIES: '/fixes/categories',
  },
  COMMENTS: {
    BY_GAME: (gameId) => `/comments/${gameId}`,
    ALL: '/comments',
    BY_ID: (id) => `/comments/${id}`,
  },
  RATINGS: {
    ALL: '/ratings',
    BY_GAME: (gameId) => `/ratings/${gameId}`,
  },
  REPORTS: '/reports',
  CONTACT: '/contact',
  NEWSLETTER: '/newsletter',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    GAMES: '/admin/games',
    GAME_BY_ID: (id) => `/admin/games/${id}`,
    GAME_PICKER: '/admin/games/picker',
    SCREENSHOTS: '/admin/screenshots',
    BANNER: '/admin/banner',
    DOWNLOAD_LINK: '/admin/download-link',
    CATEGORY: '/admin/category',
    CATEGORIES: '/admin/categories',
    CATEGORY_BY_ID: (id) => `/admin/category/${id}`,
    COLLECTION: '/admin/collection',
    COLLECTIONS: '/admin/collections',
    COLLECTION_BY_ID: (id) => `/admin/collections/${id}`,
    FIX: '/admin/fix',
    FIXES: '/admin/fixes',
    FIX_BY_ID: (id) => `/admin/fixes/${id}`,
    GUIDE: '/admin/guide',
    GUIDES: '/admin/guides',
    GUIDE_BY_ID: (id) => `/admin/guides/${id}`,
    COMMENT_BY_ID: (id) => `/admin/comment/${id}`,
    USERS: '/admin/users',
    USER_BY_ID: (id) => `/admin/user/${id}`,
  },
  STATS: {
    HOME: '/stats/home',
    DOWNLOADS: '/stats/downloads',
    POPULAR: '/stats/popular',
  },
}

export const DOWNLOAD_PROVIDERS = [
  'Terabox',
  'Pixeldrain',
  'GoFile',
  'MEGA',
  'Google Drive',
  'MediaFire',
]
