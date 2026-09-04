export const BUTTON_VARIANTS = {
  primary:
    'bg-btn-primary text-white shadow-btn-primary hover:shadow-btn-primary-hover',
  secondary:
    'bg-btn-secondary text-void-bg shadow-btn-secondary hover:shadow-glow-cyan',
  outline:
    'border-2 border-border-subtle text-text-primary hover:border-primary hover:bg-primary/10',
  ghost:
    'bg-transparent text-text-secondary hover:bg-white/5 hover:text-text-primary',
  danger:
    'border-2 border-danger/40 bg-danger/10 text-danger hover:bg-danger/20 hover:border-danger',
  success:
    'border-2 border-success/40 bg-success/10 text-success hover:bg-success/20 hover:border-success',
}

export const BUTTON_SIZES = {
  sm: 'h-9 gap-1.5 px-4 text-xs rounded-btn',
  md: 'h-11 gap-2 px-6 text-sm rounded-btn',
  lg: 'h-13 gap-2 px-8 text-base rounded-btn',
  icon: 'size-10 p-0 rounded-btn',
}