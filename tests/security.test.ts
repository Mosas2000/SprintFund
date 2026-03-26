import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

/**
 * SprintFund Security Tests
 *
 * Focused tests for access control, authorization, and security scenarios.
 * These tests document both current behavior and known security issues.
 */

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;
const wallet4 = accounts.get("wallet_4")!;

describe("SprintFund Security Tests", () => {
  // ============================================
  // Access Control Tests
  // ============================================

  describe("execute-proposal access control", () => {
    beforeEach(() => {
      // Setup: stake and create a passing proposal
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(10000000)], wallet1);
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(50000000)], wallet2);
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(100000000)], deployer);
      simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [
          Cl.uint(50000000),
          Cl.stringUtf8("Security Test"),
          Cl.stringUtf8("Testing access control"),
        ],
        wallet1
      );
      // Vote in favor
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );
    });

    it("allows proposer to execute their own proposal", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        wallet1
      );
      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("allows voter to execute proposal they voted on", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        wallet2
      );
      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("allows any user to execute passing proposal (known issue #11)", () => {
      // wallet3 is not the proposer and did not vote
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        wallet3
      );
      // This should ideally fail, but current contract allows anyone to execute
      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("prevents execution when votes-for equals votes-against", () => {
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(50000000)], wallet3);
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(false), Cl.uint(5)],
        wallet3
      );

      const result = simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        deployer
      );
      expect(result.result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });
  });

  // ============================================
  // Vote Manipulation Tests
  // ============================================

  describe("vote manipulation prevention", () => {
    beforeEach(() => {
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(10000000)], wallet1);
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(100000000)], wallet2);
      simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Test"), Cl.stringUtf8("Description")],
        wallet1
      );
    });

    it("allows vote override - changing vote direction (known issue #12)", () => {
      // First vote FOR
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );

      // Change vote to AGAINST - this should ideally be prevented
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(false), Cl.uint(7)],
        wallet2
      );
      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("vote override inflates total votes (known issue #12)", () => {
      // Vote FOR with weight 5
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );

      // Vote AGAINST with weight 3
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(false), Cl.uint(3)],
        wallet2
      );

      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );

      const proposalStr = Cl.prettyPrint(result.result);
      // Both votes are counted, total = 5 + 3 = 8 instead of just latest
      expect(proposalStr).toContain("votes-for: u5");
      expect(proposalStr).toContain("votes-against: u3");
    });

    it("prevents voting on non-existent proposal", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(999), Cl.bool(true), Cl.uint(1)],
        wallet2
      );
      expect(result.result).toBeErr(Cl.uint(101)); // ERR-PROPOSAL-NOT-FOUND
    });

    it("prevents voting on executed proposal", () => {
      // Vote and execute
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(100000000)], deployer);
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );
      simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        deployer
      );

      // Try to vote after execution
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(1)],
        deployer
      );
      expect(result.result).toBeErr(Cl.uint(103)); // ERR-ALREADY-EXECUTED
    });
  });

  // ============================================
  // Stake Manipulation Tests
  // ============================================

  describe("stake manipulation prevention", () => {
    it("rejects staking zero amount with transfer error", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(0)],
        wallet1
      );
      // Zero transfer is rejected by stx-transfer?
      expect(result.result).toBeErr(Cl.uint(3));
    });

    it("prevents withdrawing without any stake", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "withdraw-stake",
        [Cl.uint(1000000)],
        wallet3
      );
      expect(result.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });

    it("prevents over-withdrawal", () => {
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(10000000)], wallet1);

      const result = simnet.callPublicFn(
        "sprintfund-core",
        "withdraw-stake",
        [Cl.uint(20000000)],
        wallet1
      );
      expect(result.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });

    it("allows stake accumulation from multiple transactions", () => {
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(5000000)], wallet1);
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(5000000)], wallet1);

      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-stake",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(result.result).toBeSome(Cl.tuple({ amount: Cl.uint(10000000) }));
    });
  });

  // ============================================
  // Proposal Security Tests
  // ============================================

  describe("proposal security", () => {
    beforeEach(() => {
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(10000000)], wallet1);
    });

    it("requires minimum stake to create proposal", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Test"), Cl.stringUtf8("Description")],
        wallet2 // No stake
      );
      expect(result.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });

    it("allows proposal with insufficient stake if above minimum", () => {
      // Stake exactly minimum
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(10000000)], wallet2);

      const result = simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Test"), Cl.stringUtf8("Description")],
        wallet2
      );
      expect(result.result).toBeOk(Cl.uint(0));
    });

    it("prevents double execution of proposal", () => {
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(50000000)], wallet2);
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(100000000)], deployer);
      simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Test"), Cl.stringUtf8("Description")],
        wallet1
      );
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );

      // First execution succeeds
      simnet.callPublicFn("sprintfund-core", "execute-proposal", [Cl.uint(0)], deployer);

      // Second execution fails
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        wallet1
      );
      expect(result.result).toBeErr(Cl.uint(103)); // ERR-ALREADY-EXECUTED
    });

    it("allows anyone to create multiple proposals", () => {
      simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Proposal 1"), Cl.stringUtf8("First")],
        wallet1
      );
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [Cl.uint(75000000), Cl.stringUtf8("Proposal 2"), Cl.stringUtf8("Second")],
        wallet1
      );
      expect(result.result).toBeOk(Cl.uint(1));
    });
  });

  // ============================================
  // Quadratic Voting Security Tests
  // ============================================

  describe("quadratic voting security", () => {
    beforeEach(() => {
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(10000000)], wallet1);
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(100000000)], wallet2); // 100 STX
      simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Test"), Cl.stringUtf8("Description")],
        wallet1
      );
    });

    it("correctly calculates quadratic cost for high weights", () => {
      // weight 10000 costs 100000000 (exactly 100 STX)
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(10000)],
        wallet2
      );
      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("rejects vote when quadratic cost exceeds stake", () => {
      // weight 10001 costs 100020001 > 100000000
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(10001)],
        wallet2
      );
      expect(result.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });

    it("allows zero weight vote", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(0)],
        wallet2
      );
      // Zero weight is allowed but contributes nothing
      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("does not deduct stake for voting (known issue #13)", () => {
      // Vote with cost 25 (weight 5)
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );

      // Check stake is unchanged
      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-stake",
        [Cl.principal(wallet2)],
        deployer
      );
      // Stake should still be 100000000, not reduced by vote cost
      expect(result.result).toBeSome(Cl.tuple({ amount: Cl.uint(100000000) }));
    });
  });

  // ============================================
  // Fund Transfer Security Tests
  // ============================================

  describe("fund transfer security", () => {
    beforeEach(() => {
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(10000000)], wallet1);
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(50000000)], wallet2);
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(100000000)], deployer);
    });

    it("sends funds to proposer on successful execution", () => {
      simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Fund Request"), Cl.stringUtf8("For development")],
        wallet1
      );
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );

      const result = simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        deployer
      );
      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("fails execution for non-existent proposal with huge amount", () => {
      // The large proposal was created as id 1, but we haven't voted on it properly
      // This test validates proposal-not-found error
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(999)],
        deployer
      );
      expect(result.result).toBeErr(Cl.uint(101)); // ERR-PROPOSAL-NOT-FOUND
    });
  });

  // ============================================
  // Contract Owner Security Tests
  // ============================================

  describe("contract owner security", () => {
    it("reports deployer as contract owner", () => {
      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-contract-owner",
        [],
        wallet1
      );
      expect(result.result).toBeOk(Cl.principal(deployer));
    });

    it("owner has no special privileges for voting", () => {
      simnet.callPublicFn("sprintfund-core", "stake", [Cl.uint(10000000)], wallet1);
      simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Test"), Cl.stringUtf8("Description")],
        wallet1
      );

      // Owner cannot vote without stake
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        deployer
      );
      expect(result.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });

    it("owner cannot create proposal without stake", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [Cl.uint(50000000), Cl.stringUtf8("Owner Proposal"), Cl.stringUtf8("Description")],
        deployer
      );
      expect(result.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });
  });
});
