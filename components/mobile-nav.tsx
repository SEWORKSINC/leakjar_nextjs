'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <nav
            id="mobile-menu"
            className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link 
                href="/" 
                className="flex items-center space-x-2"
                onClick={closeMenu}
              >
                <Shield className="h-6 w-6 text-gray-700" />
                <span className="text-lg font-bold text-gray-900">LeakJar</span>
              </Link>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col p-4 space-y-1">
              <Link
                href="/features"
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors font-medium"
                onClick={closeMenu}
              >
                Features
              </Link>
              <Link
                href="/solutions"
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors font-medium"
                onClick={closeMenu}
              >
                Solutions
              </Link>
              <Link
                href="/about"
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors font-medium"
                onClick={closeMenu}
              >
                About Us
              </Link>
              <Link
                href="/developer"
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors font-medium"
                onClick={closeMenu}
              >
                Developer
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors font-medium"
                onClick={closeMenu}
              >
                Pricing
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t mx-4 my-2" />

            {/* Auth Buttons */}
            <div className="flex flex-col p-4 space-y-3">
              <Link href="/auth/login" onClick={closeMenu}>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={closeMenu}>
                <Button className="w-full bg-gray-700 hover:bg-gray-800">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                © 2025 SEW Inc.
              </p>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}

