'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/mobile-nav';
import { Breadcrumbs } from '@/components/breadcrumbs';

export function SharedHeader() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        {/* <Link 
          href="/" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="LeakJar Home"
        >
          <Shield className="h-8 w-8 text-gray-700" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-gray-900">LeakJar</h1>
        </Link> */}

        <Link 
          href="/" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer md:hidden"
          aria-label="LeakJar Home"
        >
          <div className="w-6 h-6 svg-lgs"></div>
        </Link>

        <Link 
          href="/" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer hidden md:block"
          aria-label="LeakJar Home"
        >
          <div className="w-30 h-6 svg-lg"></div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6" aria-label="Main navigation">
          <Link 
            href="/features" 
            className={`transition-colors ${
              isActive('/features') 
                ? 'text-gray-900 font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Features
          </Link>
          <Link 
            href="/solutions" 
            className={`transition-colors ${
              isActive('/solutions') 
                ? 'text-gray-900 font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Solutions
          </Link>
          <Link 
            href="/about" 
            className={`transition-colors ${
              isActive('/about') 
                ? 'text-gray-900 font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            About Us
          </Link>
          <Link 
            href="/developer" 
            className={`transition-colors ${
              isActive('/developer') 
                ? 'text-gray-900 font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Developer
          </Link>
          <Link 
            href="/pricing" 
            className={`transition-colors ${
              isActive('/pricing') 
                ? 'text-gray-900 font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pricing
          </Link>
          <Link 
            href="/contact" 
            className={`transition-colors ${
              isActive('/contact') 
                ? 'text-gray-900 font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex space-x-3">
          <Link href="/auth/login">
            <Button variant="outline" className="border-gray-300">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-gray-700 hover:bg-gray-800">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
        </div>
      </header>
      
      {/* Breadcrumbs */}
      <Breadcrumbs />
    </>
  );
}

