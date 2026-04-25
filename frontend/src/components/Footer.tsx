import { CONTRACT_NAME } from '@/config';

export function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-border bg-dark py-6 sm:py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <p className="text-xs sm:text-sm text-muted">
            &copy; {new Date().getFullYear()} SprintFund DAO
          </p>
          <nav aria-label="Footer links" className="flex items-center gap-4 text-sm">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-dark/50 rounded-full border border-border">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-muted uppercase tracking-wider">
                {CONTRACT_NAME}
              </span>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SprintFund on GitHub (opens in new tab)"
              className="text-muted hover:text-green transition-colors py-2 min-h-[44px] flex items-center"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
