import { memo } from 'react';
import { formatBlockHeight, formatBlockHeightShort } from '../lib/block-height';

interface BlockHeightDisplayProps {
  blockHeight: number | null | undefined;
  format?: 'full' | 'short';
  className?: string;
  showTitle?: boolean;
}

export const BlockHeightDisplay = memo(function BlockHeightDisplay({
  blockHeight,
  format = 'full',
  className = '',
  showTitle = true,
}: BlockHeightDisplayProps) {
  const fullFormat = formatBlockHeight(blockHeight);
  const shortFormat = formatBlockHeightShort(blockHeight);
  const displayed = format === 'full' ? fullFormat : shortFormat;
  const title = showTitle && format === 'short' ? fullFormat : undefined;

  return (
    <span className={className} title={title}>
      {displayed}
    </span>
  );
});
