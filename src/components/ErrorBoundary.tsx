import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
          <div className="text-center p-8">
            <div className="text-5xl mb-4">🏠</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              出了点小问题
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              刷新页面通常会解决这个问题
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-5 py-2 bg-rose-400 text-white rounded-full text-sm hover:bg-rose-500 transition-colors cursor-pointer"
            >
              再试一次
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
