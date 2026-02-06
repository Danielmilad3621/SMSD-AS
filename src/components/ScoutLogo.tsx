import { cn } from '@/lib/utils';

interface ScoutLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
};

export function ScoutLogo({ className, size = 'md', animated = false }: ScoutLogoProps) {
  return (
    <div 
      className={cn(
        'relative flex items-center justify-center',
        sizeClasses[size],
        animated && 'animate-pulse-subtle',
        className
      )}
    >
      {/* Outer ring with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-20" />
      
      {/* Inner circle */}
      <div className="absolute inset-2 rounded-full bg-card border border-border" />
      
      {/* Logo mark - Abstract compass/scout symbol */}
      <svg
        viewBox="0 0 100 100"
        className={cn(
          'relative z-10 w-1/2 h-1/2',
          animated ? 'text-primary' : 'text-foreground'
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Compass needle pointing up */}
        <path d="M50 15 L50 40" />
        <path d="M50 60 L50 85" />
        <path d="M15 50 L40 50" />
        <path d="M60 50 L85 50" />
        
        {/* Center diamond */}
        <path d="M50 35 L65 50 L50 65 L35 50 Z" fill="currentColor" opacity="0.2" />
        <path d="M50 35 L65 50 L50 65 L35 50 Z" />
        
        {/* Directional indicator */}
        <circle cx="50" cy="50" r="5" fill="currentColor" />
      </svg>
      
      {/* Subtle glow effect */}
      {animated && (
        <div className="absolute inset-0 rounded-full shadow-glow" />
      )}
    </div>
  );
}
