import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchInput from '@/components/search/SearchInput/SearchInput'

function NavbarSearch({ className }) {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const handleSearch = (query) => {
    const trimmed = (query || '').trim()
    if (!trimmed) return
    setValue('')
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <SearchInput
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onSearch={handleSearch}
      size="sm"
      className={className}
      inputClassName="bg-void-bg-secondary/80"
    />
  )
}

export default NavbarSearch
