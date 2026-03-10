import { Link, useLocation } from 'react-router-dom';
import { ConnectWallet } from './ConnectWallet';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/proposals', label: 'Proposals' },
  { to: '/dashboard', label: 'Dashboard' },
] as const;

export function Header() {
  const { pathname } = useLocation();

  return (
    <header role="banner" className="sticky top-0 z-50 border-b border-border bg-dark/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link to="/" aria-label="SprintFund home" className="flex items-center gap-2 text-green font-bold text-lg tracking-tight select-none">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <rect width="32" height="32" rx="8" fill="#00ff88" fillOpacity="0.12" />
            <text x="5" y="23" fontFamily="monospace" fontWeight="700" fontSize="18" fill="#00ff88">SF</text>
          </svg>
          <span className="hidden sm:inline">SprintFund</span>
        </Link>

        {/* Nav */}
        <nav aria-label="Main navigation" className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? 'bg-green/10 text-green'
                    : 'text-muted hover:text-text hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="ml-2">
            <ConnectWallet />
          </div>
        </nav>
      </div>
    </header>
  );
}
