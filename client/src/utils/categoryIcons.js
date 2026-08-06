import {
  Swords,
  Shield,
  Crosshair,
  Car,
  Ghost,
  Map,
  Dumbbell,
  Globe,
  Gamepad2,
} from 'lucide-react'

export const CATEGORY_ICONS = {
  Swords,
  Shield,
  Crosshair,
  Car,
  Ghost,
  Map,
  Dumbbell,
  Globe,
  Gamepad2,
}

export function resolveCategoryIcon(icon) {
  if (!icon) return null
  if (typeof icon !== 'string') return icon
  return CATEGORY_ICONS[icon] || Gamepad2
}
