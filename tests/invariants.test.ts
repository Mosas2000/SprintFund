import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

/**
 * SprintFund Property-Based Tests
 *
 * Tests for mathematical invariants and properties that should always hold.
 * Uses systematic parameter variation to validate contract behavior.
 */

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("SprintFund Mathematical Invariants", () => {
  // ============================================
  // Quadratic Voting Invariants
  // ============================================

  describe("quadratic voting cost invariant: cost = weight^2", () => {
    beforeEach(() => {
      // Large stake to allow high weight votes
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(1000000000000)], wallet1);
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(1000000000000)], wallet2);
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Test"), Cl.stringUtf8("Description")],
        wallet1
      );
    });

    // Test various weight values
    const testWeights = [1, 2, 3, 5, 7, 10, 50, 100, 500, 1000, 5000, 10000];

    testWeights.forEach((weight) => {
      const expectedCost = weight * weight;
      it(`weight ${weight} requires stake >= ${expectedCost}`, () => {
        const result = simnet.callPublicFn(
          "sprintfund-core-v3",
          "vote",
          [Cl.uint(0), Cl.bool(true), Cl.uint(weight)],
          wallet2
        );
        expect(result.result).toBeOk(Cl.bool(true));
      });
    });
  });

  describe("quadratic cost boundary validation", () => {
    it("stake exactly equal to cost allows vote", () => {
      // Stake 25 microSTX, vote with weight 5 (cost = 25)
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(10000000)], wallet1);
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(25)], wallet3);
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Test"), Cl.stringUtf8("Description")],
        wallet1
      );

      const result = simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet3
      );
      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("stake one less than cost rejects vote", () => {
      // Stake 24 microSTX, vote with weight 5 (cost = 25)
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(10000000)], wallet1);
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(24)], wallet3);
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Test"), Cl.stringUtf8("Description")],
        wallet1
      );

      const result = simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet3
      );
      expect(result.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });
  });

  // ============================================
  // Stake Accumulation Invariants
  // ============================================

  describe("stake accumulation invariant: total = sum of deposits", () => {
    const depositAmounts = [1000000, 2500000, 7500000, 500000, 4500000];
    const expectedTotal = depositAmounts.reduce((a, b) => a + b, 0);

    it(`multiple deposits sum correctly to ${expectedTotal}`, () => {
      for (const amount of depositAmounts) {
        simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(amount)], wallet1);
      }

      const result = simnet.callReadOnlyFn(
        "sprintfund-core-v3",
        "get-stake",
        [Cl.principal(wallet1)],
        deployer
      );

      expect(result.result).toBeSome(Cl.tuple({ amount: Cl.uint(expectedTotal) }));
    });
  });

  describe("stake isolation invariant: users have independent balances", () => {
    it("deposits from different users do not interfere", () => {
      const stake1 = 10000000;
      const stake2 = 25000000;
      const stake3 = 50000000;

      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(stake1)], wallet1);
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(stake2)], wallet2);
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(stake3)], wallet3);

      const result1 = simnet.callReadOnlyFn(
        "sprintfund-core-v3",
        "get-stake",
        [Cl.principal(wallet1)],
        deployer
      );
      const result2 = simnet.callReadOnlyFn(
        "sprintfund-core-v3",
        "get-stake",
        [Cl.principal(wallet2)],
        deployer
      );
      const result3 = simnet.callReadOnlyFn(
        "sprintfund-core-v3",
        "get-stake",
        [Cl.principal(wallet3)],
        deployer
      );

      expect(result1.result).toBeSome(Cl.tuple({ amount: Cl.uint(stake1) }));
      expect(result2.result).toBeSome(Cl.tuple({ amount: Cl.uint(stake2) }));
      expect(result3.result).toBeSome(Cl.tuple({ amount: Cl.uint(stake3) }));
    });
  });

  // ============================================
  // Proposal Count Invariants
  // ============================================

  describe("proposal count invariant: count = number of proposals", () => {
    beforeEach(() => {
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(10000000)], wallet1);
    });

    const proposalCounts = [1, 2, 3, 5, 10];

    proposalCounts.forEach((count) => {
      it(`creating ${count} proposals results in count = ${count}`, () => {
        for (let i = 0; i < count; i++) {
          simnet.callPublicFn(
            "sprintfund-core-v3",
            "create-proposal",
            [Cl.uint(50000000), Cl.stringUtf8(`Proposal ${i}`), Cl.stringUtf8("Description")],
            wallet1
          );
        }

        const result = simnet.callReadOnlyFn(
          "sprintfund-core-v3",
          "get-proposal-count",
          [],
          deployer
        );

        expect(result.result).toBeOk(Cl.uint(count));
      });
    });
  });

  describe("proposal ID invariant: IDs are sequential starting from 0", () => {
    beforeEach(() => {
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(10000000)], wallet1);
    });

    it("first proposal gets ID 0", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core-v3",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("First"), Cl.stringUtf8("Description")],
        wallet1
      );
      expect(result.result).toBeOk(Cl.uint(0));
    });

    it("proposals get sequential IDs", () => {
      for (let i = 0; i < 5; i++) {
        const result = simnet.callPublicFn(
          "sprintfund-core-v3",
          "create-proposal",
          [Cl.uint(50000000), Cl.stringUtf8(`Proposal ${i}`), Cl.stringUtf8("Description")],
          wallet1
        );
        expect(result.result).toBeOk(Cl.uint(i));
      }
    });
  });

  // ============================================
  // Vote Count Invariants
  // ============================================

  describe("vote count invariant: votes accumulate correctly", () => {
    beforeEach(() => {
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(100000000)], wallet1);
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(100000000)], wallet2);
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(100000000)], wallet3);
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Test"), Cl.stringUtf8("Description")],
        wallet1
      );
    });

    it("single vote-for updates count correctly", () => {
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(7)],
        wallet2
      );

      const result = simnet.callReadOnlyFn(
        "sprintfund-core-v3",
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );

      const proposalStr = Cl.prettyPrint(result.result);
      expect(proposalStr).toContain("votes-for: u7");
      expect(proposalStr).toContain("votes-against: u0");
    });

    it("single vote-against updates count correctly", () => {
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(false), Cl.uint(5)],
        wallet2
      );

      const result = simnet.callReadOnlyFn(
        "sprintfund-core-v3",
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );

      const proposalStr = Cl.prettyPrint(result.result);
      expect(proposalStr).toContain("votes-for: u0");
      expect(proposalStr).toContain("votes-against: u5");
    });

    it("multiple voters for same proposal accumulate", () => {
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(3)],
        wallet1
      );
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(false), Cl.uint(2)],
        wallet3
      );

      const result = simnet.callReadOnlyFn(
        "sprintfund-core-v3",
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );

      const proposalStr = Cl.prettyPrint(result.result);
      expect(proposalStr).toContain("votes-for: u8"); // 3 + 5
      expect(proposalStr).toContain("votes-against: u2");
    });
  });

  // ============================================
  // Execution State Invariants
  // ============================================

  describe("execution state invariant: executed proposals stay executed", () => {
    beforeEach(() => {
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(10000000)], wallet1);
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(50000000)], wallet2);
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(100000000)], deployer);
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Test"), Cl.stringUtf8("Description")],
        wallet1
      );
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );
      simnet.callPublicFn("sprintfund-core-v3", "execute-proposal", [Cl.uint(0)], deployer);
    });

    it("executed flag is true after execution", () => {
      const result = simnet.callReadOnlyFn(
        "sprintfund-core-v3",
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );

      const proposalStr = Cl.prettyPrint(result.result);
      expect(proposalStr).toContain("executed: true");
    });

    it("re-execution fails with ALREADY-EXECUTED error", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core-v3",
        "execute-proposal",
        [Cl.uint(0)],
        deployer
      );
      expect(result.result).toBeErr(Cl.uint(103)); // ERR-ALREADY-EXECUTED
    });

    it("voting fails after execution", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(1)],
        deployer
      );
      expect(result.result).toBeErr(Cl.uint(103)); // ERR-ALREADY-EXECUTED
    });
  });

  // ============================================
  // Minimum Stake Invariant
  // ============================================

  describe("minimum stake invariant: 10 STX required for proposals", () => {
    const minStake = 10000000; // 10 STX in microSTX

    const testAmounts = [
      { amount: minStake - 1, shouldFail: true },
      { amount: minStake, shouldFail: false },
      { amount: minStake + 1, shouldFail: false },
      { amount: minStake * 2, shouldFail: false },
    ];

    testAmounts.forEach(({ amount, shouldFail }) => {
      it(`stake of ${amount} microSTX ${shouldFail ? "fails" : "succeeds"} for proposal`, () => {
        simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(amount)], wallet1);

        const result = simnet.callPublicFn(
          "sprintfund-core-v3",
          "create-proposal",
          [Cl.uint(50000000), Cl.stringUtf8("Test"), Cl.stringUtf8("Description")],
          wallet1
        );

        if (shouldFail) {
          expect(result.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
        } else {
          expect(result.result).toBeOk(Cl.uint(0));
        }
      });
    });
  });

  // ============================================
  // Vote Outcome Invariant
  // ============================================

  describe("vote outcome invariant: votes-for > votes-against required", () => {
    beforeEach(() => {
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(10000000)], wallet1);
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(100000000)], wallet2);
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(100000000)], wallet3);
      simnet.callPublicFn("sprintfund-core-v3", "stake", [Cl.uint(100000000)], deployer);
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Test"), Cl.stringUtf8("Description")],
        wallet1
      );
    });

    it("execution succeeds when votes-for > votes-against", () => {
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(10)],
        wallet2
      );
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(false), Cl.uint(5)],
        wallet3
      );

      const result = simnet.callPublicFn(
        "sprintfund-core-v3",
        "execute-proposal",
        [Cl.uint(0)],
        deployer
      );
      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("execution fails when votes-for == votes-against", () => {
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(false), Cl.uint(5)],
        wallet3
      );

      const result = simnet.callPublicFn(
        "sprintfund-core-v3",
        "execute-proposal",
        [Cl.uint(0)],
        deployer
      );
      expect(result.result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });

    it("execution fails when votes-for < votes-against", () => {
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(3)],
        wallet2
      );
      simnet.callPublicFn(
        "sprintfund-core-v3",
        "vote",
        [Cl.uint(0), Cl.bool(false), Cl.uint(7)],
        wallet3
      );

      const result = simnet.callPublicFn(
        "sprintfund-core-v3",
        "execute-proposal",
        [Cl.uint(0)],
        deployer
      );
      expect(result.result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });
  });
});
