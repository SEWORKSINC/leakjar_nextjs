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
import { Badge } from '@/components/ui/badge';
import { Mail, Lock, User, CheckCircle2, Shield, ArrowRight, Zap, Eye, AlertTriangle } from 'lucide-react';

export default function FreeTierSignupPage() {
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
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setIsSuccess(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setIsSuccess(false);
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
      } else {
        setMessage('Please check your email for the verification link!');
        setIsSuccess(true);
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
              Start Free Tier
            </h1>
            <p className="text-gray-600">
              No credit card required • Full feature access
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
                      Work Email
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
                      Create Free Account
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
              Join security teams monitoring 50B+ leaked credentials
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Value Proposition (Hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 items-center justify-center p-12">
        <div className="max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Start Protecting Your Organization in Minutes
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Get instant access to our credential monitoring platform. No credit card required.
          </p>

          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Full Feature Access</h3>
                <p className="text-gray-400 text-sm">
                  Access all features with limited results (latest 5 breach records)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Instant Setup</h3>
                <p className="text-gray-400 text-sm">
                  Start monitoring your domain for breaches immediately after signup
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">No Credit Card Required</h3>
                <p className="text-gray-400 text-sm">
                  Evaluate the platform risk-free. Upgrade anytime for full data access
                </p>
              </div>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">What You'll Get:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">Email alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">Dashboard access</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">1 domain monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">Latest 5 records</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

