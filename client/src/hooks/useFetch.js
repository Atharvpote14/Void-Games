import { useCallback, useEffect, useRef, useState } from 'react'

export default function useFetch(fetcher, deps = [], options = {}) {
  const [data, setData] = useState(options.initialData ?? null)
  const [loading, setLoading] = useState(options.enabled ?? true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)
  const fetcherRef = useRef(fetcher)

  useEffect(() => {
    fetcherRef.current = fetcher
  })

  useEffect(() => {
    if (options.enabled === false) return
    let cancelled = false

    const run = async () => {
      try {
        const result = await fetcherRef.current()
        if (!cancelled) {
          setError(null)
          setData(result)
        }
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const refetch = useCallback(() => {
    setTick((prev) => prev + 1)
  }, [])

  return { data, loading, error, refetch }
}
