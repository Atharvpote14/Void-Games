import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import CategoryIcon from '@/components/category/CategoryIcon/CategoryIcon'

function CategoryCard({ category }) {

  return (
    <Link
      to={`/games?category=${category.slug}`}
      className="group flex flex-col gap-4 rounded-card border border-border-default bg-void-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:shadow-card"
      style={{ '--category-color': category.color || '#2EA8FF' }}
    >
      <div
        className="grid size-12 place-items-center rounded-2xl border bg-white/5 transition-all duration-300 group-hover:bg-white/10"
        style={{ borderColor: 'var(--category-color)' }}
      >
        {category.icon ? (
          <CategoryIcon
            icon={category.icon}
            className="size-6 transition-colors"
            style={{ color: 'var(--category-color)' }}
          />
        ) : (
          <span className="size-6 rounded-full" style={{ background: 'var(--category-color)' }} />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-base font-bold text-text-primary transition-colors group-hover:text-primary">
          {category.name}
        </h3>
        <p className="text-xs text-text-muted">
          {category.game_count > 0
            ? `${category.game_count} games`
            : 'Games available'}
        </p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-text-muted transition-all duration-300 group-hover:gap-2.5 group-hover:text-primary">
        Explore
        <ArrowRight className="size-3.5" />
      </span>
    </Link>
  )
}

export default CategoryCard
