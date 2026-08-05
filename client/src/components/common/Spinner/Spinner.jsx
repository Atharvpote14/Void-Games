function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'size-3.5 border-2',
    sm: 'size-4.5 border-2',
    md: 'size-6 border-[3px]',
    lg: 'size-9 border-4',
  }

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-current border-t-transparent ${sizeClasses[size]} ${className}`}
    />
  )
}

export { Spinner }
