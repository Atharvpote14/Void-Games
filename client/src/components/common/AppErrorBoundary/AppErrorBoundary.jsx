import { Component } from 'react'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-void-bg px-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-void-card shadow-card">
            <span className="text-3xl font-bold text-gradient">V</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            Something went wrong
          </h1>
          <p className="max-w-md text-text-muted">
            An unexpected error occurred while rendering this page. Please
            reload to continue.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="cursor-pointer rounded-btn bg-btn-gradient px-6 py-3 font-semibold text-white shadow-btn transition-transform duration-300 hover:-translate-y-0.5"
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
