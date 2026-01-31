import React from "react";

type State = { hasError: boolean; error?: Error | null };

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console for now - could be sent to remote logging.
    // eslint-disable-next-line no-console
    console.error("Uncaught error in React tree:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
          <div className="max-w-2xl w-full bg-card p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">An error occurred while rendering the app. See details below.</p>
            <div className="mb-4">
              <pre className="whitespace-pre-wrap text-xs bg-muted p-3 rounded">{String(this.state.error)}</pre>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-2 rounded bg-primary text-primary-foreground"
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
              <button
                className="px-3 py-2 rounded border"
                onClick={() => {
                  // Open console suggestion
                  // eslint-disable-next-line no-alert
                  alert('Open the browser console (F12) to see the full stack trace.');
                }}
              >
                Open Console
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
