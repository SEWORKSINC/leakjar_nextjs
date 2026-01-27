'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, User, CheckCircle2, Shield, ArrowRight, Activity, Database, AlertTriangle } from 'lucide-react';
import { trackSignupStarted, trackSignupSuccess, trackSignupError } from '@/lib/vercel-analytics';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track signup form submission started
    trackSignupStarted('signup-page');
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setIsSuccess(false);
      trackSignupError('passwords_mismatch');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setIsSuccess(false);
      trackSignupError('password_too_short');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        setIsSuccess(false);
        trackSignupError(error.message);
      } else {
        setMessage('Please check your email for the verification link!');
        setIsSuccess(true);
        trackSignupSuccess();
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?message=Please verify your email before logging in');
        }, 3000);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setMessage('An unexpected error occurred. Please try again.');
      setIsSuccess(false);
      trackSignupError('unexpected_error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex">
      {/* Left Side - Signup Form */}
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
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Join LeakJar and start monitoring credential breaches
            </p>
          </div>

          {/* Signup Card */}
          <Card className="border-gray-200 shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {message && (
                  <Alert className={isSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    {isSuccess && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    {!isSuccess && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    <AlertDescription className={isSuccess ? 'text-green-800' : 'text-red-800'}>
                      {message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Full Name
                    </Label>
                    <div className="mt-1.5 relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="John Doe"
                        className="pl-10 h-11 border-gray-300 focus:border-gray-700 focus:ring-gray-700"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

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
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Password
                    </Label>
                    <div className="mt-1.5 relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="Minimum 6 characters"
                        className="pl-10 h-11 border-gray-300 focus:border-gray-700 focus:ring-gray-700"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                      Confirm Password
                    </Label>
                    <div className="mt-1.5 relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="Re-enter password"
                        className="pl-10 h-11 border-gray-300 focus:border-gray-700 focus:ring-gray-700"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                      <Shield className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 leading-relaxed">
                  By signing up, you agree to our{' '}
                  <Link href="#" className="font-medium text-gray-700 hover:text-gray-900 underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="#" className="font-medium text-gray-700 hover:text-gray-900 underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <Link href="/auth/login">
                  <Button 
                    variant="outline" 
                    className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Sign In
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
            Monitor 50B+ Leaked Credentials
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Detect compromised employee and customer accounts before they're exploited by attackers.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Real-Time Breach Detection</h3>
                <p className="text-gray-400 text-sm">
                  Get instant alerts when your organization's credentials appear in new data breaches
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">HUMINT Intelligence Network</h3>
                <p className="text-gray-400 text-sm">
                  Access exclusive threat data from underground forums and dark web sources
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Comprehensive Analytics</h3>
                <p className="text-gray-400 text-sm">
                  Detailed forensic data including IPs, geolocations, and breach sources
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">API Integration</h3>
                <p className="text-gray-400 text-sm">
                  Seamlessly integrate breach monitoring into your security workflow
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold text-white mb-1">50B+</div>
              <div className="text-sm text-gray-400">Credential Records</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-gray-400">Monitoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">&lt;1hr</div>
              <div className="text-sm text-gray-400">Alert Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
