import { SITE_NAME } from '@/constants/site'

function FooterCopyright({ className }) {
  const year = new Date().getFullYear()

  return (
    <p className={`text-xs text-text-disabled ${className || ''}`}>
      © {year} {SITE_NAME}. All rights reserved. {SITE_NAME} provides
      information, guides, and fixes for games. All game names and assets are
      trademarks of their respective owners.
    </p>
  )
}

export default FooterCopyright
