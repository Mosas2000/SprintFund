export interface GovernanceReceipt {
    txId: string;
    proposalId: string;
    voteType: 'YES' | 'NO' | 'ABSTAIN';
    weight: number;
    cost: number;
    timestamp: string;
}

export function generateReceiptText(receipt: GovernanceReceipt) {
    return `
--------------------------------------------------
      SPRINTFUND GOVERNANCE RECEIPT
--------------------------------------------------
TIMESTAMP: ${receipt.timestamp}
TX_ID:     ${receipt.txId}
--------------------------------------------------
PROPOSAL:  #${receipt.proposalId}
ACTION:    VOTE_${receipt.voteType}
WEIGHT:    ${receipt.weight}
COST:      ${receipt.cost} STX
--------------------------------------------------
VERIFIED ON STACKS BLOCKCHAIN
Radical Transparency in Micro-Grants
--------------------------------------------------
  `.trim();
}

export function downloadReceipt(receipt: GovernanceReceipt) {
    const text = generateReceiptText(receipt);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_prop_${receipt.proposalId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
