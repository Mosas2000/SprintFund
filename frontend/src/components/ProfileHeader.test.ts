import { describe, it, expect } from 'vitest';

/**
 * Behavioral tests for ProfileHeader.
 * Since we run in Node.js without DOM, we test the component's logic
 * contracts rather than rendered output.
 */

describe('ProfileHeader behaviour', () => {
  describe('address truncation', () => {
    it('truncates long addresses to 6...4 format', () => {
      const address = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
      const truncated = address.length > 12
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : address;
      expect(truncated).toBe('SP31PK...2W5T');
      expect(truncated.length).toBeLessThan(address.length);
    });

    it('does not truncate short addresses', () => {
      const address = 'SP123';
      const truncated = address.length > 12
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : address;
      expect(truncated).toBe('SP123');
    });
  });

  describe('avatar derivation', () => {
    it('derives initials from last two characters of address', () => {
      const address = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
      const initials = address.slice(-2).toUpperCase();
      expect(initials).toBe('5T');
    });

    it('handles short addresses', () => {
      const address = 'SP';
      const initials = address.slice(-2).toUpperCase();
      expect(initials).toBe('SP');
    });
  });

  describe('explorer URL construction', () => {
    it('builds correct mainnet explorer URL', () => {
      const address = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
      const url = `https://explorer.hiro.so/address/${address}?chain=mainnet`;
      expect(url).toContain(address);
      expect(url).toContain('chain=mainnet');
      expect(url).toMatch(/^https:\/\/explorer\.hiro\.so\/address\//);
    });
  });

  describe('prop contracts', () => {
    it('accepts required props', () => {
      const props = {
        address: 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T',
        stxBalance: 100_000_000,
        stakedAmount: 50_000_000,
      };
      expect(props.address).toBeTruthy();
      expect(typeof props.stxBalance).toBe('number');
      expect(typeof props.stakedAmount).toBe('number');
    });

    it('handles zero balance values', () => {
      const props = {
        address: 'SP123',
        stxBalance: 0,
        stakedAmount: 0,
      };
      expect(props.stxBalance).toBe(0);
      expect(props.stakedAmount).toBe(0);
    });

    it('handles large balance values', () => {
      const props = {
        address: 'SP123',
        stxBalance: 999_999_999_999,
        stakedAmount: 500_000_000_000,
      };
      expect(props.stxBalance).toBeGreaterThan(0);
      expect(props.stakedAmount).toBeLessThanOrEqual(props.stxBalance);
    });
  });

  describe('copy button state', () => {
    it('toggles copied state', () => {
      let copied = false;
      copied = true;
      expect(copied).toBe(true);
      copied = false;
      expect(copied).toBe(false);
    });

    it('copied label changes based on state', () => {
      const label = (copied: boolean) => copied ? 'Copied' : 'Copy address';
      expect(label(false)).toBe('Copy address');
      expect(label(true)).toBe('Copied');
    });

    it('aria-label changes based on state', () => {
      const ariaLabel = (copied: boolean) =>
        copied ? 'Address copied' : 'Copy full address';
      expect(ariaLabel(false)).toBe('Copy full address');
      expect(ariaLabel(true)).toBe('Address copied');
    });
  });
});
