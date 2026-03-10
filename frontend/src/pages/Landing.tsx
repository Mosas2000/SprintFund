import { Link } from 'react-router-dom';
import { SITE } from '../config';
import { FOCUS_RING_GREEN, FOCUS_RING_MUTED } from '../lib/focus-styles';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const FEATURES = [
  { icon: '⚡', title: 'Lightning Grants', desc: '$50–200 STX micro-grants funded in hours, not months.' },
  { icon: '🗳️', title: 'Quadratic Voting', desc: 'Fair voting where voice matters more than wealth.' },
  { icon: '🔒', title: 'On-Chain', desc: 'Every stake, vote, and payout is verifiable on Stacks.' },
  { icon: '🚀', title: 'Permissionless', desc: 'Anyone with 10 STX staked can propose and vote.' },
] as const;

const STEPS = [
  { num: '01', title: 'Stake STX', desc: 'Stake 10+ STX to unlock proposal creation and voting power.' },
  { num: '02', title: 'Propose', desc: 'Submit your idea with a title, description, and requested amount.' },
  { num: '03', title: 'Vote', desc: 'Community votes using quadratic weight — fair and sybil-resistant.' },
  { num: '04', title: 'Execute', desc: 'Passing proposals auto-send funds to the proposer on-chain.' },
] as const;

export function LandingPage() {
  useDocumentTitle('Home');

  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────── */}
      <section aria-labelledby="hero-heading" className="flex items-center justify-center py-12 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="mb-4 inline-block rounded-full border border-green/20 bg-green/5 px-4 py-1 text-xs font-medium text-green">
            Live on Stacks Mainnet
          </div>
          <h1 id="hero-heading" className="mb-4 text-3xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">
            Fund Ideas.<br />
            <span className="text-green">Ship Fast.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-base text-muted sm:text-lg">
            {SITE.description}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/proposals"
              className={`w-full sm:w-auto rounded-lg bg-green px-6 py-3 text-sm font-semibold text-dark text-center transition-all hover:bg-green-dim hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] active:scale-95 min-h-[44px] ${FOCUS_RING_GREEN}`}
            >
              Browse Proposals
            </Link>
            <Link
              to="/dashboard"
              className={`w-full sm:w-auto rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text text-center transition-colors hover:border-green/40 hover:text-green min-h-[44px] ${FOCUS_RING_MUTED}`}
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────── */}
      <section aria-labelledby="features-heading" className="border-t border-border py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 id="features-heading" className="mb-10 text-center text-2xl font-bold text-text">How It Works</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-5 text-center transition-colors hover:border-green/20">
                <div className="mb-3 text-2xl" aria-hidden="true">{f.icon}</div>
                <h3 className="mb-1.5 text-sm font-semibold text-text">{f.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Steps ────────────────────────────── */}
      <section aria-labelledby="steps-heading" className="border-t border-border py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 id="steps-heading" className="mb-10 text-center text-2xl font-bold text-text">Get Started</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.num} className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-green/20">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-green/10 text-xs font-bold text-green">
                  {s.num}
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-text">{s.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
