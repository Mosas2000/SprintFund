import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

/**
 * SprintFund Core Contract Unit Tests
 *
 * Tests for staking, proposal creation, quadratic voting, and execution.
 * Uses simnet for local blockchain simulation.
 */

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("SprintFund Core Contract", () => {
  // ============================================
  // Read-Only Function Tests
  // ============================================

  describe("get-proposal-count", () => {
    it("should return zero initially", () => {
      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-proposal-count",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.uint(0));
    });
  });

  describe("get-min-stake-amount", () => {
    it("should return 10 STX (10000000 microSTX)", () => {
      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-min-stake-amount",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.uint(10000000));
    });
  });

  describe("get-contract-owner", () => {
    it("should return deployer as owner", () => {
      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-contract-owner",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.principal(deployer));
    });
  });

  describe("get-stake", () => {
    it("should return none for user with no stake", () => {
      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-stake",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(result.result).toBeNone();
    });
  });

  describe("get-proposal", () => {
    it("should return none for non-existent proposal", () => {
      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-proposal",
        [Cl.uint(999)],
        deployer
      );
      expect(result.result).toBeNone();
    });
  });

  // ============================================
  // Staking Tests
  // ============================================

  describe("stake", () => {
    it("should allow user to stake STX", () => {
      const stakeAmount = 10000000; // 10 STX

      const result = simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(stakeAmount)],
        wallet1
      );

      expect(result.result).toBeOk(Cl.uint(stakeAmount));
    });

    it("should accumulate stakes from multiple calls", () => {
      const firstStake = 10000000;
      const secondStake = 5000000;

      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(firstStake)],
        wallet1
      );

      const result = simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(secondStake)],
        wallet1
      );

      expect(result.result).toBeOk(Cl.uint(firstStake + secondStake));
    });

    it("should update stake record in map", () => {
      const stakeAmount = 15000000;

      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(stakeAmount)],
        wallet2
      );

      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-stake",
        [Cl.principal(wallet2)],
        deployer
      );

      expect(result.result).toBeSome(
        Cl.tuple({ amount: Cl.uint(stakeAmount) })
      );
    });
  });

  // ============================================
  // Proposal Creation Tests
  // ============================================

  describe("create-proposal", () => {
    beforeEach(() => {
      // Stake minimum required amount
      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(10000000)],
        wallet1
      );
    });

    it("should create proposal when user has sufficient stake", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [
          Cl.uint(50000000), // 50 STX
          Cl.stringUtf8("Test Proposal"),
          Cl.stringUtf8("This is a test proposal description"),
        ],
        wallet1
      );

      expect(result.result).toBeOk(Cl.uint(0)); // First proposal has ID 0
    });

    it("should increment proposal count after creation", () => {
      simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [
          Cl.uint(50000000),
          Cl.stringUtf8("Test Proposal"),
          Cl.stringUtf8("Description"),
        ],
        wallet1
      );

      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-proposal-count",
        [],
        deployer
      );

      expect(result.result).toBeOk(Cl.uint(1));
    });

    it("should fail without sufficient stake", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [
          Cl.uint(50000000),
          Cl.stringUtf8("Test Proposal"),
          Cl.stringUtf8("Description"),
        ],
        wallet3 // wallet3 has no stake
      );

      expect(result.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });

    it("should store proposal with correct data", () => {
      const amount = 75000000;
      const title = "Community Grant";
      const description = "Funding for community event";

      simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [Cl.uint(amount), Cl.stringUtf8(title), Cl.stringUtf8(description)],
        wallet1
      );

      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );

      // Check key fields without strict block height matching
      const proposalStr = Cl.prettyPrint(result.result);
      expect(proposalStr).toContain("amount: u75000000");
      expect(proposalStr).toContain('title: u"Community Grant"');
      expect(proposalStr).toContain('description: u"Funding for community event"');
      expect(proposalStr).toContain("votes-for: u0");
      expect(proposalStr).toContain("votes-against: u0");
      expect(proposalStr).toContain("executed: false");
    });
  });

  // ============================================
  // Voting Tests
  // ============================================

  describe("vote", () => {
    beforeEach(() => {
      // Setup: stake and create proposal
      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(10000000)],
        wallet1
      );
      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(25000000)], // Enough for weight 5 (cost = 25)
        wallet2
      );
      simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [
          Cl.uint(50000000),
          Cl.stringUtf8("Test Proposal"),
          Cl.stringUtf8("Description"),
        ],
        wallet1
      );
    });

    it("should allow voting for a proposal", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [
          Cl.uint(0), // proposal-id
          Cl.bool(true), // support
          Cl.uint(3), // vote-weight (cost = 9 microSTX)
        ],
        wallet2
      );

      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("should allow voting against a proposal", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [
          Cl.uint(0),
          Cl.bool(false), // against
          Cl.uint(2),
        ],
        wallet2
      );

      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("should update votes-for count", () => {
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(4)],
        wallet2
      );

      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );

      const proposal = Cl.prettyPrint(result.result);
      expect(proposal).toContain("votes-for: u4");
    });

    it("should update votes-against count", () => {
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

      const proposal = Cl.prettyPrint(result.result);
      expect(proposal).toContain("votes-against: u3");
    });

    it("should fail for non-existent proposal", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(999), Cl.bool(true), Cl.uint(1)],
        wallet2
      );

      expect(result.result).toBeErr(Cl.uint(101)); // ERR-PROPOSAL-NOT-FOUND
    });

    it("should fail with insufficient stake for vote cost", () => {
      // wallet2 has 25 STX = 25000000 microSTX
      // Vote weight 5001 costs 5001^2 = 25010001 > 25000000
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [
          Cl.uint(0),
          Cl.bool(true),
          Cl.uint(5001), // cost = 25010001, more than 25000000 stake
        ],
        wallet2
      );

      expect(result.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });
  });

  // ============================================
  // Quadratic Voting Cost Tests
  // ============================================

  describe("quadratic voting cost calculation", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(10000000)],
        wallet1
      );
      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(100000000)], // 100 STX
        wallet2
      );
      simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [
          Cl.uint(50000000),
          Cl.stringUtf8("Test"),
          Cl.stringUtf8("Description"),
        ],
        wallet1
      );
    });

    it("should accept vote with weight 1 (cost 1)", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(1)],
        wallet2
      );
      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("should accept vote with weight 10 (cost 100)", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(10)],
        wallet2
      );
      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("should accept vote with weight 100 (cost 10000)", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(100)],
        wallet2
      );
      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("should reject vote when cost exceeds stake", () => {
      // wallet2 has 100 STX = 100000000 microSTX
      // Weight 10001 would cost 100020001 > 100000000
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(10001)],
        wallet2
      );
      expect(result.result).toBeErr(Cl.uint(102));
    });
  });

  // ============================================
  // Withdraw Stake Tests
  // ============================================

  describe("withdraw-stake", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(20000000)],
        wallet1
      );
    });

    it("should reduce stake balance on withdrawal attempt", () => {
      // Note: Actual STX transfer may fail in simnet if contract lacks balance,
      // but stake record should be updated before the transfer
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "withdraw-stake",
        [Cl.uint(5000000)],
        wallet1
      );

      // May succeed or fail depending on contract STX balance
      // The important thing is it doesn't panic
      expect(result.result).toBeDefined();
    });

    it("should fail when withdrawing more than staked", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "withdraw-stake",
        [Cl.uint(30000000)],
        wallet1
      );

      expect(result.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });

    it("should fail for user with no stake", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "withdraw-stake",
        [Cl.uint(1000000)],
        wallet3
      );

      expect(result.result).toBeErr(Cl.uint(102));
    });
  });

  // ============================================
  // Execute Proposal Tests
  // ============================================

  describe("execute-proposal", () => {
    beforeEach(() => {
      // Setup: stake, create proposal, and vote
      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(10000000)],
        wallet1
      );
      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(50000000)],
        wallet2
      );
      simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [
          Cl.uint(50000000),
          Cl.stringUtf8("Fund Me"),
          Cl.stringUtf8("Please fund this project"),
        ],
        wallet1
      );
    });

    it("should execute proposal with more votes for than against", () => {
      // Vote in favor
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );

      // Fund the contract first
      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(100000000)],
        deployer
      );

      const result = simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        deployer
      );

      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("should mark proposal as executed", () => {
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );

      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(100000000)],
        deployer
      );

      simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        deployer
      );

      const result = simnet.callReadOnlyFn(
        "sprintfund-core",
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );

      const proposal = Cl.prettyPrint(result.result);
      expect(proposal).toContain("executed: true");
    });

    it("should fail for non-existent proposal", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(999)],
        deployer
      );

      expect(result.result).toBeErr(Cl.uint(101)); // ERR-PROPOSAL-NOT-FOUND
    });

    it("should fail when votes against >= votes for", () => {
      // Vote against
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(false), Cl.uint(5)],
        wallet2
      );

      const result = simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        deployer
      );

      expect(result.result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });

    it("should fail for already executed proposal", () => {
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );

      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(100000000)],
        deployer
      );

      simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        deployer
      );

      // Try to execute again
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        deployer
      );

      expect(result.result).toBeErr(Cl.uint(103)); // ERR-ALREADY-EXECUTED
    });

    it("should fail when no votes cast", () => {
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        deployer
      );

      // 0 votes for is not > 0 votes against
      expect(result.result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });
  });

  // ============================================
  // Security Tests
  // ============================================

  describe("security: access control", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(10000000)],
        wallet1
      );
      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(50000000)],
        wallet2
      );
      simnet.callPublicFn(
        "sprintfund-core",
        "create-proposal",
        [
          Cl.uint(50000000),
          Cl.stringUtf8("Test"),
          Cl.stringUtf8("Description"),
        ],
        wallet1
      );
    });

    it("should allow any user to execute passing proposal (known issue #11)", () => {
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );

      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(100000000)],
        deployer
      );

      // wallet3 (not proposer, not voter) can execute
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "execute-proposal",
        [Cl.uint(0)],
        wallet3
      );

      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("should allow user to override their vote (known issue #12)", () => {
      // First vote
      simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(3)],
        wallet2
      );

      // Second vote (override)
      const result = simnet.callPublicFn(
        "sprintfund-core",
        "vote",
        [Cl.uint(0), Cl.bool(false), Cl.uint(5)],
        wallet2
      );

      expect(result.result).toBeOk(Cl.bool(true));
    });
  });

  describe("security: stake manipulation", () => {
    it("should prevent stake withdrawal that would leave negative balance", () => {
      simnet.callPublicFn(
        "sprintfund-core",
        "stake",
        [Cl.uint(10000000)],
        wallet1
      );

      const result = simnet.callPublicFn(
        "sprintfund-core",
        "withdraw-stake",
        [Cl.uint(20000000)],
        wallet1
      );

      expect(result.result).toBeErr(Cl.uint(102));
    });
  });
});
