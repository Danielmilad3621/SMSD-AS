import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScoutLogo } from '@/components/ScoutLogo';
import { Button } from '@/components/ui/button';

const REDIRECT_DELAY = 2000; // 2 seconds

export default function Splash() {
  const navigate = useNavigate();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        navigate('/login');
      } catch {
        // If navigation fails, show fallback button
        setShowFallback(true);
      }
    }, REDIRECT_DELAY);

    // Show fallback after an additional delay if still on page
    const fallbackTimer = setTimeout(() => {
      setShowFallback(true);
    }, REDIRECT_DELAY + 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [navigate]);

  const handleManualNavigate = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background bg-gradient-surface">
      {/* Main content */}
      <div className="flex flex-col items-center gap-8 animate-fade-in">
        {/* Logo */}
        <ScoutLogo size="lg" animated />

        {/* Brand name */}
        <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">
          Scout
        </h1>

        {/* Tagline */}
        <p className="text-muted-foreground text-sm tracking-wide uppercase">
          Secure Access Portal
        </p>
      </div>

      {/* Fallback button */}
      {showFallback && (
        <div className="absolute bottom-24 animate-fade-in-up">
          <Button
            variant="ghost"
            onClick={handleManualNavigate}
            className="text-muted-foreground hover:text-foreground"
          >
            Continue to login →
          </Button>
        </div>
      )}

      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
