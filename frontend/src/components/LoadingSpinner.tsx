export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div 
          className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-green"
          role="status"
          aria-label="Loading"
        />
        <p className="text-sm text-muted">Loading...</p>
      </div>
    </div>
  );
}
