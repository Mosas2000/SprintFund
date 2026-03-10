export function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-border bg-dark py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} SprintFund DAO
          </p>
          <nav aria-label="Footer links" className="flex items-center gap-4 text-sm">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SprintFund on GitHub (opens in new tab)"
              className="text-muted hover:text-green transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
