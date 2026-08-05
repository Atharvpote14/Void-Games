import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Drawer from '@/components/modal/Drawer/Drawer'
import NavbarMenu from '@/components/navbar/NavbarMenu/NavbarMenu'
import NavbarActions from '@/components/navbar/NavbarActions/NavbarActions'
import SearchInput from '@/components/search/SearchInput/SearchInput'

function MobileNavbar({ open, onClose }) {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const handleSearch = (query) => {
    const trimmed = (query || '').trim()
    if (!trimmed) return
    setValue('')
    onClose()
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <Drawer open={open} onClose={onClose} title="Menu">
      <div className="flex flex-col gap-6">
        <SearchInput
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onSearch={handleSearch}
        />
        <NavbarMenu
          className="flex-col items-stretch gap-1"
          onNavigate={onClose}
        />
        <div className="border-t border-border-default pt-4">
          <NavbarActions />
        </div>
      </div>
    </Drawer>
  )
}

export default MobileNavbar
