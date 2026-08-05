import { ChevronLeft, ChevronRight } from 'lucide-react'

function SliderControls({ onPrev, onNext, className }) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous slide"
        className="grid size-10 cursor-pointer place-items-center rounded-btn border border-border-default bg-white/5 text-text-secondary backdrop-blur-md transition-all duration-300 hover:border-border-hover hover:text-text-primary"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next slide"
        className="grid size-10 cursor-pointer place-items-center rounded-btn border border-border-default bg-white/5 text-text-secondary backdrop-blur-md transition-all duration-300 hover:border-border-hover hover:text-text-primary"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}

export default SliderControls
