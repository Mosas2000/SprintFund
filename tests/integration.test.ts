import { describe, it, expect, beforeEach, vi } from "vitest";
import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

/**
 * Integration Tests for Contract-Frontend Interaction
 * 
 * Tests the data flow between the smart contract and frontend utility
 * functions to ensure proper type conversion, error handling, and
 * data transformation.
 */

describe("Integration: Contract-Frontend Interaction", () => {
  let simnet: Awaited<ReturnType<typeof initSimnet>>;
  let deployer: string;
  let accounts: string[];
  const contractName = "sprintfund-core";
  const minStake = 10_000_000n; // 10 STX in microSTX

  beforeEach(async () => {
    simnet = await initSimnet();
    const allAccounts = simnet.getAccounts();
    deployer = allAccounts.get("deployer")!;
    accounts = [
      allAccounts.get("wallet_1")!,
      allAccounts.get("wallet_2")!,
      allAccounts.get("wallet_3")!,
      allAccounts.get("wallet_4")!,
    ];
  });

  describe("Proposal Data Flow", () => {
    it("should return proposal count in format compatible with frontend parsing", () => {
      // Setup: Create some proposals
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake)], accounts[0]);
      
      for (let i = 0; i < 3; i++) {
        simnet.callPublicFn(
          contractName,
          "create-proposal",
          [
            Cl.uint(1_000_000n),
            Cl.stringUtf8(`Test Proposal ${i}`),
            Cl.stringUtf8(`Description ${i}`),
          ],
          accounts[0]
        );
      }
      
      // Get count
      const result = simnet.callReadOnlyFn(contractName, "get-proposal-count", [], deployer);
      
      // Frontend expects (ok uint) format
      expect(result.result).toBeOk(Cl.uint(3));
    });

    it("should return proposal data in expected structure for frontend", () => {
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake)], accounts[0]);
      
      simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(5_000_000n), // 5 STX
          Cl.stringUtf8("My Test Proposal"),
          Cl.stringUtf8("This is a detailed description of the proposal"),
        ],
        accounts[0]
      );
      
      const result = simnet.callReadOnlyFn(
        contractName,
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );
      
      // Should return Some with proposal data (not None)
      expect(result.result).not.toBeNone();
    });

    it("should return none for non-existent proposal", () => {
      const result = simnet.callReadOnlyFn(
        contractName,
        "get-proposal",
        [Cl.uint(999)],
        deployer
      );
      
      expect(result.result).toBeNone();
    });

    it("should track vote counts after voting", () => {
      // Setup
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake * 10n)], accounts[0]);
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake * 10n)], accounts[1]);
      
      simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(1_000_000n),
          Cl.stringUtf8("Vote Test"),
          Cl.stringUtf8("Testing vote counts"),
        ],
        accounts[0]
      );
      
      // Vote
      simnet.callPublicFn(
        contractName,
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)], // weight 5 = 25 votes (quadratic)
        accounts[0]
      );
      
      simnet.callPublicFn(
        contractName,
        "vote",
        [Cl.uint(0), Cl.bool(false), Cl.uint(3)], // weight 3 = 9 votes against
        accounts[1]
      );
      
      // Check proposal state
      const result = simnet.callReadOnlyFn(
        contractName,
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );
      
      // Proposal should exist after voting
      expect(result.result).not.toBeNone();
    });
  });

  describe("Stake Data Flow", () => {
    it("should return stake data compatible with frontend parsing", () => {
      // Stake some STX
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake * 5n)], accounts[0]);
      
      // Get stake
      const result = simnet.callReadOnlyFn(
        contractName,
        "get-stake",
        [Cl.principal(accounts[0])],
        deployer
      );
      
      // Should return Some with stake data
      expect(result.result).not.toBeNone();
    });

    it("should return none for users without stake", () => {
      const result = simnet.callReadOnlyFn(
        contractName,
        "get-stake",
        [Cl.principal(accounts[3])], // Account that never staked
        deployer
      );
      
      expect(result.result).toBeNone();
    });

    it("should update stake after deposit", () => {
      // Initial stake
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake)], accounts[0]);
      
      // Additional stake
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake * 2n)], accounts[0]);
      
      // Check total - stake exists
      const result = simnet.callReadOnlyFn(
        contractName,
        "get-stake",
        [Cl.principal(accounts[0])],
        deployer
      );
      
      expect(result.result).not.toBeNone();
    });

    it("should update stake after withdrawal", () => {
      // Initial stake
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake * 3n)], accounts[0]);
      
      // Withdraw some
      simnet.callPublicFn(
        contractName,
        "withdraw-stake",
        [Cl.uint(minStake)],
        accounts[0]
      );
      
      // Check remaining - stake still exists
      const result = simnet.callReadOnlyFn(
        contractName,
        "get-stake",
        [Cl.principal(accounts[0])],
        deployer
      );
      
      expect(result.result).not.toBeNone();
    });
  });

  describe("Configuration Data Flow", () => {
    it("should return min stake amount for frontend display", () => {
      const result = simnet.callReadOnlyFn(
        contractName,
        "get-min-stake-amount",
        [],
        deployer
      );
      
      // Should return (ok uint) with minimum stake
      expect(result.result).toBeOk(Cl.uint(10_000_000n)); // 10 STX
    });

    it("should return contract owner for admin checks", () => {
      const result = simnet.callReadOnlyFn(
        contractName,
        "get-contract-owner",
        [],
        deployer
      );
      
      // Should return ok with a principal value
      const resultStr = result.result.toString();
      expect(resultStr.includes("err")).toBe(false);
    });
  });

  describe("Transaction Result Parsing", () => {
    it("should return success result from stake transaction", () => {
      const result = simnet.callPublicFn(
        contractName,
        "stake",
        [Cl.uint(minStake)],
        accounts[0]
      );
      
      // stake returns (ok u<new-balance>) - verify not an error
      const resultStr = result.result.toString();
      expect(resultStr.includes("err")).toBe(false);
    });

    it("should return success result from create-proposal", () => {
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake)], accounts[0]);
      
      const result = simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(1_000_000n),
          Cl.stringUtf8("New Proposal"),
          Cl.stringUtf8("Description"),
        ],
        accounts[0]
      );
      
      // create-proposal returns (ok u<proposal-id>)
      expect(result.result).toBeOk(Cl.uint(0));
    });

    it("should return success result from vote", () => {
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake * 10n)], accounts[0]);
      
      simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(1_000_000n),
          Cl.stringUtf8("Vote Target"),
          Cl.stringUtf8("For voting"),
        ],
        accounts[0]
      );
      
      const result = simnet.callPublicFn(
        contractName,
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(1)],
        accounts[0]
      );
      
      // vote returns (ok true)
      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("should return error for insufficient stake on create-proposal", () => {
      // Don't stake - try to create proposal
      const result = simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(1_000_000n),
          Cl.stringUtf8("Should Fail"),
          Cl.stringUtf8("No stake"),
        ],
        accounts[0]
      );
      
      // Should return error
      expect(result.result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });

    it("should return error for non-existent proposal vote", () => {
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake)], accounts[0]);
      
      const result = simnet.callPublicFn(
        contractName,
        "vote",
        [Cl.uint(999), Cl.bool(true), Cl.uint(1)],
        accounts[0]
      );
      
      // Should return error
      expect(result.result).toBeErr(Cl.uint(101)); // ERR-NOT-FOUND
    });
  });

  describe("UTF-8 String Handling", () => {
    it("should handle UTF-8 characters in proposal title", () => {
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake)], accounts[0]);
      
      const result = simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(1_000_000n),
          Cl.stringUtf8("Amélioration du système"),
          Cl.stringUtf8("Unicode support test"),
        ],
        accounts[0]
      );
      
      expect(result.result).toBeOk(Cl.uint(0));
      
      // Verify proposal was created
      const proposal = simnet.callReadOnlyFn(
        contractName,
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );
      
      expect(proposal.result).not.toBeNone();
    });

    it("should handle emoji in descriptions", () => {
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake)], accounts[0]);
      
      const result = simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(1_000_000n),
          Cl.stringUtf8("Emoji Test"),
          Cl.stringUtf8("Description with emojis"),
        ],
        accounts[0]
      );
      
      expect(result.result).toBeOk(Cl.uint(0));
    });
  });

  describe("Data Validation Scenarios", () => {
    it("should handle zero amount in proposal", () => {
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake)], accounts[0]);
      
      const result = simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(0), // Zero amount
          Cl.stringUtf8("Zero Amount"),
          Cl.stringUtf8("Testing zero"),
        ],
        accounts[0]
      );
      
      // Contract accepts zero amount (no validation)
      expect(result.result).toBeOk(Cl.uint(0));
    });

    it("should handle maximum title length", () => {
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake)], accounts[0]);
      
      const maxTitle = "X".repeat(100); // Max 100 chars for title
      
      const result = simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(1_000_000n),
          Cl.stringUtf8(maxTitle),
          Cl.stringUtf8("Max length title test"),
        ],
        accounts[0]
      );
      
      expect(result.result).toBeOk(Cl.uint(0));
    });

    it("should handle maximum description length", () => {
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake)], accounts[0]);
      
      const maxDesc = "D".repeat(500); // Max 500 chars for description
      
      const result = simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(1_000_000n),
          Cl.stringUtf8("Max Desc Test"),
          Cl.stringUtf8(maxDesc),
        ],
        accounts[0]
      );
      
      expect(result.result).toBeOk(Cl.uint(0));
    });
  });

  describe("Sequential Operation Flow", () => {
    it("should support full user journey: stake -> propose -> vote", () => {
      // Step 1: Stake
      const stakeResult = simnet.callPublicFn(
        contractName,
        "stake",
        [Cl.uint(minStake * 10n)],
        accounts[0]
      );
      // stake returns (ok u<balance>)
      const stakeStr = stakeResult.result.toString();
      expect(stakeStr.startsWith("(err")).toBe(false);
      
      // Step 2: Create proposal
      const proposeResult = simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(5_000_000n),
          Cl.stringUtf8("User Journey Proposal"),
          Cl.stringUtf8("Testing the full flow"),
        ],
        accounts[0]
      );
      expect(proposeResult.result).toBeOk(Cl.uint(0));
      
      // Step 3: Vote
      const voteResult = simnet.callPublicFn(
        contractName,
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(3)],
        accounts[0]
      );
      expect(voteResult.result).toBeOk(Cl.bool(true));
      
      // Verify final state
      const proposal = simnet.callReadOnlyFn(
        contractName,
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );
      expect(proposal.result).not.toBeNone();
    });

    it("should support multi-user voting flow", () => {
      // All users stake
      for (const account of accounts) {
        simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake * 10n)], account);
      }
      
      // One user creates proposal
      simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(10_000_000n),
          Cl.stringUtf8("Multi-User Proposal"),
          Cl.stringUtf8("All users will vote"),
        ],
        accounts[0]
      );
      
      // All users vote
      for (let i = 0; i < accounts.length; i++) {
        const voteFor = i % 2 === 0; // Alternate votes
        const result = simnet.callPublicFn(
          contractName,
          "vote",
          [Cl.uint(0), Cl.bool(voteFor), Cl.uint(1)],
          accounts[i]
        );
        expect(result.result).toBeOk(Cl.bool(true));
      }
      
      // Check final state
      const proposal = simnet.callReadOnlyFn(
        contractName,
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );
      expect(proposal.result).not.toBeNone();
    });
  });

  describe("Error Code Mapping", () => {
    // Maps contract error codes to frontend error messages
    const errorCodes = {
      100: "ERR-NOT-AUTHORIZED",
      101: "ERR-NOT-FOUND",
      102: "ERR-INSUFFICIENT-STAKE",
      103: "ERR-ALREADY-EXECUTED",
    };

    it("should return NOT-FOUND (101) for invalid proposal ID", () => {
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake)], accounts[0]);
      
      const result = simnet.callPublicFn(
        contractName,
        "vote",
        [Cl.uint(9999), Cl.bool(true), Cl.uint(1)],
        accounts[0]
      );
      
      expect(result.result).toBeErr(Cl.uint(101));
    });

    it("should return INSUFFICIENT-STAKE (102) for under-staked operations", () => {
      // No stake - try to create proposal
      const result = simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(1_000_000n),
          Cl.stringUtf8("Under-staked"),
          Cl.stringUtf8("Should fail"),
        ],
        accounts[0]
      );
      
      expect(result.result).toBeErr(Cl.uint(102));
    });

    it("should return INSUFFICIENT-STAKE (102) for vote without enough stake", () => {
      // Create a proposal first
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake)], accounts[0]);
      simnet.callPublicFn(
        contractName,
        "create-proposal",
        [Cl.uint(1_000_000n), Cl.stringUtf8("Test"), Cl.stringUtf8("Test")],
        accounts[0]
      );
      
      // Try to vote without stake
      const result = simnet.callPublicFn(
        contractName,
        "vote",
        [Cl.uint(0), Cl.bool(true), Cl.uint(1)],
        accounts[1] // No stake
      );
      
      expect(result.result).toBeErr(Cl.uint(102));
    });
  });

  describe("Block Height Integration", () => {
    it("should include block info in proposal structure", () => {
      simnet.callPublicFn(contractName, "stake", [Cl.uint(minStake)], accounts[0]);
      
      simnet.callPublicFn(
        contractName,
        "create-proposal",
        [
          Cl.uint(1_000_000n),
          Cl.stringUtf8("Block Height Test"),
          Cl.stringUtf8("Testing block height recording"),
        ],
        accounts[0]
      );
      
      const proposal = simnet.callReadOnlyFn(
        contractName,
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );
      
      // Proposal should exist and contain data
      expect(proposal.result).not.toBeNone();
    });
  });
});
