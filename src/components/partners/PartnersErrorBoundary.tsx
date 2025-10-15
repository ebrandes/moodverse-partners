import { Component, ReactNode } from "react";

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null | undefined;
}

export default class PartnersErrorBoundary extends Component<
  { children: ReactNode; componentName?: string },
  State
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: error.stack || "Unknown error" };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.PROD) {
      // TODO: hook Sentry if needed
      console.error("Partners Error:", {
        error: error.message,
        stack: error.stack,
        component: this.props.componentName,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
    }
    this.setState({ error, errorInfo: errorInfo.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e5e5] rounded-xl max-w-md w-full p-6">
            <h3 className="text-[#b45309] font-semibold mb-2">
              Partners Portal Error
            </h3>
            <p className="text-[#555] text-sm mb-4">
              A problem occurred while loading{" "}
              {this.props.componentName || "this section"}.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="bg-[#f7f7f7] p-3 rounded-lg">
                <summary className="font-semibold text-[#b91c1c] cursor-pointer mb-2">
                  Error details (dev)
                </summary>
                <div className="text-xs text-[#333] whitespace-pre-wrap max-h-40 overflow-auto">
                  {this.state.errorInfo}
                </div>
              </details>
            )}
            <button
              onClick={() =>
                this.setState({ hasError: false, error: null, errorInfo: null })
              }
              className="mt-4 px-3 py-2 rounded-lg bg-black text-white"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
