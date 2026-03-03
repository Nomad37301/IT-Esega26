import React, { useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  blurhash?: string;
  placeholderColor?: string;
}

/**
 * Optimized Image component with lazy loading
 */
export default function Image({
  src,
  alt,
  className = '',
  width,
  height,
  placeholderColor = '#f3f4f6',
  ...props
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if we can optimize the image URL
  let optimizedSrc = src;
  
  // For large images (detect by file extension)
  if (src.match(/\.(jpe?g|png)$/i) && !src.includes('?')) {
    // Add a quality parameter if it doesn't have one
    optimizedSrc = `${src}?q=80`;
  }

  // Get placeholder style
  const placeholderStyle = {
    backgroundColor: placeholderColor,
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
  };

  return (
    <div className={`relative overflow-hidden ${isLoaded ? '' : 'bg-gray-100'}`} style={{ width, height }}>
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={placeholderStyle}
          aria-hidden="true"
        />
      )}
      
      <img
        src={optimizedSrc}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
} 