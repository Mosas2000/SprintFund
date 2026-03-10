import { useEffect, Component, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useWalletStore } from './store/wallet';
import { Layout } from './components/Layout';
import { OfflineBanner } from './components/OfflineBanner';
import { LandingPage } from './pages/Landing';
import { ProposalsPage } from './pages/Proposals';
import { ProposalDetailPage } from './pages/ProposalDetail';
import { CreateProposalPage } from './pages/CreateProposal';
import { DashboardPage } from './pages/Dashboard';

/* ── Error Boundary ──────────────────────────── */

interface EBProps { children: ReactNode }
interface EBState { error: Error | null }

class ErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-dark px-6 py-10 font-mono" role="alert">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-4 text-xl font-bold text-green">
              SprintFund — Runtime Error
            </h1>
            <div className="mb-4 rounded-xl border border-red/20 bg-red/5 p-5">
              <p className="text-sm text-red leading-relaxed whitespace-pre-wrap">
                {this.state.error.message}
              </p>
            </div>
            <details className="mb-6">
              <summary className="cursor-pointer text-xs text-muted hover:text-text transition-colors">
                Stack trace
              </summary>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-surface p-4 text-xs text-muted leading-relaxed whitespace-pre-wrap">
                {this.state.error.stack}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              aria-label="Reload the page to recover from the error"
              className="rounded-lg bg-green px-5 py-2.5 text-sm font-semibold text-dark transition-all hover:bg-green-dim active:scale-95"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ── App ─────────────────────────────────────── */

export default function App() {
  const hydrate = useWalletStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <ErrorBoundary>
      <OfflineBanner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/proposals" element={<ProposalsPage />} />
            <Route path="/proposals/:id" element={<ProposalDetailPage />} />
            <Route path="/proposals/create" element={<CreateProposalPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20" role="alert">
      <h1 className="text-4xl font-bold text-green mb-2">404</h1>
      <p className="text-sm text-muted">Page not found</p>
    </div>
  );
}
