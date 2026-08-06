function AdminPageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-extrabold text-text-primary md:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}

export default AdminPageHeader
