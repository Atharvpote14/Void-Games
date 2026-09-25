export const BUTTON_VARIANTS = {
  primary:
    'relative overflow-hidden bg-gradient-to-br from-gold via-gold-soft to-gold-deep text-void-deep shadow-[0_0_20px_rgba(212,175,100,0.35),0_4px_15px_rgba(212,175,100,0.2)] hover:shadow-[0_0_40px_rgba(212,175,100,0.5),0_8px_30px_rgba(212,175,100,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300',
  secondary:
    'bg-void-card-elevated text-gold border border-gold/30 shadow-inner hover:bg-void-card-hover hover:border-gold/60 hover:text-gold-soft hover:-translate-y-1 transition-all duration-300',
  outline:
    'border border-white/15 bg-white/[0.03] text-text-primary backdrop-blur-sm hover:border-gold/60 hover:text-gold hover:bg-gold/[0.08] hover:-translate-y-1 transition-all duration-300',
  ghost:
    'bg-transparent text-text-secondary hover:bg-white/[0.08] hover:text-text-primary hover:-translate-y-0.5 transition-all duration-300',
  danger:
    'border border-danger/50 bg-danger/15 text-danger hover:bg-danger/25 hover:border-danger/70 hover:-translate-y-0.5 transition-all duration-300',
  success:
    'border border-success/50 bg-success/15 text-success hover:bg-success/25 hover:border-success/70 hover:-translate-y-0.5 transition-all duration-300',
}

export const BUTTON_SIZES = {
  sm: 'h-9 gap-1.5 px-4 text-xs rounded-btn',
  md: 'h-11 gap-2 px-6 text-sm rounded-btn',
  lg: 'h-13 gap-2 px-8 text-base rounded-btn',
  icon: 'size-10 p-0 rounded-btn',
}
