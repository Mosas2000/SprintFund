import { useEffect, Component, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useWalletStore } from './store/wallet';
import { Layout } from './components/Layout';
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
        <div style={{ background: '#050505', color: '#ff4444', minHeight: '100vh', padding: '2rem', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#00ff88', fontSize: '1.5rem', marginBottom: '1rem' }}>SprintFund — Runtime Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem', color: '#ff8888' }}>
            {this.state.error.message}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem', color: '#888', marginTop: '1rem' }}>
            {this.state.error.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#00ff88', color: '#050505', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload
          </button>
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
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold text-green mb-2">404</h1>
      <p className="text-sm text-muted">Page not found</p>
    </div>
  );
}
