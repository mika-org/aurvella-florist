'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

export interface SkeletonImageProps extends ImageProps {
  wrapperClassName?: string;
  skeletonClassName?: string;
  showShimmerIcon?: boolean;
}

export default function SkeletonImage({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  skeletonClassName = '',
  showShimmerIcon = false,
  onLoad,
  onError,
  fill,
  ...props
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const skeletonOverlay = !isLoaded && !isError && (
    <div
      className={`absolute inset-0 z-[1] animate-shimmer pointer-events-none rounded-[inherit] ${skeletonClassName}`}
      aria-hidden="true"
    >
      {showShimmerIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#DFB758]/40 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );

  const errorFallback = isError && (
    <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center bg-[#FAF3F5] text-[#A59A9E] p-2 text-center rounded-[inherit]">
      <svg
        className="w-6 h-6 stroke-current mb-1 opacity-60"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className="text-[10px] font-medium leading-tight line-clamp-1">{alt || 'Gambar'}</span>
    </div>
  );

  if (fill) {
    return (
      <>
        {skeletonOverlay}
        {errorFallback}
        <Image
          src={src}
          alt={alt}
          fill
          className={`transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={(e) => {
            setIsLoaded(true);
            onLoad?.(e);
          }}
          onError={(e) => {
            setIsLoaded(true);
            setIsError(true);
            onError?.(e);
          }}
          {...props}
        />
      </>
    );
  }

  return (
    <div className={`relative inline-block overflow-hidden ${wrapperClassName}`}>
      {skeletonOverlay}
      {errorFallback}
      <Image
        src={src}
        alt={alt}
        className={`transition-opacity duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setIsLoaded(true);
          setIsError(true);
          onError?.(e);
        }}
        {...props}
      />
    </div>
  );
}
