import pixelGlobeImage from 'figma:asset/e605a7de666dfd2d1fbac1d6d0fec918525e3513.png';

interface PixelGlobeIconProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function PixelGlobeIcon({ 
  size = 32, 
  className = "", 
  animate = false 
}: PixelGlobeIconProps) {
  return (
    <img
      src={pixelGlobeImage}
      alt="Pixel Globe Character with Clock"
      width={size}
      height={size}
      className={`pixelated ${animate ? 'animate-bounce' : ''} ${className}`}
      style={{
        imageRendering: 'pixelated',
        imageRendering: '-moz-crisp-edges',
        imageRendering: '-webkit-crisp-edges',
        imageRendering: 'crisp-edges'
      }}
    />
  );
}

// Spinning variant for loading states
export function SpinningPixelGlobeIcon({ 
  size = 32, 
  className = "" 
}: PixelGlobeIconProps) {
  return (
    <img
      src={pixelGlobeImage}
      alt="Loading Pixel Globe with Clock"
      width={size}
      height={size}
      className={`pixelated animate-spin ${className}`}
      style={{
        imageRendering: 'pixelated',
        imageRendering: '-moz-crisp-edges',
        imageRendering: '-webkit-crisp-edges',
        imageRendering: 'crisp-edges'
      }}
    />
  );
}

// Large variant for hero sections
export function LargePixelGlobeIcon({ 
  size = 96, 
  className = "" 
}: PixelGlobeIconProps) {
  return (
    <img
      src={pixelGlobeImage}
      alt="Large Pixel Globe Character with Clock"
      width={size}
      height={size}
      className={`pixelated ${className}`}
      style={{
        imageRendering: 'pixelated',
        imageRendering: '-moz-crisp-edges',
        imageRendering: '-webkit-crisp-edges',
        imageRendering: 'crisp-edges'
      }}
    />
  );
}