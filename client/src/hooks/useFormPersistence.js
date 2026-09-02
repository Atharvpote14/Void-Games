import { useEffect, useRef, useCallback } from 'react'

const DEBOUNCE_MS = 800
const STORAGE_PREFIX = 'void-games-draft-'

function getStorageKey(kind, articleId, isEditing) {
  return `${STORAGE_PREFIX}${kind}-${isEditing ? `edit-${articleId}` : 'create'}`
}

function loadDraft(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > 1000 * 60 * 60 * 24 * 7) {
      localStorage.removeItem(key)
      return null
    }
    return data
  } catch {
    return null
  }
}

function saveDraft(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // ignore quota exceeded
  }
}

function clearDraft(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export function useFormPersistence({ kind, article, open, onFormChange }) {
  const keyRef = useRef(getStorageKey(kind, article?._id || article?.id, Boolean(article)))
  const debounceRef = useRef(null)
  const restoredRef = useRef(false)

  useEffect(() => {
    keyRef.current = getStorageKey(kind, article?._id || article?.id, Boolean(article))
  }, [kind, article])

  useEffect(() => {
    if (!open || restoredRef.current) return
    const draft = loadDraft(keyRef.current)
    if (draft) {
      onFormChange(draft)
    }
    restoredRef.current = true
  }, [open, onFormChange])

  const persist = useCallback((form) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveDraft(keyRef.current, form)
    }, DEBOUNCE_MS)
  }, [])

  const clear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    clearDraft(keyRef.current)
  }, [])

  return { persist, clear }
}