import { useEffect } from 'react'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/constants/site'

function setMeta(property, content) {
  if (!content) return
  let tag = document.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setLink(rel, href) {
  let tag = document.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

export default function usePageMeta({
  title = '',
  description = SITE_DESCRIPTION,
  image = '',
  type = 'website',
  path = '',
  keywords = '',
} = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    const canonicalUrl = `${SITE_URL}${path}`

    document.title = fullTitle
    setMeta('description', description)
    setMeta('keywords', keywords)
    setMeta('og:title', fullTitle)
    setMeta('og:description', description)
    setMeta('og:type', type)
    setMeta('og:url', canonicalUrl)
    setMeta('og:image', image)
    setMeta('og:site_name', SITE_NAME)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)
    setLink('canonical', canonicalUrl)

    return () => {
      setLink('canonical', `${SITE_URL}/`)
    }
  }, [title, description, image, type, path, keywords])
}
