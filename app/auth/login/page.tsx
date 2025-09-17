'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Shield, InfoIcon } from 'lucide-react';

export default function LoginPage() {
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
      } else if (data?.session) {
        // 서버 상태를 새로고침
        router.refresh();
        // 원래 가려던 페이지 또는 대시보드로 이동
        const redirectedFrom = searchParams.get('redirectedFrom');
        router.push(redirectedFrom || '/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 shadow-md p-8 text-center">
          <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gray-700 dark:bg-gray-600 flex items-center justify-center">
              <Shield className="h-10 w-10 text-gray-300" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/auth/signup" className="font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <Alert className="border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <InfoIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <AlertDescription className="text-gray-700 dark:text-gray-300">
                {message}
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <AlertDescription className="text-red-800 dark:text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="#" className="font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}