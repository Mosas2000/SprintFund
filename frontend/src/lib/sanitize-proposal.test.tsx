import { describe, it, expect } from 'vitest';
import { sanitizeProposal, sanitizeProposals } from './sanitize-proposal';
import type { Proposal } from '../types';

function makeProposal(overrides: Partial<Proposal> = {}): Proposal {
  return {
    id: 1,
    proposer: 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T',
    amount: 1000000,
    title: 'Community Grant',
    description: 'Fund the community grant program.',
    votesFor: 10,
    votesAgainst: 5,
    executed: false,
    createdAt: 100,
    ...overrides,
  };
}

describe('sanitizeProposal', () => {
  it('returns sanitized proposal with clean data unchanged', () => {
    const proposal = makeProposal();
    const result = sanitizeProposal(proposal);
    expect(result.title).toBe('Community Grant');
    expect(result.description).toBe('Fund the community grant program.');
  });

  it('strips HTML tags from title', () => {
    const proposal = makeProposal({ title: '<b>Malicious</b> Proposal' });
    const result = sanitizeProposal(proposal);
    expect(result.title).toBe('Malicious Proposal');
  });

  it('strips script tags from description', () => {
    const proposal = makeProposal({
      description: '<script>alert("xss")</script>Normal content',
    });
    const result = sanitizeProposal(proposal);
    expect(result.description).not.toContain('<script>');
    expect(result.description).toContain('Normal content');
  });

  it('preserves newlines in description', () => {
    const proposal = makeProposal({
      description: 'Line one\nLine two\nLine three',
    });
    const result = sanitizeProposal(proposal);
    expect(result.description).toBe('Line one\nLine two\nLine three');
  });

  it('does not modify numeric fields', () => {
    const proposal = makeProposal({ amount: 5000000, votesFor: 42 });
    const result = sanitizeProposal(proposal);
    expect(result.amount).toBe(5000000);
    expect(result.votesFor).toBe(42);
  });

  it('does not modify boolean fields', () => {
    const proposal = makeProposal({ executed: true });
    const result = sanitizeProposal(proposal);
    expect(result.executed).toBe(true);
  });

  it('does not modify the proposer address', () => {
    const addr = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
    const proposal = makeProposal({ proposer: addr });
    const result = sanitizeProposal(proposal);
    expect(result.proposer).toBe(addr);
  });

  it('handles null-ish title gracefully', () => {
    const proposal = makeProposal({ title: '' });
    const result = sanitizeProposal(proposal);
    expect(result.title).toBe('');
  });

  it('strips event handlers from title', () => {
    const proposal = makeProposal({ title: 'Normal onerror=alert(1)' });
    const result = sanitizeProposal(proposal);
    expect(result.title).not.toContain('onerror=');
  });

  it('strips HTML entities from description', () => {
    const proposal = makeProposal({
      description: '&lt;script&gt;alert(1)&lt;/script&gt;',
    });
    const result = sanitizeProposal(proposal);
    expect(result.description).not.toContain('&lt;');
  });
});

describe('sanitizeProposals', () => {
  it('sanitizes all proposals in the array', () => {
    const proposals = [
      makeProposal({ title: '<b>First</b>' }),
      makeProposal({ id: 2, title: '<i>Second</i>' }),
    ];
    const results = sanitizeProposals(proposals);
    expect(results).toHaveLength(2);
    expect(results[0].title).toBe('First');
    expect(results[1].title).toBe('Second');
  });

  it('returns empty array for empty input', () => {
    expect(sanitizeProposals([])).toEqual([]);
  });
});
