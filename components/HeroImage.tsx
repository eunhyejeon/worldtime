// Use correct root path - Vite serves /public files at root
const heroImage = '/hero.png';

interface HeroImageProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: { width: 200, height: 150 },
  md: { width: 300, height: 225 },
  lg: { width: 400, height: 300 },
  xl: { width: 500, height: 375 }
};

export function HeroImage({ className = "", size = 'lg' }: HeroImageProps) {
  const { width, height } = sizeMap[size];
  
  return (
    <img
      src={heroImage}
      alt="World Time - Pixel Globe Character with Clock"
      width={width}
      height={height}
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