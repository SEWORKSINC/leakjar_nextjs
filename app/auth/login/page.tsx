'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Lock, Shield, InfoIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { trackLoginSuccess, trackLoginError } from '@/lib/vercel-analytics';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const msg = searchParams.get('message');
    const redirectedFrom = searchParams.get('redirectedFrom');

    if (msg) {
      setMessage(msg);
    } else if (redirectedFrom) {
      setMessage('Please sign in to access this page.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message);
        trackLoginError(error.message);
      } else if (data?.session) {
        trackLoginSuccess('email');
        router.refresh();
        const redirectedFrom = searchParams.get('redirectedFrom');
        router.push(redirectedFrom || '/dashboard');
      } else {
        setError('Login failed. Please try again.');
        trackLoginError('no_session');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      trackLoginError('unexpected_error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <Link 
              href="/" 
              className="inline-flex flex-col items-center group mb-4"
              title="Back to LeakJar Home"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-xl mb-2 shadow-lg group-hover:bg-gray-800 group-hover:scale-105 transition-all">
                <Shield className="h-9 w-9 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                LeakJar
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to access your LeakJar dashboard
            </p>
          </div>

          {/* Login Card */}
          <Card className="border-gray-200 shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {message && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <InfoIcon className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      {message}
                    </AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email Address
                    </Label>
                    <div className="mt-1.5 relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@company.com"
                        className="pl-10 h-11 border-gray-300 focus:border-gray-700 focus:ring-gray-700"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label htmlFor="password" className="text-gray-700 font-medium">
                        Password
                      </Label>
                      <Link 
                        href="#" 
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        placeholder="••••••••"
                        className="pl-10 h-11 border-gray-300 focus:border-gray-700 focus:ring-gray-700"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gray-700 hover:bg-gray-800 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Lock className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">New to LeakJar?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link href="/auth/signup">
                  <Button 
                    variant="outline" 
                    className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicator */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Trusted by security teams worldwide to protect against credential breaches
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Feature Highlights (Hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 items-center justify-center p-12">
        <div className="max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Protect Your Organization from Credential Breaches
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Monitor 50B+ leaked credentials and detect compromised accounts before they're exploited.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Real-Time Alerts</h3>
                <p className="text-gray-400 text-sm">
                  Get instant notifications when credentials appear in new breaches
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">HUMINT Intelligence</h3>
                <p className="text-gray-400 text-sm">
                  Access threat data from underground networks and dark web sources
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Actionable Insights</h3>
                <p className="text-gray-400 text-sm">
                  Detailed forensic data including IPs, geolocations, and breach sources
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold text-white mb-1">50B+</div>
              <div className="text-sm text-gray-400">Credential Records</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-gray-400">Threat Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}