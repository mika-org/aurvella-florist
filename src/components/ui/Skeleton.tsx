import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-xl ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}
