// components/ErrorBoundary.jsx
"use client";

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }) {
  return (
    <div className="p-4 bg-red-100 text-red-700 rounded">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}