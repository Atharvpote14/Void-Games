import Container from '@/layouts/Container/Container'
import Logo from '@/components/common/Logo/Logo'
import Newsletter from '@/components/footer/Newsletter/Newsletter'
import FooterLinks from '@/components/footer/FooterLinks/FooterLinks'
import FooterSocial from '@/components/footer/FooterSocial/FooterSocial'
import FooterCopyright from '@/components/footer/FooterCopyright/FooterCopyright'
import Divider from '@/layouts/Divider/Divider'
import { SITE_TAGLINE } from '@/constants/site'

function Footer() {
  return (
    <footer className="border-t border-border-default bg-void-footer">
      <Container className="py-14 md:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1.6fr]">
          <div className="flex max-w-sm flex-col gap-5">
            <Logo />
            <p className="text-sm leading-relaxed text-text-muted">
              {SITE_TAGLINE} — game information, system requirements, guides,
              troubleshooting fixes, collections, and download mirrors, all in
              one place.
            </p>
            <FooterSocial />
          </div>
          <FooterLinks className="justify-items-start sm:justify-items-end" />
        </div>

        <Divider className="my-10" />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <h3 className="mb-1.5 font-display text-lg font-bold text-text-primary">
              Join the newsletter
            </h3>
            <p className="mb-4 text-sm text-text-muted">
              Get notified about new games, guides, and fixes.
            </p>
            <Newsletter className="max-w-md" />
          </div>
          <FooterCopyright className="lg:text-right" />
        </div>
      </Container>
    </footer>
  )
}

export default Footer
