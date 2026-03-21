import type { Transaction, TransactionStatus, TransactionType } from '../types/transaction';

export function exportTransactionsAsCSV(transactions: Transaction[]): string {
  if (transactions.length === 0) {
    return 'No transactions to export';
  }

  const headers = [
    'Transaction ID',
    'Type',
    'Status',
    'Timestamp',
    'Proposal ID',
    'Amount (STX)',
    'Title',
    'Block Height',
    'Confirmations',
  ];

  const rows = transactions.map((tx) => [
    tx.id,
    tx.type,
    tx.status,
    new Date(tx.timestamp).toISOString(),
    tx.proposalId?.toString() || '',
    tx.amount ? (tx.amount / 1_000_000).toFixed(6) : '',
    tx.title || '',
    tx.blockHeight?.toString() || '',
    tx.confirmations?.toString() || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(','),
    ),
  ].join('\n');

  return csvContent;
}

export function downloadTransactionsCSV(transactions: Transaction[]): void {
  const csv = exportTransactionsAsCSV(transactions);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `transactions-${new Date().toISOString().split('T')[0]}.csv`,
  );
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function filterTransactionsByDateRange(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date,
): Transaction[] {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  return transactions.filter((tx) => tx.timestamp >= startTime && tx.timestamp <= endTime);
}

export function getTransactionStats(transactions: Transaction[]) {
  const total = transactions.length;
  const confirmed = transactions.filter((tx) => tx.status === 'confirmed').length;
  const pending = transactions.filter((tx) => tx.status === 'pending').length;
  const failed = transactions.filter((tx) => tx.status === 'failed').length;
  const dropped = transactions.filter((tx) => tx.status === 'dropped').length;

  const byType = transactions.reduce(
    (acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + 1;
      return acc;
    },
    {} as Record<TransactionType, number>,
  );

  const totalAmount = transactions
    .filter((tx) => tx.amount)
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  return {
    total,
    confirmed,
    pending,
    failed,
    dropped,
    byType,
    totalAmount: totalAmount / 1_000_000,
    successRate: total > 0 ? Math.round((confirmed / total) * 100) : 0,
  };
}

export function sortTransactionsByDate(
  transactions: Transaction[],
  order: 'asc' | 'desc' = 'desc',
): Transaction[] {
  const sorted = [...transactions];
  sorted.sort((a, b) => {
    const diff = a.timestamp - b.timestamp;
    return order === 'desc' ? -diff : diff;
  });
  return sorted;
}

export function groupTransactionsByStatus(transactions: Transaction[]): Record<TransactionStatus, Transaction[]> {
  return transactions.reduce(
    (acc, tx) => {
      if (!acc[tx.status]) {
        acc[tx.status] = [];
      }
      acc[tx.status].push(tx);
      return acc;
    },
    {} as Record<TransactionStatus, Transaction[]>,
  );
}

export function groupTransactionsByType(transactions: Transaction[]): Record<TransactionType, Transaction[]> {
  return transactions.reduce(
    (acc, tx) => {
      if (!acc[tx.type]) {
        acc[tx.type] = [];
      }
      acc[tx.type].push(tx);
      return acc;
    },
    {} as Record<TransactionType, Transaction[]>,
  );
}

export function calculateAverageConfirmationTime(transactions: Transaction[]): number {
  const confirmed = transactions.filter(
    (tx) => tx.status === 'confirmed' && tx.blockHeight,
  );

  if (confirmed.length === 0) return 0;

  const totalTime = confirmed.reduce((sum, tx) => {
    const blockTime = (tx.blockHeight || 0) * 10 * 60 * 1000;
    return sum + (blockTime - tx.timestamp);
  }, 0);

  return Math.round(totalTime / confirmed.length / 1000 / 60);
}
