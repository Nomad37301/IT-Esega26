import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Server-side optimized image component
 * This uses the Laravel backend to serve optimized images
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 80,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if we need to convert the src to an optimized version
  let optimizedSrc = src;
  
  // Only optimize local images (not external URLs)
  if (src && !src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
    // Remove leading slash if present
    const path = src.startsWith('/') ? src.substring(1) : src;
    
    // Build optimized URL with query parameters
    const params = [];
    if (width) params.push(`w=${width}`);
    if (quality !== 80) params.push(`q=${quality}`);
    
    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    optimizedSrc = `/optimized-images/${path}${queryString}`;
  }

  return (
    <div className={`relative inline-block overflow-hidden ${!isLoaded ? 'bg-gray-100' : ''}`} 
         style={{ width: width ? `${width}px` : 'auto', height: height ? `${height}px` : 'auto' }}>
      {!isLoaded && (
        <div 
          className="absolute inset-0 animate-pulse bg-gray-200" 
          style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
        />
      )}
      
      <img
        src={optimizedSrc}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
} 