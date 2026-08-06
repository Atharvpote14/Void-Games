import { Gamepad2 } from 'lucide-react'
import { CATEGORY_ICONS } from '@/utils/categoryIcons'

function CategoryIcon({ icon, className, style }) {
  const Icon =
    typeof icon === 'string' ? CATEGORY_ICONS[icon] || Gamepad2 : icon

  if (!Icon) {
    return (
      <span
        className={className}
        style={{ borderRadius: 9999, background: style?.color || '#2EA8FF' }}
      />
    )
  }

  return <Icon className={className} style={style} />
}

export default CategoryIcon
