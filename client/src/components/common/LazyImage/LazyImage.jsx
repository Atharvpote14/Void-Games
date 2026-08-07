import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

function LazyImage({ src, alt = '', className, ...props }) {
  const [isVisible, setIsVisible] = useState(
    () => typeof IntersectionObserver === 'undefined'
  )
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (isVisible) return
    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '200px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [isVisible])

  if (!isVisible) {
    return (
      <div
        ref={containerRef}
        aria-hidden="true"
        className={cn('animate-pulse bg-void-card', className)}
      />
    )
  }

  return (
    <img
      ref={containerRef}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={cn(
        'transition-opacity duration-500',
        loaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      {...props}
    />
  )
}

export default LazyImage
