import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { addFavorite, getFavorites, removeFavorite } from '@/services/users'
import { useAuth } from '@/hooks/useAuth'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyIds, setBusyIds] = useState([])
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    getFavorites()
      .then((list) => {
        if (!cancelled) setFavorites(list)
      })
      .catch(() => {
        // favorites stay as-is on failure; retried on next toggle
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user, tick])

  const refresh = useCallback(() => {
    setTick((prev) => prev + 1)
  }, [])

  const isFavorite = useCallback(
    (gameId) => favorites.some((item) => item.game_id === gameId),
    [favorites]
  )

  const toggleFavorite = useCallback(
    async (game) => {
      if (!user) return false
      if (busyIds.includes(game.id)) return null

      setBusyIds((ids) => [...ids, game.id])
      try {
        const existing = favorites.find((item) => item.game_id === game.id)
        if (existing) {
          await removeFavorite(game.id)
          setFavorites((list) => list.filter((item) => item.game_id !== game.id))
          return false
        }
        await addFavorite(game)
        setFavorites((list) => [
          {
            game_id: game.id,
            game_title: game.title,
            game_slug: game.slug,
            game_cover: game.cover_image || game.cover || '',
          },
          ...list,
        ])
        return true
      } finally {
        setBusyIds((ids) => ids.filter((id) => id !== game.id))
      }
    },
    [user, busyIds, favorites]
  )

  const value = useMemo(
    () => ({
      favorites: user ? favorites : [],
      loading: user ? loading : false,
      isFavorite,
      toggleFavorite,
      refresh,
    }),
    [user, favorites, loading, isFavorite, toggleFavorite, refresh]
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export default FavoritesContext
