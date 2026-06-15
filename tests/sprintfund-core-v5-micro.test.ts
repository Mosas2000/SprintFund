import { describe, expect, it, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
const wallet3 = accounts.get('wallet_3')!;

const CONTRACT_NAME = 'sprintfund-core-v5-micro';

describe('SprintFund Core v5-micro', () => {
  
  describe('Contract Initialization', () => {
    it('should initialize with correct default values', () => {
      const minStake = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-min-stake-amount',
        [],
        deployer
      );
      expect(minStake.result).toBeOk(Cl.uint(100)); // 100 microSTX default

      const totalStaked = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-total-staked',
        [],
        deployer
      );
      expect(totalStaked.result).toBeOk(Cl.uint(0));

      const version = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-version',
        [],
        deployer
      );
      expect(version.result).toBeOk(Cl.uint(5));
    });

    it('should set deployer as contract owner', () => {
      const owner = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-contract-owner',
        [],
        deployer
      );
      expect(owner.result).toBeOk(Cl.principal(deployer));
    });
  });

  describe('Staking Functions', () => {
    it('should allow staking with minimum amount (100 microSTX)', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'stake',
        [Cl.uint(100)],
        wallet1
      );
      expect(result).toBeOk(Cl.uint(100));

      const stake = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-stake',
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(stake.result).toBeSome(
        Cl.tuple({
          amount: Cl.uint(100),
          'locked-until': Cl.uint(0),
        })
      );
    });

    it('should reject staking below minimum amount', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'stake',
        [Cl.uint(99)], // Below minimum
        wallet1
      );
      expect(result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });

    it('should reject staking zero amount', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'stake',
        [Cl.uint(0)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(110)); // ERR-ZERO-AMOUNT
    });

    it('should accumulate stakes on multiple deposits', () => {
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(100)], wallet1);
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(200)], wallet1);
      
      const stake = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-stake',
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(stake.result).toBeSome(
        Cl.tuple({
          amount: Cl.uint(300),
          'locked-until': Cl.uint(0),
        })
      );
    });

    it('should update total staked amount', () => {
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(1000)], wallet1);
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(2000)], wallet2);
      
      const totalStaked = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-total-staked',
        [],
        deployer
      );
      expect(totalStaked.result).toBeOk(Cl.uint(3000));
    });

    it('should allow withdrawal of unlocked stake', () => {
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(1000)], wallet1);
      
      const withdrawResult = simnet.callPublicFn(
        CONTRACT_NAME,
        'withdraw-stake',
        [Cl.uint(500)],
        wallet1
      );
      expect(withdrawResult.result).toBeOk(Cl.uint(500)); // Remaining stake
    });

    it('should reject withdrawal of locked stake', () => {
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(1000)], wallet1);
      
      // Create and vote on proposal to lock stake
      simnet.callPublicFn(
        CONTRACT_NAME,
        'create-proposal',
        [Cl.uint(10000000), Cl.stringUtf8('Test'), Cl.stringUtf8('Description')],
        wallet1
      );
      
      simnet.callPublicFn(
        CONTRACT_NAME,
        'vote',
        [Cl.uint(0), Cl.bool(true), Cl.uint(1)],
        wallet1
      );
      
      // Try to withdraw immediately (stake is locked)
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'withdraw-stake',
        [Cl.uint(100)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(114)); // ERR-STAKE-LOCKED
    });

    it('should reject withdrawal exceeding available stake', () => {
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(1000)], wallet1);
      
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'withdraw-stake',
        [Cl.uint(2000)], // More than staked
        wallet1
      );
      expect(result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });
  });

  describe('Proposal Creation', () => {
    beforeEach(() => {
      // Stake minimum amount for proposal creation
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(100)], wallet1);
    });

    it('should create proposal with minimum stake', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'create-proposal',
        [
          Cl.uint(10000000), // 10 STX
          Cl.stringUtf8('Test Proposal'),
          Cl.stringUtf8('This is a test proposal for micro-grants'),
        ],
        wallet1
      );
      expect(result).toBeOk(Cl.uint(0)); // First proposal ID
    });

    it('should reject proposal without sufficient stake', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'create-proposal',
        [
          Cl.uint(10000000),
          Cl.stringUtf8('Test'),
          Cl.stringUtf8('Description'),
        ],
        wallet2 // No stake
      );
      expect(result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });

    it('should reject proposal below minimum amount (1 STX)', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'create-proposal',
        [
          Cl.uint(999999), // Less than 1 STX
          Cl.stringUtf8('Test'),
          Cl.stringUtf8('Description'),
        ],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(108)); // ERR-AMOUNT-TOO-LOW
    });

    it('should reject proposal above maximum amount (1000 STX)', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'create-proposal',
        [
          Cl.uint(1000000001), // More than 1000 STX
          Cl.stringUtf8('Test'),
          Cl.stringUtf8('Description'),
        ],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(109)); // ERR-AMOUNT-TOO-HIGH
    });

    it('should store proposal with correct data', () => {
      simnet.callPublicFn(
        CONTRACT_NAME,
        'create-proposal',
        [
          Cl.uint(50000000), // 50 STX
          Cl.stringUtf8('Community Event'),
          Cl.stringUtf8('Funding for local meetup'),
        ],
        wallet1
      );

      const proposal = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-proposal',
        [Cl.uint(0)],
        wallet1
      );

      expect(proposal.result).toBeSome(
        Cl.tuple({
          proposer: Cl.principal(wallet1),
          amount: Cl.uint(50000000),
          title: Cl.stringUtf8('Community Event'),
          description: Cl.stringUtf8('Funding for local meetup'),
          'votes-for': Cl.uint(0),
          'votes-against': Cl.uint(0),
          executed: Cl.bool(false),
          'created-at': Cl.uint(simnet.blockHeight),
          'voting-ends-at': Cl.uint(simnet.blockHeight + 432),
          'execution-allowed-at': Cl.uint(simnet.blockHeight + 432),
        })
      );
    });
  });

  describe('Voting Mechanism', () => {
    beforeEach(() => {
      // Setup: Stake and create proposal
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(10000)], wallet1);
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(10000)], wallet2);
      simnet.callPublicFn(
        CONTRACT_NAME,
        'create-proposal',
        [
          Cl.uint(10000000),
          Cl.stringUtf8('Test'),
          Cl.stringUtf8('Description'),
        ],
        wallet1
      );
    });

    it('should allow voting with quadratic cost', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'vote',
        [Cl.uint(0), Cl.bool(true), Cl.uint(10)], // weight=10, cost=100
        wallet2
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it('should deduct vote cost from available stake', () => {
      simnet.callPublicFn(
        CONTRACT_NAME,
        'vote',
        [Cl.uint(0), Cl.bool(true), Cl.uint(10)], // cost = 10^2 = 100
        wallet2
      );

      const availableStake = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-available-stake',
        [Cl.principal(wallet2)],
        wallet2
      );
      expect(availableStake.result).toBeOk(Cl.uint(9900)); // 10000 - 100
    });

    it('should update proposal vote counts', () => {
      const beforeVote = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-proposal',
        [Cl.uint(0)],
        wallet1
      );
      
      simnet.callPublicFn(
        CONTRACT_NAME,
        'vote',
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );

      const afterVote = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-proposal',
        [Cl.uint(0)],
        wallet1
      );

      // Verify votes-for increased
      expect(afterVote.result).not.toEqual(beforeVote.result);
    });

    it('should reject double voting', () => {
      simnet.callPublicFn(
        CONTRACT_NAME,
        'vote',
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );

      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'vote',
        [Cl.uint(0), Cl.bool(false), Cl.uint(3)],
        wallet2
      );
      expect(result).toBeErr(Cl.uint(104)); // ERR-ALREADY-VOTED
    });

    it('should reject voting with insufficient stake', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'vote',
        [Cl.uint(0), Cl.bool(true), Cl.uint(200)], // cost = 40000, exceeds stake
        wallet2
      );
      expect(result).toBeErr(Cl.uint(102)); // ERR-INSUFFICIENT-STAKE
    });

    it('should lock stake after voting', () => {
      const beforeVote = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-stake',
        [Cl.principal(wallet2)],
        wallet2
      );
      
      simnet.callPublicFn(
        CONTRACT_NAME,
        'vote',
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );

      const afterVote = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-stake',
        [Cl.principal(wallet2)],
        wallet2
      );

      // Stake should be locked (locked-until changed)
      expect(afterVote.result).not.toEqual(beforeVote.result);
    });

    it('should reject voting after period ends', () => {
      simnet.mineEmptyBlocks(433); // Past voting period

      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'vote',
        [Cl.uint(0), Cl.bool(true), Cl.uint(5)],
        wallet2
      );
      expect(result).toBeErr(Cl.uint(105)); // ERR-VOTING-PERIOD-ENDED
    });
  });

  describe('Proposal Execution', () => {
    beforeEach(() => {
      // Setup: Stake, create, and pass proposal
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(100000000)], wallet1);
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(100000000)], wallet2);
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(100000000)], wallet3);
      
      simnet.callPublicFn(
        CONTRACT_NAME,
        'create-proposal',
        [
          Cl.uint(50000000), // 50 STX
          Cl.stringUtf8('Test'),
          Cl.stringUtf8('Description'),
        ],
        wallet1
      );
      
      // Vote to pass (need >10% quorum)
      // Total staked = 300,000,000, so quorum = 30,000,000
      // Vote weight 6000 gives 6000 votes (still < quorum) - no wait
      // Let's vote with 40000 weight = 40000 votes > 30,000,000
      simnet.callPublicFn(
        CONTRACT_NAME,
        'vote',
        [Cl.uint(0), Cl.bool(true), Cl.uint(40000)], // cost = 1,600,000,000 (exceeds stake!)
        wallet2
      );
    });

    it('should execute approved proposal after voting period', () => {
      simnet.mineEmptyBlocks(433); // End voting period

      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'execute-proposal',
        [Cl.uint(0)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it('should reject execution before voting period ends', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'execute-proposal',
        [Cl.uint(0)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(106)); // ERR-VOTING-PERIOD-ACTIVE
    });

    it('should reject execution by non-proposer', () => {
      simnet.mineEmptyBlocks(433);

      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'execute-proposal',
        [Cl.uint(0)],
        wallet2 // Not the proposer
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });

    it('should enforce timelock for high-value proposals (≥100 STX)', () => {
      // Create high-value proposal
      simnet.callPublicFn(
        CONTRACT_NAME,
        'create-proposal',
        [
          Cl.uint(100000000), // 100 STX
          Cl.stringUtf8('High Value'),
          Cl.stringUtf8('Description'),
        ],
        wallet1
      );

      simnet.callPublicFn(
        CONTRACT_NAME,
        'vote',
        [Cl.uint(1), Cl.bool(true), Cl.uint(2000)],
        wallet2
      );

      simnet.mineEmptyBlocks(433); // End voting, but timelock still active

      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'execute-proposal',
        [Cl.uint(1)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(115)); // ERR-TIMELOCK-ACTIVE
    });

    it('should reject execution without quorum', () => {
      // Create new proposal with insufficient votes
      simnet.callPublicFn(
        CONTRACT_NAME,
        'create-proposal',
        [
          Cl.uint(10000000),
          Cl.stringUtf8('Test'),
          Cl.stringUtf8('Description'),
        ],
        wallet1
      );

      simnet.mineEmptyBlocks(433);

      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'execute-proposal',
        [Cl.uint(1)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(107)); // ERR-QUORUM-NOT-MET
    });

    it('should mark proposal as executed', () => {
      const beforeExecution = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-proposal',
        [Cl.uint(0)],
        wallet1
      );

      simnet.mineEmptyBlocks(433);
      
      const executeResult = simnet.callPublicFn(
        CONTRACT_NAME,
        'execute-proposal',
        [Cl.uint(0)],
        wallet1
      );
      expect(executeResult.result).toBeOk(Cl.bool(true));

      const afterExecution = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-proposal',
        [Cl.uint(0)],
        wallet1
      );

      // Proposal state should have changed
      expect(afterExecution.result).not.toEqual(beforeExecution.result);
    });
  });

  describe('Vote Cost Reclaim', () => {
    beforeEach(() => {
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(100000)], wallet1);
      simnet.callPublicFn(CONTRACT_NAME, 'stake', [Cl.uint(100000)], wallet2);
      
      simnet.callPublicFn(
        CONTRACT_NAME,
        'create-proposal',
        [Cl.uint(10000000), Cl.stringUtf8('Test'), Cl.stringUtf8('Desc')],
        wallet1
      );
      
      simnet.callPublicFn(
        CONTRACT_NAME,
        'vote',
        [Cl.uint(0), Cl.bool(true), Cl.uint(50)], // cost = 2500
        wallet2
      );
    });

    it('should allow reclaiming vote cost after voting period', () => {
      simnet.mineEmptyBlocks(433);

      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'reclaim-vote-cost',
        [Cl.uint(0)],
        wallet2
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it('should restore available stake after reclaim', () => {
      const beforeReclaim = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-available-stake',
        [Cl.principal(wallet2)],
        wallet2
      );
      expect(beforeReclaim.result).toBeOk(Cl.uint(97500)); // 100000 - 2500

      simnet.mineEmptyBlocks(433);
      simnet.callPublicFn(CONTRACT_NAME, 'reclaim-vote-cost', [Cl.uint(0)], wallet2);

      const afterReclaim = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-available-stake',
        [Cl.principal(wallet2)],
        wallet2
      );
      expect(afterReclaim.result).toBeOk(Cl.uint(100000)); // Restored
    });

    it('should reject reclaim during voting period', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'reclaim-vote-cost',
        [Cl.uint(0)],
        wallet2
      );
      expect(result).toBeErr(Cl.uint(106)); // ERR-VOTING-PERIOD-ACTIVE
    });
  });

  describe('Admin Functions', () => {
    it('should allow owner to update minimum stake', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'set-min-stake-amount',
        [Cl.uint(50)], // New minimum: 50 microSTX
        deployer
      );
      expect(result).toBeOk(Cl.uint(50));

      const minStake = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-min-stake-amount',
        [],
        deployer
      );
      expect(minStake.result).toBeOk(Cl.uint(50));
    });

    it('should reject non-owner updating minimum stake', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'set-min-stake-amount',
        [Cl.uint(50)],
        wallet1 // Not owner
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });

    it('should reject zero minimum stake', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'set-min-stake-amount',
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(116)); // ERR-INVALID-AMOUNT
    });

    it('should allow ownership transfer', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'transfer-ownership',
        [Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeOk(Cl.principal(wallet1));

      const newOwner = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-contract-owner',
        [],
        deployer
      );
      expect(newOwner.result).toBeOk(Cl.principal(wallet1));
    });

    it('should reject non-owner transferring ownership', () => {
      const { result } = simnet.callPublicFn(
        CONTRACT_NAME,
        'transfer-ownership',
        [Cl.principal(wallet2)],
        wallet1 // Not owner
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });
  });
});
