'use client';

import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import Image, { ImageProps } from 'next/image';

export interface SkeletonImageProps extends ImageProps {
  wrapperClassName?: string;
  skeletonClassName?: string;
  showShimmerIcon?: boolean;
}

const SkeletonImage = forwardRef<HTMLImageElement, SkeletonImageProps>(function SkeletonImage(
  {
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
  },
  forwardedRef
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Check if image is already completed by the browser (cache, preloaded, or bfcache)
  const checkComplete = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;
    if (img.complete) {
      if (img.naturalWidth > 0) {
        setIsLoaded(true);
        setIsError(false);
      } else if (img.src) {
        setIsLoaded(true);
        setIsError(true);
      }
    }
  }, []);

  const handleRef = useCallback(
    (node: HTMLImageElement | null) => {
      imgRef.current = node;
      if (node) {
        checkComplete(node);
      }
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLImageElement | null>).current = node;
      }
    },
    [checkComplete, forwardedRef]
  );

  // Monitor src changes and provide safety timeout fallback for iOS Safari WebKit
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);

    if (imgRef.current) {
      checkComplete(imgRef.current);
    }

    // Safety timeout: If iOS Safari stalls on synthetic onLoad or decode() due to WebKit bugs,
    // gracefully reveal the image after 2 seconds so the user is never stuck on an endless shimmer.
    const timer = setTimeout(() => {
      setIsLoaded((prev) => {
        if (!prev) {
          if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth === 0) {
            setIsError(true);
          }
          return true;
        }
        return prev;
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [src, checkComplete]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    setIsError(false);
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    setIsError(true);
    onError?.(e);
  };

  const skeletonOverlay = (
    <div
      className={`absolute inset-0 z-[1] bg-[#FAF3F5] transition-opacity duration-300 ease-out pointer-events-none rounded-[inherit] ${
        isLoaded || isError ? 'opacity-0' : 'opacity-100 animate-shimmer'
      } ${skeletonClassName}`}
      aria-hidden="true"
    >
      {showShimmerIcon && !isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#DFB758]/40 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );

  const errorFallback = isError && (
    <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center bg-[#FAF3F5] text-[#A59A9E] p-2 text-center rounded-[inherit]">
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

  if (!src) {
    return (
      <div className={`relative ${fill ? 'w-full h-full' : 'inline-block'} ${wrapperClassName}`}>
        {errorFallback}
      </div>
    );
  }

  if (fill) {
    return (
      <>
        {skeletonOverlay}
        {errorFallback}
        <Image
          ref={handleRef}
          src={src}
          alt={alt}
          fill
          className={`transition-opacity duration-300 ease-out ${className}`}
          onLoad={handleLoad}
          onError={handleError}
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
        ref={handleRef}
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ease-out ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
});

export default SkeletonImage;
