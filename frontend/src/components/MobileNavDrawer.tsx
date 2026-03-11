import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectWallet } from './ConnectWallet';
import { FOCUS_RING_GREEN } from '../lib/focus-styles';

interface NavItem {
  readonly to: string;
  readonly label: string;
}

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: readonly NavItem[];
}

/**
 * Slide-down mobile navigation drawer.
 *
 * Appears below the header on small viewports. Includes all
 * navigation links and the wallet connect button in a vertical layout.
 * Traps focus within the drawer when open.
 */
export function MobileNavDrawer({ isOpen, onClose, navItems }: MobileNavDrawerProps) {
  const { pathname } = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

  /* Focus the first link when the drawer opens */
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const firstLink = drawerRef.current.querySelector<HTMLElement>('a, button');
      if (firstLink) {
        requestAnimationFrame(() => firstLink.focus());
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-label="Navigation menu"
      className="border-b border-border bg-dark/95 backdrop-blur-md sm:hidden"
    >
      <nav aria-label="Mobile navigation" className="mx-auto max-w-5xl px-4 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors min-h-[44px] flex items-center ${FOCUS_RING_GREEN} ${
                    active
                      ? 'bg-green/10 text-green'
                      : 'text-muted hover:text-text hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 border-t border-border pt-4 px-4">
          <ConnectWallet />
        </div>
      </nav>
    </div>
  );
}
