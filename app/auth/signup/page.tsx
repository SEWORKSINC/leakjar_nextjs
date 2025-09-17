'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, User, CheckCircle, Shield } from 'lucide-react';

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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/auth/login" className="font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <Alert className={`mb-4 ${isSuccess ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'}`}>
              {isSuccess && <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
              <AlertDescription className={isSuccess ? 'text-gray-700 dark:text-gray-300' : 'text-red-800 dark:text-red-400'}>
                {message}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="mt-1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
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
                autoComplete="new-password"
                required
                className="mt-1"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
          </div>

          <div className="text-sm text-center">
            <span className="text-gray-600 dark:text-gray-400">
              By signing up, you agree to our{' '}
            </span>
            <Link href="#" className="font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Terms of Service
            </Link>
            <span className="text-gray-600 dark:text-gray-400"> and </span>
            <Link href="#" className="font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Privacy Policy
            </Link>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}