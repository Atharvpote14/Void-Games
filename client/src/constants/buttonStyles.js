export const BUTTON_VARIANTS = {
  primary:
    'inline-flex items-center justify-center gap-2 bg-primary text-on-surface font-semibold text-label-md rounded-btn h-11 px-6 transition-colors duration-150 hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'inline-flex items-center justify-center gap-2 bg-transparent text-tertiary font-semibold text-label-md rounded-btn h-11 px-6 border border-border transition-colors duration-150 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral disabled:opacity-50 disabled:cursor-not-allowed',
  outline:
    'inline-flex items-center justify-center gap-2 bg-transparent text-on-surface font-semibold text-label-md rounded-btn h-11 px-6 border-2 border-border transition-colors duration-150 hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral disabled:opacity-50 disabled:cursor-not-allowed',
  ghost:
    'inline-flex items-center justify-center gap-2 bg-transparent text-on-surface-muted font-semibold text-label-md rounded-btn h-11 px-6 transition-colors duration-150 hover:text-on-surface hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral disabled:opacity-50 disabled:cursor-not-allowed',
  destructive:
    'inline-flex items-center justify-center gap-2 bg-error/20 text-error font-semibold text-label-md rounded-btn h-11 px-6 border border-error/30 transition-colors duration-150 hover:bg-error/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 focus-visible:ring-offset-neutral disabled:opacity-50 disabled:cursor-not-allowed',
  success:
    'inline-flex items-center justify-center gap-2 bg-success/20 text-success font-semibold text-label-md rounded-btn h-11 px-6 border border-success/30 transition-colors duration-150 hover:bg-success/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 focus-visible:ring-offset-neutral disabled:opacity-50 disabled:cursor-not-allowed',
}

export const BUTTON_SIZES = {
  sm: 'h-9 px-4 text-body-sm',
  md: '',
  lg: 'h-12 px-8 text-label-lg',
  icon: 'h-11 w-11 p-0',
}