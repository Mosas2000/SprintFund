import React, { useEffect } from 'react';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  threshold?: number;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  isLoading,
  hasMore,
  threshold = 200,
}) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (
        !isLoading &&
        hasMore &&
        scrollTop + windowHeight >= documentHeight - threshold
      ) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, isLoading, hasMore, threshold]);

  return null;
};
