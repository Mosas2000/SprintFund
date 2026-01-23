'use client';

interface VotingPowerSystemProps {
  reputation: number;
  baseVotingPower: number;
}

export default function VotingPowerSystem({ reputation, baseVotingPower }: VotingPowerSystemProps) {
  const calculateMultiplier = (rep: number) => {
    if (rep >= 1000) return 1.5;
    if (rep >= 500) return 1.3;
    if (rep >= 100) return 1.2;
    return 1.0;
  };

  const multiplier = calculateMultiplier(reputation);
  const enhancedPower = baseVotingPower * multiplier;
  const bonus = enhancedPower - baseVotingPower;

  return (
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
      <h3 className="text-xl font-bold mb-4">Your Voting Power</h3>
      
      <div className="mb-6">
        <div className="text-4xl font-bold mb-2">{enhancedPower.toFixed(1)}</div>
        <div className="text-sm opacity-90">Total Voting Power</div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center p-3 bg-white/10 rounded">
          <span>Base Power</span>
          <span className="font-semibold">{baseVotingPower}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-white/10 rounded">
          <span>Reputation Multiplier</span>
          <span className="font-semibold">{multiplier}x</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-green-500/30 rounded border border-green-400/50">
          <span className="flex items-center gap-1">
            ⚡ Bonus Power
          </span>
          <span className="font-bold">+{bonus.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-4 bg-white/10 rounded-lg">
        <h4 className="font-semibold mb-2 text-sm">Multiplier Tiers</h4>
        <div className="space-y-1 text-xs opacity-90">
          <div className="flex justify-between">
            <span>1000+ Rep:</span>
            <span className="font-semibold">1.5x Power</span>
          </div>
          <div className="flex justify-between">
            <span>500+ Rep:</span>
            <span className="font-semibold">1.3x Power</span>
          </div>
          <div className="flex justify-between">
            <span>100+ Rep:</span>
            <span className="font-semibold">1.2x Power</span>
          </div>
        </div>
      </div>
    </div>
  );
}
