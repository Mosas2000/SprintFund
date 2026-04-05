/**
 * TypeScript type extensions and advanced patterns.
 * Demonstrates modern TypeScript techniques for type safety.
 */

import type { Proposal } from '../types';

/**
 * Conditional types for flexible APIs.
 */
export type GetProposalResponse<T extends boolean> = T extends true
  ? Proposal | null
  : Proposal;

/**
 * Generic result with type-safe error fields.
 */
export type TypedResult<T, E extends Error = Error> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: E;
    };

/**
 * Utility to create typed results.
 */
export function ok<T>(data: T): TypedResult<T> {
  return { ok: true, data };
}

export function err<E extends Error>(error: E): TypedResult<never, E> {
  return { ok: false, error };
}

/**
 * Extract value from typed result.
 */
export function unwrap<T>(result: TypedResult<T>): T {
  if (!result.ok) throw result.error;
  return result.data;
}

/**
 * Opaque type for proposal IDs - prevents mixing with other numbers.
 */
export type ProposalId = Proposal['id'] & { readonly __brand: 'ProposalId' };

export function createProposalId(id: number): ProposalId {
  return id as ProposalId;
}

/**
 * Opaque type for STX amounts in microSTX.
 */
export type MicroSTX = number & { readonly __brand: 'MicroSTX' };

export function microSTX(amount: number): MicroSTX {
  if (amount < 0 || !Number.isFinite(amount)) {
    throw new Error('Invalid microSTX amount');
  }
  return Math.floor(amount) as MicroSTX;
}

/**
 * Opaque type for principal addresses.
 */
export type Principal = string & { readonly __brand: 'Principal' };

export function principal(address: string): Principal {
  const trimmed = address.trim();
  if (!/^S[PT][A-Z0-9]{38}$/.test(trimmed)) {
    throw new Error('Invalid principal address');
  }
  return trimmed as Principal;
}

/**
 * Discriminated union for proposal states.
 */
export type ProposalState =
  | { type: 'active'; votesFor: number; votesAgainst: number }
  | { type: 'passing'; votesFor: number; votesAgainst: number }
  | { type: 'executed'; amountTransferred: number };

export function getProposalState(proposal: Proposal): ProposalState {
  if (proposal.executed) {
    return { type: 'executed', amountTransferred: proposal.amount };
  }

  if (proposal.votesFor > proposal.votesAgainst) {
    return {
      type: 'passing',
      votesFor: proposal.votesFor,
      votesAgainst: proposal.votesAgainst,
    };
  }

  return {
    type: 'active',
    votesFor: proposal.votesFor,
    votesAgainst: proposal.votesAgainst,
  };
}

/**
 * Type-safe event handler registration.
 */
export interface EventEmitter<T extends Record<string, any[]>> {
  on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): void;
  emit<K extends keyof T>(event: K, ...args: T[K]): void;
}

export class TypedEventEmitter<T extends Record<string, any[]>>
  implements EventEmitter<T>
{
  private handlers: Map<keyof T, ((...args: any[]) => void)[]> = new Map();

  on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  emit<K extends keyof T>(event: K, ...args: T[K]): void {
    const eventHandlers = this.handlers.get(event) || [];
    eventHandlers.forEach(handler => handler(...args));
  }
}

/**
 * Usage example for typed events.
 */
export interface ProposalEvents {
  'proposal:created': [proposal: Proposal];
  'proposal:voted': [proposalId: number, support: boolean, weight: number];
  'proposal:executed': [proposalId: number];
}

/**
 * Generic async operation with retry logic.
 */
export type AsyncOp<T> = () => Promise<T>;

export async function withRetry<T>(
  operation: AsyncOp<T>,
  maxAttempts: number = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxAttempts - 1) {
        await new Promise(resolve =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt))
        );
      }
    }
  }

  throw lastError;
}

/**
 * Type-safe pagination cursor.
 */
export type Cursor = string & { readonly __brand: 'Cursor' };

export interface PaginatedResult<T> {
  items: T[];
  cursor: Cursor | null;
}

/**
 * Readonly wrapper for safe type enforcement.
 */
export type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

/**
 * Mutable wrapper for when readonly is needed.
 */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

/**
 * Deep partial for partial updates.
 */
export type DeepPartial<T> = T extends object
  ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  }
  : T;

/**
 * Key validation for safe object access.
 */
export function hasKey<T extends object>(
  obj: T,
  key: PropertyKey
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Type-safe object entries.
 */
export function entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

/**
 * Type-safe object keys.
 */
export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Type-safe object values.
 */
export function values<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][];
}
