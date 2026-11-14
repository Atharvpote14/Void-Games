import { useState } from 'react'
import { Heart, Copy, Check, ExternalLink, GitFork, X, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import PageWrapper from '@/layouts/PageWrapper/PageWrapper'
import Container from '@/layouts/Container/Container'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import Button from '@/components/buttons/Button/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import usePageMeta from '@/hooks/usePageMeta'
import { cn } from '@/utils/cn'

const DONATION_OPTIONS = [
  { amount: 5, label: 'Coffee', description: 'Buy me a coffee ☕' },
  { amount: 15, label: 'Supporter', description: 'Monthly server costs 💻' },
  { amount: 50, label: 'Champion', description: 'Major infrastructure 🚀' },
  { amount: 100, label: 'Legend', description: 'Platform sustainability 👑' },
]

const CRYPTO_ADDRESSES = {
  BTC: 'bc1q...your-btc-address',
  ETH: '0x...your-eth-address',
  USDT: '0x...your-usdt-address',
  SOL: '...your-sol-address',
}

export default function Donate() {
  usePageMeta({ title: 'Support Void Games', description: 'Help keep Void Games running with a donation.' })

  const [selectedAmount, setSelectedAmount] = useState(15)
  const [customAmount, setCustomAmount] = useState('')
  const [copied, setCopied] = useState(null)

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <PageWrapper>
      <Container className="flex flex-col gap-10 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 mb-6">
            <Heart className="size-5 text-primary animate-pulse" />
            <span className="text-body-sm font-medium text-primary">Support the Platform</span>
          </div>
          <h1 className="text-display font-bold tracking-tight text-on-surface mb-4">
            Help Keep Void Games Running
          </h1>
          <p className="text-body-lg text-on-surface-muted leading-relaxed">
            Void Games is a passion project built by gamers, for gamers. No ads, no tracking, no paywalls.
            Your support covers server costs, API fees, and development time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {DONATION_OPTIONS.map((option) => (
            <motion.button
              key={option.amount}
              type="button"
              onClick={() => {
                setSelectedAmount(option.amount)
                setCustomAmount('')
              }}
              className={cn(
                'relative p-5 rounded-card border-2 transition-all duration-200 text-left',
                'hover:-translate-y-1 hover:shadow-card-hover',
                selectedAmount === option.amount && !customAmount
                  ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(42,169,224,0.15)]'
                  : 'border-border bg-surface hover:border-primary/30'
              )}
              whileTap={{ scale: 0.98 }}
            >
              {selectedAmount === option.amount && !customAmount && (
                <div className="absolute -top-2 -right-2 size-5 grid place-items-center rounded-full bg-primary text-on-surface text-xs font-bold">
                  ✓
                </div>
              )}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-headline-sm font-bold text-on-surface">${option.amount}</span>
                <span className="text-body-sm text-primary font-medium">{option.label}</span>
              </div>
              <p className="text-body-xs text-on-surface-muted">{option.description}</p>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label className="block text-body-sm font-medium text-on-surface mb-3">Custom Amount</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-muted">$</span>
              <input
                type="number"
                min="1"
                max="10000"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setSelectedAmount(0)
                }}
                placeholder="Enter amount"
                className="w-full pl-8 pr-4 py-3 rounded-input border border-border bg-surface text-on-surface text-body-md placeholder:text-text-muted focus:border-primary focus:shadow-[0_0_0_3px_rgba(42,169,224,0.15)] focus:outline-none transition-colors"
              />
            </div>
            <Button
              type="button"
              onClick={() => {
                if (customAmount && Number(customAmount) >= 1) {
                  setSelectedAmount(Number(customAmount))
                }
              }}
              disabled={!customAmount || Number(customAmount) < 1}
              size="lg"
            >
              Set Amount
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="w-full sm:w-auto gap-3 shadow-[0_0_30px_rgba(42,169,224,0.3)]"
            onClick={() => window.open('https://github.com/sponsors/yourusername', '_blank')}
          >
            <Heart className="size-5" />
            <span>Donate ${selectedAmount || customAmount} via GitHub Sponsors</span>
            <ExternalLink className="size-4" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="divider-editorial my-8"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-headline-sm font-semibold text-on-surface mb-6 text-center">Crypto Donations</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(CRYPTO_ADDRESSES).map(([symbol, address]) => (
              <Card key={symbol} variant="default" className="p-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-body-sm font-medium text-on-surface">
                  <span className="text-primary">{symbol}</span>
                  <Badge variant="neutral" className="text-xs">ERC-20</Badge>
                </div>
                <code className="font-mono text-xs text-on-surface-muted break-all bg-surface px-2 py-1 rounded w-full text-center">{address}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(address, symbol)}
                  className="w-full gap-1.5"
                >
                  {copied === symbol ? (
                    <>
                      <Check className="size-3.5 text-success" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      Copy Address
                    </>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="divider-editorial my-8"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-headline-sm font-semibold text-on-surface mb-6 text-center">Other Ways to Support</h2>
          <div className="grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 flex flex-col items-center gap-3 text-center hover:border-primary/50 transition-colors min-h-[160px]"
            >
              <div className="grid size-14 place-items-center rounded-xl bg-primary/10 text-primary">
                <GitFork className="size-7" />
              </div>
              <span className="text-label-md text-on-surface">Star on GitHub</span>
              <span className="text-body-sm text-on-surface-muted leading-relaxed">Helps others discover the project</span>
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 flex flex-col items-center gap-3 text-center hover:border-primary/50 transition-colors min-h-[160px]"
            >
              <div className="grid size-14 place-items-center rounded-xl bg-sky-500/10 text-sky-400">
                <X className="size-7" />
              </div>
              <span className="text-label-md text-on-surface">Follow on X</span>
              <span className="text-body-sm text-on-surface-muted leading-relaxed">Stay updated on new features</span>
            </a>
            <a
              href="https://discord.gg/yourinvite"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 flex flex-col items-center gap-3 text-center hover:border-primary/50 transition-colors min-h-[160px]"
            >
              <div className="grid size-14 place-items-center rounded-xl bg-violet-500/10 text-violet-400">
                <MessageSquare className="size-7" />
              </div>
              <span className="text-label-md text-on-surface">Join Discord</span>
              <span className="text-body-sm text-on-surface-muted leading-relaxed">Community & feedback</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-body-md text-on-surface-muted max-w-xl mx-auto leading-relaxed">
            Every contribution helps keep Void Games ad-free and independent. Thank you for being part of this journey! 💜
          </p>
        </motion.div>
      </Container>
    </PageWrapper>
  )
}