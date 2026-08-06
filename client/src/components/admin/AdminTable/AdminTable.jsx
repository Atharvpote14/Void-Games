import { cn } from '@/utils/cn'

function AdminTable({
  columns,
  children,
  loading = false,
  emptyText = 'Nothing found',
  footer,
}) {
  return (
    <div className="overflow-hidden rounded-card border border-border-default bg-void-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border-default bg-white/[0.03]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-4 py-3 text-xs font-semibold tracking-wide text-text-muted uppercase"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4">
                      <div className="h-4 animate-pulse rounded-md bg-white/10" />
                    </td>
                  ))}
                </tr>
              ))
            ) : children ? (
              children
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-text-muted"
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {footer && (
        <div className="border-t border-border-default px-4 py-3">{footer}</div>
      )}
    </div>
  )
}

export function StatusBadge({ active = true, label }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          active ? 'bg-success' : 'bg-danger'
        )}
      />
      {label}
    </span>
  )
}

export default AdminTable
