import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ScoutLogo } from '@/components/ScoutLogo';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { notifyUserLogin, notifyAccessDenied } from '@/lib/n8n';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type ViewState = 'login' | 'loading' | 'access-granted' | 'access-denied';

export default function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAllowed, signIn } = useAuth();
  
  const [viewState, setViewState] = useState<ViewState>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle auth state changes
  useEffect(() => {
    if (authLoading) return;

    if (user && isAllowed === true) {
      setViewState('access-granted');
      // Notify n8n of successful login (fire and forget)
      notifyUserLogin(user.id, user.email || '');
    } else if (user && isAllowed === false) {
      setViewState('access-denied');
      // Notify n8n of access denied
      notifyAccessDenied(user.email || '');
    } else if (!user) {
      setViewState('login');
    }
  }, [user, isAllowed, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setViewState('loading');

    try {
      const { error: authError } = await signIn(email, password);
      
      if (authError) {
        setError(authError.message);
        setViewState('login');
      }
      // Success is handled by the useEffect watching auth state
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setViewState('login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setViewState('login');
  };

  // Show loading state while checking initial auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background bg-gradient-surface">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background bg-gradient-surface">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo and title */}
        <div className="flex flex-col items-center mb-8">
          <ScoutLogo size="md" className="mb-4" />
          <h1 className="text-2xl font-display font-bold text-foreground">Scout</h1>
        </div>

        {/* Login Form */}
        {viewState === 'login' && (
          <div className="animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isSubmitting}
                  className="bg-card border-border focus:ring-primary"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-muted-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                  className="bg-card border-border focus:ring-primary"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive animate-slide-up">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" className="mx-auto" />
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {viewState === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground text-sm">Verifying access...</p>
          </div>
        )}

        {/* Access Granted */}
        {viewState === 'access-granted' && (
          <div className="flex flex-col items-center gap-4 py-8 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground">
              Access Granted
            </h2>
            <p className="text-muted-foreground text-sm text-center">
              Welcome back, {user?.email}
            </p>
          </div>
        )}

        {/* Access Denied */}
        {viewState === 'access-denied' && (
          <div className="flex flex-col items-center gap-4 py-8 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground">
              Access Denied
            </h2>
            <p className="text-muted-foreground text-sm text-center max-w-xs">
              Your account is not authorized to access this application.
            </p>
            <Button
              variant="ghost"
              onClick={handleBackToLogin}
              className="mt-2 text-muted-foreground hover:text-foreground"
            >
              ← Back to login
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="text-xs text-muted-foreground/60">
          Secure access portal
        </p>
      </div>
    </div>
  );
}
